from flask import Flask, render_template, request, jsonify
import os
import psycopg2
import psycopg2.extras
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

DATABASE_URL = os.environ.get("DATABASE_URL")


def get_db():
    if not DATABASE_URL:
        raise Exception("DATABASE_URL табылмады")
    return psycopg2.connect(
        DATABASE_URL,
        cursor_factory=psycopg2.extras.RealDictCursor
    )


def init_db():
    try:
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
        print("Database дайын!")

    except Exception as e:
        print("Database қатесі:", e)


init_db()


@app.route("/")
def login():
    return render_template("index.html")


@app.route("/SIMULIATOR")
def simulator():
    return render_template("SIMULIATOR.html")


@app.route("/terms")
def terms():
    return render_template("terms.html")


@app.route("/api/register", methods=["POST"])
def api_register():
    conn = None
    cur = None

    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "Деректер келмеді"})

        fullname = data.get("fullname", "").strip()
        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()

        if not fullname or not username or not email or not password:
            return jsonify({"success": False, "message": "Барлық жолдарды толтырыңыз"})

        password_hash = generate_password_hash(password)

        conn = get_db()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO users (fullname, username, email, password_hash)
            VALUES (%s, %s, %s, %s)
        """, (fullname, username, email, password_hash))

        conn.commit()

        return jsonify({"success": True, "message": "Тіркелу сәтті өтті!"})

    except psycopg2.errors.UniqueViolation:
        if conn:
            conn.rollback()
        return jsonify({"success": False, "message": "Бұл никнейм немесе email бұрын тіркелген"})

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"success": False, "message": "Сервер қатесі: " + str(e)})

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


@app.route("/api/login", methods=["POST"])
def api_login():
    conn = None
    cur = None

    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "Деректер келмеді"})

        login_value = data.get("username", "").strip()
        password = data.get("password", "").strip()

        if not login_value or not password:
            return jsonify({"success": False, "message": "Логин немесе құпия сөзді енгізіңіз"})

        conn = get_db()
        cur = conn.cursor()

        cur.execute("""
            SELECT id, fullname, username, email, password_hash
            FROM users
            WHERE username = %s OR email = %s
            LIMIT 1
        """, (login_value, login_value))

        user = cur.fetchone()

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

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


@app.route("/api/forgot/check", methods=["POST"])
def forgot_check():
    conn = None
    cur = None

    try:
        data = request.get_json()

        email = data.get("email", "").strip()
        username = data.get("username", "").strip()

        if not email or not username:
            return jsonify({"success": False, "message": "Email және никнеймді енгізіңіз"})

        conn = get_db()
        cur = conn.cursor()

        cur.execute("""
            SELECT id FROM users
            WHERE email = %s AND username = %s
            LIMIT 1
        """, (email, username))

        user = cur.fetchone()

        if not user:
            return jsonify({"success": False, "message": "Email немесе никнейм қате"})

        return jsonify({"success": True, "message": "Аккаунт табылды"})

    except Exception as e:
        return jsonify({"success": False, "message": "Сервер қатесі: " + str(e)})

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


@app.route("/api/forgot/reset", methods=["POST"])
def forgot_reset():
    conn = None
    cur = None

    try:
        data = request.get_json()

        email = data.get("email", "").strip()
        username = data.get("username", "").strip()
        new_password = data.get("newPassword", "").strip()

        if not email or not username or not new_password:
            return jsonify({"success": False, "message": "Барлық жолдарды толтырыңыз"})

        if len(new_password) < 6:
            return jsonify({"success": False, "message": "Құпия сөз кемінде 6 таңба болсын"})

        new_hash = generate_password_hash(new_password)

        conn = get_db()
        cur = conn.cursor()

        cur.execute("""
            UPDATE users
            SET password_hash = %s
            WHERE email = %s AND username = %s
            RETURNING id
        """, (new_hash, email, username))

        updated_user = cur.fetchone()
        conn.commit()

        if not updated_user:
            return jsonify({"success": False, "message": "Аккаунт табылмады"})

        return jsonify({"success": True, "message": "Құпия сөз сәтті жаңартылды!"})

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"success": False, "message": "Сервер қатесі: " + str(e)})

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
