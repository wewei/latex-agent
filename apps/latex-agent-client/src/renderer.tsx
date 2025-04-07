/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Box,
  Paper,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

declare global {
  interface Window {
    electron: {
      endpoints: {
        add: (endpoint: string) => Promise<void>;
        del: (endpoint: string) => Promise<void>;
        move: (endpoint: string, index: number) => Promise<void>;
        get: () => Promise<string[]>;
      };
    };
  }
}

const EndpointsList: React.FC = () => {
  const [endpointsList, setEndpointsList] = useState<string[]>([]);
  const [newEndpoint, setNewEndpoint] = useState('');

  const loadEndpoints = async () => {
    const list = await window.electron.endpoints.get();
    setEndpointsList(list);
  };

  useEffect(() => {
    loadEndpoints();
  }, []);

  const handleAdd = async () => {
    if (newEndpoint.trim()) {
      await window.electron.endpoints.add(newEndpoint.trim());
      setNewEndpoint('');
      loadEndpoints();
    }
  };

  const handleDelete = async (endpoint: string) => {
    await window.electron.endpoints.del(endpoint);
    loadEndpoints();
  };

  const handleMove = async (endpoint: string, newIndex: number) => {
    await window.electron.endpoints.move(endpoint, newIndex);
    loadEndpoints();
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '20px auto', padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Endpoints 管理
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={newEndpoint}
            onChange={(e) => setNewEndpoint(e.target.value)}
            placeholder="输入新的 endpoint URL"
            onKeyUp={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button variant="contained" onClick={handleAdd}>
            添加
          </Button>
        </Box>

        <List>
          {endpointsList.map((endpoint: string, index: number) => (
            <ListItem
              key={endpoint}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                }
              }}
            >
              <DragIndicatorIcon sx={{ mr: 1, cursor: 'move' }} />
              <ListItemText primary={endpoint} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(endpoint)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

// 创建根元素并渲染应用
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<EndpointsList />);
}
