from flask import Flask, request, Response
from dotenv import load_dotenv
import os
import mysql.connector
import json
from datetime import datetime, timedelta
from decimal import Decimal

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
        cleaned_row['예측'] = '미세먼지 예측값 예시입니다'
        cleaned_results.append(cleaned_row)

    return Response(
        json.dumps(cleaned_results, ensure_ascii=False),
        status=200,
        mimetype='application/json'
    )

# ✅ 센서 데이터 API
@app.route('/flask-station-db-test', methods=['GET'])
def db_test():
    st_id = request.args.get('st_id')

    try:
        st_id = int(st_id)
    except Exception as e:
        return Response(
            json.dumps({'error': 'Invalid st_id'}, ensure_ascii=False),
            status=400,
            mimetype='application/json'
        )

    try:
        # ✅ 요일 확인 (예: 'wednesday')
        weekday_eng = datetime.today().strftime('%A').lower()
        print("[요일 확인]:", weekday_eng)

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True, buffered=True)

        # ✅ 30개 데이터 조회
        cursor.execute("""
            SELECT * FROM sensor
            WHERE st_id = %s AND weekday = %s
            ORDER BY time_hms DESC
            LIMIT 30
        """, (st_id, weekday_eng))

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

# ✅ 서버 실행
if __name__ == '__main__':
    app.run(debug=True)
