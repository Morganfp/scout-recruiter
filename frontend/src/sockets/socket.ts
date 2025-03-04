// socket.ts
// Establish a connection between React and Flask

import { io } from 'socket.io-client';

// Flask backend URL
const socket = io('http://127.0.0.1:5000');

export default socket;
