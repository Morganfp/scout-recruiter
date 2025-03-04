// WorkspaceContext.ts

import WorkspaceContextType from '../types/WorkspaceContextType';
import { createContext } from 'react';

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);
