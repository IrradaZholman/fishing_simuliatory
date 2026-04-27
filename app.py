from flask import Flask, render_template, jsonify
from train import generate_message

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get-message")
def get_message():
    message = generate_message()
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True)
