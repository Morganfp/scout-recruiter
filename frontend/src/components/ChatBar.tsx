// ChatBar.tsx
// Displays the chat bar
// Takes user input via a form and submits it to the ai assistant via a socket function call

// Hooks
import { useContext, useState, useEffect, useRef } from 'react';
// Contexts
import { ChatContext } from '../contexts/ChatContext';
import { WorkspaceContext } from '../contexts/WorkspaceContext';
// Styles
import '../styles/global.css';
import '../styles/ChatBar.css';
import { TbRefresh } from 'react-icons/tb';
import { IoSend } from 'react-icons/io5';
// Types
import MessageType from '../types/MessageType';
// UUID
import { v4 as uuid } from 'uuid';
// Sockets
import { fetchAssistantSocket } from '../sockets/fetchAssistantSocket';

function ChatBar() {
  // Context for chat state and updater
  const { chatState, setChatState } = useContext(ChatContext) || {
    // Fallback if ChatContext is undefined
    chatState: undefined,
    setChatState: () => {},
  };

  // Context for current sequence and updater
  const { setWorkspaceState } = useContext(WorkspaceContext) || {
    // Fallback if WorkspaceContext is undefined
    workspaceState: undefined,
    setWorkspaceState: () => {},
  };

  // Handles user input change
  const [input, setInput] = useState<string>('');

  // Ref to auto scroll on chat
  const conversationEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Scroll to the bottom of the conversation container
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatState]);

  // Handles for user input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  // Handles form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input) {
      alert('Please enter a prompt.');
      return;
    }
    // Update the chat with the user input
    setChatState((prev) => ({
      ...prev,
      messages: [
        ...(prev?.messages ?? []),
        { id: uuid(), message: input, sender: 'user' },
      ],
    }));
    // Clear the input
    setInput('');
    // Make a call to fetchAssistantSocket to send a message to the assitant
    fetchAssistantSocket(input, 'chat', setChatState, setWorkspaceState);
  };

  // Reset the chat and sequence
  const resetAll = () => {
    // Reset the chat
    setChatState({
      messages: [
        {
          id: uuid(),
          message:
            'Hello, how can I assist you on your recruiting outreach today?',
          sender: 'ai',
        },
      ],
    });
    // Clear the workspace sequence
    setWorkspaceState?.({ sequence: undefined });
    // Remove the current sessionID to start a new chat with the assistant next time the user sends a message
    sessionStorage.removeItem('sessionID');
  };

  return (
    <>
      <div className="container items-center">
        {/* Tab */}
        <div className="tab">
          <button onClick={resetAll} className="ml-auto mr-5 cursor-pointer">
            <TbRefresh size={20} color="gray" />
          </button>
        </div>
        {/* Conversation */}
        <div className="flex flex-col gap-5 overflow-auto px-15 py-7">
          {chatState
            ? chatState.messages.map((message: MessageType) => (
                <div key={message.id} className={message.sender}>
                  <p>{message.message}</p>
                </div>
              ))
            : null}
          {/* Auto scroll here when chatState is updated */}
          <div ref={conversationEndRef} />
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="relative mb-8 mt-auto">
          <input
            value={input}
            id="userInp"
            onChange={handleChange}
            className="border border-gray-400 rounded w-90 p-2 pr-10"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <IoSend color="gray" size={20} />
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatBar;
