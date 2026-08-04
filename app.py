import os

from flask import Flask, render_template, request, redirect, url_for, session

try:
    from config import CONFIG
except ImportError as exc:
    raise SystemExit(
        "Không tìm thấy config.py. Hãy sao chép config.example.py thành config.py "
        "rồi điền nội dung riêng của bạn."
    ) from exc

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", os.urandom(24).hex())

@app.route("/")
def index():
    return render_template("index.html", config=CONFIG)


@app.route("/no-thanks")
def no_thanks():
    # Trang chủ đã xử lý việc né chuột bằng JS, route này gần như không bao giờ được gọi.
    return redirect(url_for("index"))


@app.route("/step2", methods=["GET", "POST"])
def step2():
    if request.method == "POST":
        session["datetime"] = request.form.get("datetime")
        return redirect(url_for("step3"))
    return render_template("step2.html", config=CONFIG)


@app.route("/step3", methods=["GET", "POST"])
def step3():
    if "datetime" not in session:
        return redirect(url_for("index"))
    if request.method == "POST":
        session["activity"] = request.form.get("activity")
        return redirect(url_for("result"))
    return render_template("step3.html", config=CONFIG)


@app.route("/result")
def result():
    if "datetime" not in session or "activity" not in session:
        return redirect(url_for("index"))

    activity_id = session["activity"]
    activity = next((a for a in CONFIG["activities"] if a["id"] == activity_id), None)

    return render_template(
        "result.html", config=CONFIG, formatted_datetime=session["datetime"], activity=activity
    )


if __name__ == "__main__":
    app.run(debug=True)
