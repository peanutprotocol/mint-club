from flask import (
    Flask,
    jsonify,
    render_template,
    request,
    redirect,
    Response,
    make_response,
    send_file,
)
import os
import random
import uuid
import dotenv
dotenv.load_dotenv("../.env")


################################################################################
CONTRACT = os.getenv("CONTRACT_ADDRESS")
################################################################################


# Setting up flask app
app = Flask(__name__, static_folder="src/", template_folder="src/html/")
app.config.update(
    TEMPLATES_AUTO_RELOAD=True,
)


# before request redirect to https
@app.before_request
def before_request():
    if request.url.startswith("http://") and not "127.0." in request.url:
        return redirect(request.url.replace("http://", "https://", 301))


# sanity check route
@app.route("/ping", methods=["GET"])
def ping_pong():
    return render_template("pong.html")


# home
@app.route("/", methods=["GET"])
def home():
    return render_template("home.html")


# home
@app.route("/example", methods=["GET"])
def example():
    return render_template("tailwind_example.html")


# RUN SERVER
if __name__ == "__main__":    
    # differentiate between local and production
    if "ENV" in os.environ:
        if os.environ["ENV"] == "PROD":
            app.run(debug=False)
        elif os.environ["ENV"] == "DEV":
            app.run(debug=True)
    else:
        app.run(debug=True)
