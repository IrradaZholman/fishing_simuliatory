from flask import Flask, render_template, request, jsonify
import pymysql
from werkzeug.security import check_password_hash

app = Flask(__name__)

@app.route("/")
def login():
    return render_template("index.html")

@app.route("/SIMULIATOR")
def simulator():
    return render_template("SIMULIATOR.html")

@app.route("/api/login", methods=["POST"])
def api_login():
    username = request.form.get("username", "").strip()
    password = request.form.get("password", "").strip()

    if not username or not password:
        return jsonify({"success": False, "message": "Логин мен құпия сөзді енгізіңіз"})

    try:
        conn = pymysql.connect(
            host="sql309.infinityfree.com",
            user="if0_41482304",
            password="B5SnfeLTaBWnaC",
            database="if0_41482304_cybersaqshy",
            charset="utf8mb4",
            cursorclass=pymysql.cursors.DictCursor
        )

        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, fio, aty_zhoni, email, Qupiasoz FROM users WHERE aty_zhoni=%s OR email=%s",
                (username, username)
            )
            user = cursor.fetchone()

        conn.close()

        if not user:
            return jsonify({"success": False, "message": "Логин немесе email табылмады"})

        if check_password_hash(user["Qupiasoz"], password):
            return jsonify({
                "success": True,
                "user": {
                    "id": user["id"],
                    "name": user["fio"],
                    "username": user["aty_zhoni"],
                    "email": user["email"]
                }
            })

        return jsonify({"success": False, "message": "Құпия сөз қате"})

    except Exception as e:
        return jsonify({"success": False, "message": "DB қатесі: " + str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
