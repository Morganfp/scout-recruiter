// Workspace.tsx
// Displays the workspace
// Allows the user to manually edit the workspace, and then calls the ai assistant via a socket function call

// Hooks
import { useContext, useState, useEffect } from 'react';
// Contexts
import { ChatContext } from '../contexts/ChatContext';
import { WorkspaceContext } from '../contexts/WorkspaceContext';
// Styles
import '../styles/global.css';
import { MdEdit } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
// Sockets
import { fetchAssistantSocket } from '../sockets/fetchAssistantSocket';

function Workspace() {
  // Context for chat state and updater
  const { setChatState } = useContext(ChatContext) || {
    chatState: undefined,
    setChatState: () => {},
  };

  // Context for current sequence and updater
  const { workspaceState, setWorkspaceState } = useContext(
    WorkspaceContext
  ) || {
    workspaceState: undefined,
    setWorkspaceState: () => {},
  };
  // State to hold user input
  const [input, setInput] = useState<string>(workspaceState?.sequence || '');

  // State to hold wether the user is editing the sequence or not
  const [isEditing, setIsEditing] = useState(false);

  // Handles user input change
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  // Handles edit confirmation
  const confirmEdit = () => {
    if (!input) {
      alert('Please enter a sequence.');
      return;
    }
    setIsEditing(false);
    // Make a call to fetchAssistantSocket to send a message to the assitant
    fetchAssistantSocket(input, 'sequence', setChatState, setWorkspaceState);
  };

  // Handles edit cancellation
  const cancelEdit = () => {
    setIsEditing(false);
    setInput(workspaceState?.sequence || '');
  };

  // Updates the input (edit area) when there is a new sequence
  useEffect(() => {
    setInput(workspaceState?.sequence || '');
  }, [workspaceState]);

  // Transform the sequence (by numbered bullet points)
  const transformText = (str: string) => {
    // Split the string by the numbered bullet points
    const paragraphs = str.split(/(?=\d+\.)/);
    // Return each paragraph with the number and period bold
    return paragraphs.map((paragraph, index) => (
      <div key={index} className="mb-3">
        <div className="flex gap-2 ml-1">
          <div className="font-bold">{`${paragraph.slice(
            0,
            paragraph.indexOf('.') + 1
          )}`}</div>
          <div>{`${paragraph.slice(paragraph.indexOf('.') + 1)}`}</div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="container">
        {/* Tab */}
        <div className="tab">
          {isEditing ? (
            <div className="flex gap-3 ml-auto mr-5">
              <button className="cursor-pointer">
                <FaTimes onClick={cancelEdit} size={18} color="gray" />
              </button>
              <button onClick={confirmEdit} className="cursor-pointer">
                <FaCheck size={18} color="gray" />
              </button>
            </div>
          ) : (
            <button className="ml-auto mr-5 cursor-pointer">
              <MdEdit
                onClick={() => setIsEditing(true)}
                size={20}
                color="gray"
              />
            </button>
          )}
        </div>
        {/* Conversation */}
        <div className="flex flex-col gap-5 overflow-auto px-15 py-8">
          <div className="flex flex-col gap-3">
            {workspaceState?.sequence && (
              <h1 className="font-bold text-lg text-[#333]">Sequence</h1>
            )}
            {workspaceState ? (
              <div>
                {isEditing ? (
                  <textarea
                    value={input}
                    className="border border-gray-400 w-full rounded px-3 py-2 resize-none"
                    onChange={handleChange}
                    rows={14}
                  ></textarea>
                ) : (
                  <div>{transformText(workspaceState.sequence || '')}</div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Workspace;
