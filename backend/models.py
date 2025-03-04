# models.py
# Define database models for the User, Assistants, and Session tables

from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    context = db.Column(db.Text, nullable=True)
    sequence = db.Column(db.Text, nullable=True)

class Assistant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    assistant_id = db.Column(db.String, unique=True, nullable=False)
    name = db.Column(db.String, nullable=False)

class Session(db.Model):
    session_id = db.Column(db.String(50), primary_key=True)
    thread_id = db.Column(db.String(50), nullable=False)
