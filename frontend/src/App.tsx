// App.tsx
// The main entry point of the app

// Contexts
import { ChatContext } from './contexts/ChatContext';
import { WorkspaceContext } from './contexts/WorkspaceContext';
// Hooks
import { useState } from 'react';
// Components
import Header from './components/Header';
import ChatBar from './components/ChatBar';
import Workspace from './components/Workspace';
// Types
import ChatType from './types/ChatType';
import WorkspaceType from './types/WorkspaceType';
// UUID
import { v4 as uuid } from 'uuid';

function App() {
  // State holding chat messages (initialized with a greeting)
  const [chatState, setChatState] = useState<ChatType>({
    messages: [
      {
        id: uuid(),
        message:
          'Hello, how can I assist you on your recruiting outreach today?',
        sender: 'ai',
      },
    ],
  });
  // State to hold the current workspace sequence
  const [workspaceState, setWorkspaceState] = useState<WorkspaceType>({
    sequence: '',
  });

  return (
    <>
      {/* Provide chatState and setChatState inside the ChatContext context */}
      <ChatContext.Provider value={{ chatState, setChatState }}>
        {/* Provide sequenceState and setSequenceState inside the WorkspaceContext context */}
        <WorkspaceContext.Provider
          value={{ workspaceState, setWorkspaceState }}
        >
          <Header />
          <main>
            <div className="flex justify-evenly gap-15 w-full h-130 px-30">
              <div className="w-[40%]">
                <ChatBar />
              </div>
              <div className="w-[60%]">
                <Workspace />
              </div>
            </div>
          </main>
        </WorkspaceContext.Provider>
      </ChatContext.Provider>
    </>
  );
}

export default App;
