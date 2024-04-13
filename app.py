import os
import requests
import datetime
from flask import Flask, session, render_template, request, redirect, jsonify
from flask_session import Session
from sqlalchemy import create_engine,text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import scoped_session, sessionmaker
from datetime import datetime
import uuid


app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False


# Check for environment variable 
#set os environment variable
os.environ["DATABASE_URL"] = "postgresql://postgres:postgres@localhost:5432/test"

if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))

db = scoped_session(sessionmaker(bind=engine))

@app.route("/")
def index():
    return redirect("/login")

# Login Page
@app.route("/login", methods=["GET", "POST"])
def login():
    try:
                
        if session.get("user_id"):
            return redirect("/home")
        
        if request.method == "POST":
            loginUsername = request.form.get("username")
            loginPassword = request.form.get("password")
        
            result = db.execute(text("SELECT * FROM users WHERE username = :username AND password=:password"), {"username":loginUsername, "password":loginPassword}).fetchone()
            
            if result is None:
                return render_template("login.html", message="Invalid username or password.")
            
            session["user_id"] = result[0]
            session["user_name"] = result[1]

            return redirect("/")
    
        if request.method == "GET":
            return render_template("login.html")
    except SQLAlchemyError as e:
        print(str(e))
  


# Register Page
@app.route("/register", methods=["GET", "POST"])
def register():
    session.clear()
    if request.method == "POST":
        
        registerUsername = request.form.get("username")
        registerPassword = request.form.get("password")
        userid = str(uuid.uuid4())

        
        query = text("SELECT * FROM users WHERE username = :username")
        userExists = db.execute(query, {"username": registerUsername}).fetchone()
        
        if not userExists:
            db.execute(text("INSERT INTO users (id,username, password) VALUES (:id,:username, :password)"), {"id":userid,"username":registerUsername, "password":registerPassword})
            db.commit()
            
            session["user_id"] = userid
            session["user_name"] = registerUsername
            
            return redirect("index.html", message="Account created successfully.")
        
        return render_template("login.html", message="User already exists.")
        
    if request.method == "GET":
        return render_template("signup.html")


#Home Page
@app.route("/home", methods=["GET", "POST"])
def home():
    if session.get("user_id") is None:
        return redirect("/login")
    
    if request.method == "GET":
        return render_template("index.html", user_name=session.get("user_name"))

# Logout Page
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")



if __name__ == '__main__':
    app.run(debug=True)