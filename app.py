from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route("/")
def login():
    return render_template("index.html")

@app.route("/SIMULIATOR")
def simulator():
    return render_template("SIMULIATOR.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
