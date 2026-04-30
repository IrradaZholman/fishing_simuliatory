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
    username = request.form.get("username", "")
    password = request.form.get("password", "")

    r = requests.post(
        "https://cybersaqshy.42web.io/simulator_login.php",
        data={
            "username": username,
            "password": password
        },
        timeout=15
    )

    return jsonify(r.json())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
