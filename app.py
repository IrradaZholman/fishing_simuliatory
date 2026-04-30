from flask import Flask, render_template, request, jsonify
import os
import psycopg2
import psycopg2.extras
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

DATABASE_URL = os.environ.get("DATABASE_URL")


def get_db():
    return psycopg2.connect(DATABASE_URL, cursor_factory=psycopg2.extras.RealDictCursor)


def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            fullname VARCHAR(100) NOT NULL,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    conn.commit()
    cur.close()
    conn.close()


init_db()


@app.route("/")
def login():
    return render_template("index.html")


@app.route("/SIMULIATOR")
def simulator():
    return render_template("SIMULIATOR.html")


@app.route("/api/register", methods=["POST"])
def api_register():
    data = request.get_json()

    fullname = data.get("fullname", "").strip()
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not fullname or not username or not email or not password:
        return jsonify({"success": False, "message": "Барлық жолдарды толтырыңыз"})

    password_hash = generate_password_hash(password)

    try:
        conn = get_db()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO users (fullname, username, email, password_hash)
            VALUES (%s, %s, %s, %s)
        """, (fullname, username, email, password_hash))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"success": True, "message": "Тіркелу сәтті өтті!"})

    except psycopg2.errors.UniqueViolation:
        return jsonify({"success": False, "message": "Бұл логин немесе email бұрын тіркелген"})

    except Exception as e:
        return jsonify({"success": False, "message": "Сервер қатесі: " + str(e)})


@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"success": False, "message": "Логин мен құпия сөзді енгізіңіз"})

    try:
        conn = get_db()
        cur = conn.cursor()

        cur.execute("""
            SELECT * FROM users
            WHERE username = %s OR email = %s
        """, (username, username))

        user = cur.fetchone()

        cur.close()
        conn.close()

        if not user:
            return jsonify({"success": False, "message": "Қолданушы табылмады"})

        if not check_password_hash(user["password_hash"], password):
            return jsonify({"success": False, "message": "Құпия сөз қате"})

        return jsonify({
            "success": True,
            "message": "Кіру сәтті өтті!",
            "user": {
                "id": user["id"],
                "fullname": user["fullname"],
                "username": user["username"],
                "email": user["email"]
            }
        })

    except Exception as e:
        return jsonify({"success": False, "message": "Сервер қатесі: " + str(e)})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
