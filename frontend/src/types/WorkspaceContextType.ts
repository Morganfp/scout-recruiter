// WorkspaceContextType.ts

import WorkspaceType from './WorkspaceType';

export default interface WorkspaceContextType {
  workspaceState: WorkspaceType | undefined;
  setWorkspaceState: React.Dispatch<React.SetStateAction<WorkspaceType>>;
}
