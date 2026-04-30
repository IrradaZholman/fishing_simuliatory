from flask import Flask, render_template, request, jsonify
import requests

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

    try:
        r = requests.post(
            "https://cybersaqshy.42web.io/simulator_login.php",
            data={"username": username, "password": password},
            timeout=30,
            headers={"User-Agent": "Mozilla/5.0"}
        )

        print(r.status_code, r.text[:300])

        return jsonify(r.json())

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "PHP серверге қосылу қатесі: " + str(e)
        })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
