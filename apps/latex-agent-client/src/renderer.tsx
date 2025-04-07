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

import "./index.css";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
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
  Typography,
  Icon,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Endpoint } from "./endpoints/shared";
import {
  DndProvider,
  useDrag,
  useDrop,
  DragSourceMonitor,
  DropTargetMonitor,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Draggable list item component
const DraggableListItem = ({
  endpoint,
  index,
  moveItem,
  handleDelete,
}: {
  endpoint: Endpoint;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  handleDelete: (key: string) => void;
}) => {
  const ref = React.useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "ITEM",
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "ITEM",
    hover: (item: { index: number }, monitor: DropTargetMonitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <ListItem
      ref={ref}
      key={endpoint.key}
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        mb: 1,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? "#f0f0f0" : "transparent",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => handleDelete(endpoint.key)}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <DragIndicatorIcon sx={{ mr: 1, cursor: "move" }} />
      <ListItemText primary={endpoint.name} />
      <ListItemText
        secondary={endpoint.url}
        sx={{
          textAlign: "right",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
        }}
        onClick={() => window.electron.endpoints.load(endpoint.key)}
      />
    </ListItem>
  );
};

const EndpointsList: React.FC = () => {
  const [endpointsList, setEndpointsList] = useState<Endpoint[]>([]);
  const [fallbackEndpoint, setFallbackEndpoint] = useState<Endpoint | null>(
    null
  );
  const [newEndpointName, setNewEndpointName] = useState("");
  const [newEndpointUrl, setNewEndpointUrl] = useState("");

  const loadEndpoints = async () => {
    const list = await window.electron.endpoints.get();
    setEndpointsList(list);
  };

  const loadFallbackEndpoint = async () => {
    const endpoint = await window.electron.endpoints.getFallback();
    setFallbackEndpoint(endpoint);
  };

  useEffect(() => {
    loadEndpoints();
    loadFallbackEndpoint();
  }, []);

  const handleAdd = async () => {
    if (newEndpointName.trim() && newEndpointUrl.trim()) {
      await window.electron.endpoints.add({
        name: newEndpointName.trim(),
        url: newEndpointUrl.trim(),
      });
      setNewEndpointName("");
      setNewEndpointUrl("");
      loadEndpoints();
    }
  };

  const handleDelete = async (key: string) => {
    await window.electron.endpoints.del(key);
    loadEndpoints();
  };

  const handleMove = async (key: string, newIndex: number) => {
    await window.electron.endpoints.move(key, newIndex);
    loadEndpoints();
  };

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = endpointsList[dragIndex];
    const newEndpoints = [...endpointsList];
    newEndpoints.splice(dragIndex, 1);
    newEndpoints.splice(hoverIndex, 0, draggedItem);
    setEndpointsList(newEndpoints);

    // Call the API to persist the new order
    handleMove(draggedItem.key, hoverIndex);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ maxWidth: 600, margin: "20px auto", padding: 2 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Endpoints 管理
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              label="名称"
              fullWidth
              size="small"
              value={newEndpointName}
              onChange={(e) => setNewEndpointName(e.target.value)}
              placeholder="输入新的 endpoint 名称"
            />
            <TextField
              label="URL"
              fullWidth
              size="small"
              value={newEndpointUrl}
              onChange={(e) => setNewEndpointUrl(e.target.value)}
              placeholder="输入新的 endpoint URL"
              onKeyUp={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button variant="contained" onClick={handleAdd}>
              添加
            </Button>
          </Box>

          <List>
            {endpointsList.map((endpoint: Endpoint, index: number) => (
              <DraggableListItem
                key={endpoint.key}
                endpoint={endpoint}
                index={index}
                moveItem={moveItem}
                handleDelete={handleDelete}
              />
            ))}
            {fallbackEndpoint && (
              <ListItem
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  mb: 1,
                  opacity: 1,
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" disabled>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <DragIndicatorIcon
                  sx={{ mr: 1, cursor: "not-allowed", color: "gray" }}
                />
                <ListItemText primary={fallbackEndpoint.name} />
                <ListItemText
                  secondary={fallbackEndpoint.url}
                  sx={{
                    textAlign: "right",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                  }}
                  onClick={() =>
                    window.electron.endpoints.load(fallbackEndpoint.key)
                  }
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </DndProvider>
  );
};

// 创建根元素并渲染应用
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<EndpointsList />);
}
