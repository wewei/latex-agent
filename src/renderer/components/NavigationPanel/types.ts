export interface Workspace {
  id: string;
  name: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'document';
  path?: string;
}

export interface Folder {
  id: string;
  name: string;
  type: 'folder';
  children: Folder[];
}

export interface NavigationState {
  currentWorkspace: string;
  workspaces: Workspace[];
  searchQuery: string;
  recentItems: Document[];
  sharedItems: Document[];
  folderTree: Folder[];
}

export type NavigationAction =
  | { type: 'SET_WORKSPACE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'CREATE_FOLDER'; payload: { name: string; parentId?: string } }
  | { type: 'RENAME_FOLDER'; payload: { id: string; name: string } }
  | { type: 'DELETE_FOLDER'; payload: string }; 