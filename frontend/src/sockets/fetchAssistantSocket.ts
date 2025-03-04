// fetchAssistantSocket.ts
// Handles sending requests to the server via SocketIO and processing the response

// Import the socket instance (this will start the connection)
import socket from './socket';
// UUID
import { v4 as uuid } from 'uuid';

export const fetchAssistantSocket = (
  message: string,
  type: 'chat' | 'sequence',
  setChatState?: (callback: (prev: any) => any) => void,
  setWorkspaceState?: (state: { sequence: string }) => void
) => {
  // Get or create the session ID
  const sessionID =
    sessionStorage.getItem('sessionID') ||
    (() => {
      const newSessionID = uuid();
      sessionStorage.setItem('sessionID', newSessionID);
      return newSessionID;
    })();

  // Emit the message to the backend via socket
  socket.emit('message', { message, type, sessionID });

  // Listen for the server's response
  socket.on('message', (data: { type: string; message: string }) => {
    // If response is related to sequence, update the workspace state
    if (data.type === 'sequence') {
      setWorkspaceState?.({ sequence: data.message });
      setChatState?.((prev) => ({
        ...prev,
        messages: [
          ...(prev?.messages ?? []),
          { id: uuid(), message: 'I have updated the sequence.', sender: 'ai' },
        ],
      }));
    }
    // Otherwise update the chat with the response message
    else {
      setChatState?.((prev) => ({
        ...prev,
        messages: [
          ...(prev?.messages ?? []),
          { id: uuid(), message: data.message, sender: 'ai' },
        ],
      }));
    }
  });
};
