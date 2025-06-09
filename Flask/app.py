from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
import mysql.connector

load_dotenv()  # .env 파일 로드

app = Flask(__name__)

# 환경변수에서 DB 설정 불러오기
db_config = {
    'host': os.getenv('MYSQL_HOST'),
    'port': int(os.getenv('MYSQL_PORT')),
    'user': os.getenv('MYSQL_USER'),
    'password': os.getenv('MYSQL_PASSWORD'),
    'database': os.getenv('MYSQL_DATABASE')
}

# http://172.30.1.57:5000/flask-db-test?usr_email=jeongjin9427@gmail.com
@app.route('/flask-db-test', methods=['GET'])
def db_test():
    usr_email = request.args.get('usr_email')  # 쿼리 파라미터에서 usr_name 추출
    if not usr_email:
        return jsonify({'error': 'usr_email 파라미터가 필요합니다'}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT usr_nick FROM user WHERE usr_email = %s"
        cursor.execute(query, (usr_email,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if result:
            return jsonify(result)
        else:
            return jsonify({'error': '해당 usr_name의 사용자를 찾을 수 없습니다'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
