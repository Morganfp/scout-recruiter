// ChatContext.ts

import ChatContextType from '../types/ChatContextType';
import { createContext } from 'react';

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);
