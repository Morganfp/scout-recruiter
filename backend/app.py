# app.py
# Main entry point of the app
# Initializes the server, database, and SocketIO

from flask import Flask
from extensions import db
from flask_socketio import SocketIO

# Initialize Flask-SocketIO
# Allow all origins for SocketIO connections
socketio = SocketIO(cors_allowed_origins="*")

def create_app():
    # Initialize the flask app
    app = Flask(__name__)

    # Configure SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///user_sessions.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize SQLAlchemy with the app
    db.init_app(app)

    # Initialize SocketIO with app
    socketio.init_app(app)

    # Register socket events (pass socketio to routes)
    from routes import socketio_events
    socketio_events(socketio)

    # Create database tables (if they don't already exist)
    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    # Use socketio.run instead of app.run to handle WebSocket events
    socketio.run(app, debug=True)

