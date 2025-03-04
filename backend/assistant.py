# assistant.py
# Manages requests and interactions with the AI assistant

from flask import jsonify
from models import User, Assistant, Session
from openai import OpenAI
from extensions import db
import json
import time
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Check if the OpenAI API key is available
api_key = os.getenv('OPEN_AI_API_KEY')
if not api_key:
    raise ValueError("OPEN_AI_API_KEY not found in environment variables")

# Initialize OpenAI client with API key
client = OpenAI(api_key=api_key) if api_key else None
if not client:
    raise ValueError("OpenAI API client could not be initialized")

# Function to read the instructions from the assistant_instructions file
def read_instructions(file_path):
    with open(file_path, 'r') as file:
        return file.read()

def use_assistant(session_id, message, type):
    try:
       # Get the user from the db or create one if they don't exist
        user = User.query.get(1)

        if not user:
            # If the user doesn't exist, create a new one
            user = User(id=1)
            db.session.add(user)
            db.session.commit()
        
        # Get the assistants instructions
        instructions = read_instructions('assistant_instructions.txt')

        # Check for an assitant id in the db (if an assistant was already created)
        # We check for the very first assistant in the table for now (later the user could specify the assistant on the front end)
        assistant = Assistant.query.get(1)
        if assistant:
            # Get the assitant id
            assistant_id = assistant.assistant_id
        else:
            # Create a new assistant in the user's OpenAI account
            # Define the assistant
            open_ai_assistant = client.beta.assistants.create(
                name="Scout",
                instructions=instructions,
                tools=[],                
                model="gpt-4"
            )

            # Create a new assistant in the database
            assistant = Assistant(
                assistant_id=open_ai_assistant.id,
                name="Scout"
            )

            db.session.add(assistant)
            db.session.commit()

            # Set the assistant_id variable
            assistant_id = assistant.assistant_id

        # Query the Session table to check if the session id exists
        session = Session.query.filter_by(session_id=session_id).first()        
        if session:
            # Use the thread id that matches the sesson id
            thread_id = session.thread_id            
        else:
            # Create a new thread
            thread = client.beta.threads.create()
            thread_id = thread.id
            # Create a new session for the db
            new_session = Session(session_id=session_id, thread_id=thread_id)
            # Add the new session to the db
            db.session.add(new_session)
            # Commit the session to the database (saves the new row)
            db.session.commit()        
        
        # Construct the prompt to send to the assistant
        prompt = f'{{"type": "{type}", "message": "{message}", "request_format": "json_object"}}'
        
        # Add message to thread
        client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=prompt
        )
        
        # Create a run to process the thread and generate a response
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=assistant_id
        )
        
        # Wait for the response
        while run.status in ['queued', 'in_progress']:
            time.sleep(1)
            run = client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run.id
            )
            if run.status == 'failed':
                return jsonify({"error": "Run failed"}), 500
        
        # Get the latest message in the thread
        messages = client.beta.threads.messages.list(thread_id=thread_id)
        if not messages.data or not messages.data[0].content:
            return {"error": "No valid response from assistant"}
        response = messages.data[0].content[0].text.value        

        # Convert response to dictionary
        response_dict = json.loads(response)

        # Store assistant context and sequence in the database
        user.context = json.dumps(response_dict.get('context', {}))
        response_sequence = None if response_dict['type'] == 'chat' else response_dict['message']
        user.sequence = response_sequence
        db.session.commit()

        return response_dict

    except Exception as e:
        return { "error": str(e) }