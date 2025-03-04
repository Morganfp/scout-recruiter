// ChatContextType.ts

import ChatType from './ChatType';

export default interface ChatContextType {
  chatState: ChatType | undefined;
  setChatState: React.Dispatch<React.SetStateAction<ChatType>>;
}
