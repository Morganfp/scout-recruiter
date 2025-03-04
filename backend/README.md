# Scout Recruiter Backend

This is the backend for Scout Recruiter. It provides a Flask-based API that communicates with the frontend via SocketIO for real-time interaction. The backend also integrates with the OpenAI Assistants API to power the AI-driven chat interface and generate personalized recruiting outreach sequences. SQLite is used for database management.

## Setup Instructions

1. Navigate to the backend directory:

- cd backend

2. Create and activate a virtual environment:

- python3 -m venv venv

# Activate on Windows:

venv\Scripts\activate

# Or on macOS/Linux:

source venv/bin/activate

3. Install the dependencies:

- pip install -r requirements.txt

4. Configure Environment Variables:

- Create a .env file in the backend folder.
- Add your OpenAI API key:
- OPEN_AI_API_KEY=your_openai_api_key_here

5. Start the Backend Server:

- python3 app.py
- The Flask app will start with SocketIO handling WebSocket events. Debug mode is enabled for development.
