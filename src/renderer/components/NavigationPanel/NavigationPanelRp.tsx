import React, { useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Typography,
  Paper,
  Collapse,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { NavigationState, Folder } from './types';

interface NavigationPanelRpProps {
  state: NavigationState;
  onWorkspaceChange: (workspaceId: string) => void;
  onSearchChange: (query: string) => void;
  onCreateFolder: (name: string, parentId?: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
}

export const NavigationPanelRp: React.FC<NavigationPanelRpProps> = ({
  state,
  onWorkspaceChange,
  onSearchChange,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
}) => {
  const { t } = useTranslation();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderFolder = (folder: Folder, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = folder.children.length > 0;

    return (
      <Box key={folder.id}>
        <ListItem
          dense
          sx={{
            pl: level * 1,
            py: 0.5,
            '&:hover .folder-actions': {
              opacity: 1,
            },
          }}
          secondaryAction={
            <Box className="folder-actions" sx={{ opacity: 0, transition: 'opacity 0.2s', display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => onCreateFolder('新建文件夹', folder.id)} sx={{ p: 0.5 }}>
                <AddIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => onRenameFolder(folder.id, folder.name)} sx={{ p: 0.5 }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => onDeleteFolder(folder.id)} sx={{ p: 0.5 }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          }
        >
          <ListItemIcon sx={{ minWidth: 24 }}>
            {hasChildren && (
              <IconButton size="small" onClick={() => toggleFolder(folder.id)} sx={{ p: 0.5 }}>
                {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            )}
          </ListItemIcon>
          <ListItemIcon sx={{ minWidth: 24 }}>
            <FolderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary={folder.name} 
            slotProps={{ 
              primary: {
                variant: 'body2',
                sx: { fontSize: '0.875rem' }
              }
            }} 
          />
        </ListItem>
        <Collapse in={isExpanded}>
          {folder.children.map(child => renderFolder(child, level + 1))}
        </Collapse>
      </Box>
    );
  };

  return (
    <Paper sx={{ height: '100%', p: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Workspace Dropdown */}
        <Select
          value={state.currentWorkspace}
          onChange={(e) => onWorkspaceChange(e.target.value as string)}
          fullWidth
          size="small"
          sx={{ mb: 1, height: 32 }}
        >
          {state.workspaces.map((workspace) => (
            <MenuItem key={workspace.id} value={workspace.id}>
              {workspace.name}
            </MenuItem>
          ))}
        </Select>

        {/* Search Box */}
        <TextField
          placeholder={t('navigation.search')}
          value={state.searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
          slotProps={{
            input: {
              sx: { height: 32 }
            }
          }}
        />

        {/* Navigation Items */}
        <List dense sx={{ py: 0 }}>
          <ListItem dense sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              <HistoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary={t('navigation.recent')} 
              slotProps={{ 
                primary: {
                  variant: 'body2',
                  sx: { fontSize: '0.875rem' }
                }
              }} 
            />
          </ListItem>
          <ListItem dense sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary={t('navigation.shared')} 
              slotProps={{ 
                primary: {
                  variant: 'body2',
                  sx: { fontSize: '0.875rem' }
                }
              }} 
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 1 }} />

        {/* Folder Tree */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, pr: 1 }}>
            <Typography variant="subtitle2" sx={{ flex: 1, fontSize: '0.75rem' }}>
              {t('navigation.folders')}
            </Typography>
            <IconButton size="small" onClick={() => onCreateFolder('新建文件夹')} sx={{ p: 0.5 }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
          <List dense sx={{ py: 0 }}>
            {state.folderTree.map(folder => renderFolder(folder))}
          </List>
        </Box>

        {/* Bottom Navigation */}
        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Divider sx={{ mb: 1 }} />
          <List dense sx={{ py: 0 }}>
            <ListItem dense sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={t('navigation.trash')} 
                slotProps={{ 
                  primary: {
                    variant: 'body2',
                    sx: { fontSize: '0.875rem' }
                  }
                }} 
              />
            </ListItem>
            <ListItem dense sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={t('navigation.settings')} 
                slotProps={{ 
                  primary: {
                    variant: 'body2',
                    sx: { fontSize: '0.875rem' }
                  }
                }} 
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Paper>
  );
}; 