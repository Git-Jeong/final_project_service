from flask import Flask, request, Response
from dotenv import load_dotenv
import os
import mysql.connector
import json
from datetime import datetime, timedelta
from decimal import Decimal
import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
import keras
from tensorflow.keras.utils import get_custom_objects
from tensorflow.keras import Model, Input
from tensorflow.keras.layers import (Conv1D, Bidirectional, LSTM, LayerNormalization, Dense, Concatenate)
from tensorflow.keras.optimizers import AdamW

# ① BahdanauAttention 정의 (custom layer)
class BahdanauAttention(tf.keras.layers.Layer):
    def __init__(self, units, **kwargs):
        super().__init__(**kwargs)
        self.W1 = tf.keras.layers.Dense(units)
        self.W2 = tf.keras.layers.Dense(units)
        self.V  = tf.keras.layers.Dense(1)
    def call(self, values, query):
        hidden = tf.expand_dims(query, 1)
        score  = self.V(tf.nn.tanh(self.W1(values) + self.W2(hidden)))
        weights= tf.nn.softmax(score, axis=1)
        context= tf.reduce_sum(weights * values, axis=1)
        return context, weights

# ② 모델 아키텍처 코드 (학습 때 쓰신 것과 완전히 동일하게)
inp = Input(shape=(60,11), name="input")

x = Conv1D(128,3,activation='tanh',padding='same', name="conv1d_tanh")(inp)
x = Bidirectional(LSTM(64, return_sequences=True), name="bilstm_1")(x)
x = LayerNormalization(name="ln_1")(x)
x = Bidirectional(LSTM(32, return_sequences=True), name="bilstm_2")(x)
x = LayerNormalization(name="ln_2")(x)
x = Bidirectional(LSTM(16, return_sequences=True), name="bilstm_3")(x)

# 마지막 Bi-LSTM (return_state=True)
lstm_out, f_h, f_c, b_h, b_c = Bidirectional(
    LSTM(8, return_sequences=True, return_state=True),
    name="bilstm_4"
)(x)
state_h = Concatenate()([f_h, b_h])

# Bahdanau 어텐션 적용
context, attn_w = BahdanauAttention(16)(lstm_out, state_h)

# 출력
out = Dense(3, activation='linear', name="output")(context)
model = Model(inp, out, name="conv_lstm_rnn_attention")

# ③ 컴파일 (학습 때 쓰신 설정과 동일하게)
model.compile(
    loss='mse',
    optimizer=AdamW(learning_rate=0.00025, weight_decay=0.004, beta_1=0.95),
    metrics=[tf.keras.metrics.MeanAbsoluteError(), tf.keras.metrics.RootMeanSquaredError()]
)

# 이 파일(app.py)이 위치한 디렉터리 구하기
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

#  데이터 폴더까지의 상대 경로 연결
PIPELINE_PATH = os.path.join(BASE_DIR, 'data', 'feature_pipelines_v2.pkl')
WEIGHTS_PATH = os.path.join(BASE_DIR, 'data', 'my_lstm_model_30s_v5.weights.h5')
# 가중치만 로드
model.load_weights(WEIGHTS_PATH)

load_dotenv()
app = Flask(__name__)

# ✅ DB 설정 (환경변수에서 불러오기)
db_config = {
    'host': os.getenv('MYSQL_HOST'),
    'port': int(os.getenv('MYSQL_PORT')),
    'user': os.getenv('MYSQL_USER'),
    'password': os.getenv('MYSQL_PASSWORD'),
    'database': os.getenv('MYSQL_DATABASE')
}
# 저장된 파이프라인 불러오기
feature_pipelines = joblib.load(PIPELINE_PATH)


# ✅ JSON 직렬화 지원 함수
def dustPred(sensor_results):
    def convert(obj):
        if isinstance(obj, (datetime, timedelta)):
            return str(obj)
        if isinstance(obj, Decimal):
            return float(obj)
        return obj

    # ✅ 리스트 처리
    cleaned_results = []
    for row in sensor_results:
        cleaned_row = {k: convert(v) for k, v in row.items()}
        cleaned_results.append(cleaned_row)
    
    df_results = pd.DataFrame.from_dict(cleaned_results)
    df_results['dtime'] = pd.to_datetime(df_results['dtime'])
    df_results = df_results.set_index('dtime').sort_index()

    # — (B) 인덱스(Timestamp)로부터 시계열 특성 생성 ———
    doy = df_results.index.dayofyear  # 1~365 (윤년이면 366)

    #  365일 주기로 사인/코사인 계산
    df_results['doy_sin'] = np.sin(2 * np.pi * doy / 365)
    df_results['doy_cos'] = np.cos(2 * np.pi * doy / 365)

    #  하루 중 경과된 초(sec_of_day) 계산 → 사인/코사인
    sec_of_day = (
        df_results.index.hour * 3600
        + df_results.index.minute * 60
        + df_results.index.second
    )
    df_results['time_sin'] = np.sin(2 * np.pi * sec_of_day / 86400)
    df_results['time_cos'] = np.cos(2 * np.pi * sec_of_day / 86400)

    df = df_results[['pm10', 'pm25', 'pm1', 'temp', 'humidity', 'co2den', 'atmospheric_press', 'doy_sin','doy_cos','time_sin','time_cos']].copy()
    df.columns = ['PM10','PM2_5','PM1','Temp','Humidity','CO2Den', 'AtmosphericPress', 'doy_sin','doy_cos','time_sin','time_cos']

    # 미세먼지, 대기압 로그 변환
    col = ['PM10', 'PM2_5', 'PM1', 'CO2Den']
    for j in range(len(col)):
        df[col[j]+'_log'] = np.log1p(df[col[j]])

    # 사용할 월(month) 지정
    month = 12
    pipeline = feature_pipelines[month]

    thresholds = pipeline['thresholds']
    input_scaler = pipeline['scaler']
    y_scaler = pipeline['y_scaler']

    # 이상치 처리
    for feat, (low, high) in thresholds.items():
        df[feat] = df[feat].clip(lower=low, upper=high)
    features = ['PM10_log', 'PM2_5_log', 'PM1_log', 'Temp', 'Humidity', 'AtmosphericPress', 'CO2Den_log']
    # 입력 스케일링
    df[features] = input_scaler.transform(df[features])
    
    X = df[['PM10_log','PM2_5_log','PM1_log','Temp','Humidity','CO2Den_log', 'AtmosphericPress', 'doy_sin','doy_cos','time_sin','time_cos']].to_numpy()


    # 예측 (스케일된 y)
    y_pred_scaled = model.predict(X.reshape(1, *X.shape))

    # 예측 결과 원본 단위로 복원
    y_pred = y_scaler.inverse_transform(y_pred_scaled).tolist()

    return Response(
        json.dumps(y_pred, ensure_ascii=False),
        status=200,
        mimetype='application/json'
    )

# ✅ 센서 데이터 API
@app.route('/flask-station-db-test', methods=['GET'])
def db_test():
    st_id = request.args.get('st_id')
    # http://127.0.0.1:5000/flask-station-db-test?st_id=1
    try:
        st_id = int(st_id)      #st_id = 1 로 고정정
    except Exception as e:
        return Response(
            json.dumps({'error': 'Invalid st_id'}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    try:
    # ✅ 요일 확인
        weekday_eng = datetime.today().strftime('%A').lower()
        print("[요일 확인]:", weekday_eng)

        # ✅ 현재 시각 구하기 (hh:mm:ss 형식)
        current_time_str = datetime.now().strftime('%H:%M:%S')
        print("[현재 시각 기준]:", current_time_str)

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True, buffered=True)

        # ✅ 현재 시간보다 이전의 600개 데이터 조회
        cursor.execute("""
            SELECT * FROM sensor
            WHERE st_id = %s AND weekday = %s AND time_hms <= %s
            ORDER BY time_hms DESC
            LIMIT 60
        """, (st_id, weekday_eng, current_time_str))

        results = cursor.fetchall()
        print("[쿼리 결과 개수]:", len(results))

        cursor.close()
        conn.close()

        if results:
            return dustPred(results)
        else:
            return Response(
                json.dumps({'error': '해당 조건의 sensor 데이터 없음'}, ensure_ascii=False),
                status=404,
                mimetype='application/json'
            )

    except Exception as e:
        print("[DB 또는 쿼리 오류 발생]:", str(e))
        return Response(
            json.dumps({'error': str(e)}, ensure_ascii=False),
            status=500,
            mimetype='application/json'
        )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)