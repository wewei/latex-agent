import React, { useReducer } from 'react';
import { NavigationPanelRp } from './NavigationPanelRp';
import { NavigationState, NavigationAction, Folder } from './types';

const initialState: NavigationState = {
  recentItems: [],
  sharedItems: [],
  currentWorkspace: 'default',
  workspaces: [
    { id: 'default', name: '默认工作区' },
    { id: 'personal', name: '个人工作区' },
    { id: 'team', name: '团队工作区' },
  ],
  searchQuery: '',
  folderTree: [
    {
      id: 'folder1',
      name: '论文',
      type: 'folder',
      children: [],
    },
    {
      id: 'folder2',
      name: '共享',
      type: 'folder',
      children: [],
    },
  ],
};

const findFolder = (folders: Folder[], id: string): Folder | null => {
  for (const folder of folders) {
    if (folder.id === id) return folder;
    const found = findFolder(folder.children, id);
    if (found) return found;
  }
  return null;
};

const updateFolderInTree = (folders: Folder[], id: string, update: (folder: Folder) => Folder): Folder[] => {
  return folders.map(folder => {
    if (folder.id === id) {
      return update(folder);
    }
    return {
      ...folder,
      children: updateFolderInTree(folder.children, id, update),
    };
  });
};

const reducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  switch (action.type) {
    case 'SET_WORKSPACE':
      return {
        ...state,
        currentWorkspace: action.payload,
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'CREATE_FOLDER': {
      const newFolder: Folder = {
        id: `folder${Date.now()}`,
        name: action.payload.name,
        type: 'folder',
        children: [],
      };

      if (action.payload.parentId) {
        return {
          ...state,
          folderTree: updateFolderInTree(state.folderTree, action.payload.parentId, (folder) => ({
            ...folder,
            children: [...folder.children, newFolder],
          })),
        };
      }

      return {
        ...state,
        folderTree: [...state.folderTree, newFolder],
      };
    }
    case 'RENAME_FOLDER':
      return {
        ...state,
        folderTree: updateFolderInTree(state.folderTree, action.payload.id, (folder) => ({
          ...folder,
          name: action.payload.name,
        })),
      };
    case 'DELETE_FOLDER':
      return {
        ...state,
        folderTree: state.folderTree.filter(folder => folder.id !== action.payload),
      };
    default:
      return state;
  }
};

export const NavigationPanelCt: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleWorkspaceChange = (workspaceId: string) => {
    dispatch({ type: 'SET_WORKSPACE', payload: workspaceId });
  };

  const handleSearchChange = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const handleCreateFolder = (name: string, parentId?: string) => {
    dispatch({
      type: 'CREATE_FOLDER',
      payload: { name, parentId },
    });
  };

  const handleRenameFolder = (id: string, name: string) => {
    dispatch({
      type: 'RENAME_FOLDER',
      payload: { id, name },
    });
  };

  const handleDeleteFolder = (id: string) => {
    dispatch({
      type: 'DELETE_FOLDER',
      payload: id,
    });
  };

  return (
    <NavigationPanelRp
      state={state}
      onWorkspaceChange={handleWorkspaceChange}
      onSearchChange={handleSearchChange}
      onCreateFolder={handleCreateFolder}
      onRenameFolder={handleRenameFolder}
      onDeleteFolder={handleDeleteFolder}
    />
  );
}; 