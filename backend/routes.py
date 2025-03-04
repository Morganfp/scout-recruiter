# routes.py
# Handles the SocketIO events for communication between the frontend and backend

from flask_socketio import emit
from assistant import use_assistant

def socketio_events(socketio):
    # event triggered when the client connects
    @socketio.on('connect')
    def handle_connect():
        print('Client connected')

    # Event triggered when a message is received from the client
    @socketio.on('message')
    def handle_message(data):
        # Extract the incoming data (from frontend)
        message = data.get('message')
        type = data.get('type')
        sessionID = data.get('sessionID')                

        # Call the assistant logic to generate a response based on the message and session ID
        # This function should return a python dict containing 'type' and 'message'
        response = use_assistant(sessionID, message, type)        

        # Update the context and sequence in the database

        # Send a response back to the client via SocketIO
        emit('message', {'type': response['type'], 'message': response['message']})


