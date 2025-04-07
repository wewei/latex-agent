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
  Input, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Popconfirm,
  message
} from "antd";
import { 
  DeleteOutlined, 
  DragOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { Endpoint } from "./endpoints/shared";
import {
  DndProvider,
  useDrag,
  useDrop,
  DragSourceMonitor,
  DropTargetMonitor,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const { Title } = Typography;

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
  const ref = React.useRef<HTMLDivElement>(null);

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
    <div
      ref={ref}
      key={endpoint.key}
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 4,
        marginBottom: 8,
        padding: 12,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? "#f0f0f0" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "move",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        <DragOutlined style={{ marginRight: 8, color: "#999" }} />
        <div>
          <div style={{ fontWeight: 500 }}>{endpoint.name}</div>
          <div
            style={{
              color: "#666",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
            onClick={() => window.electron.endpoints.load(endpoint.key)}
          >
            {endpoint.url}
          </div>
        </div>
      </div>
      <Popconfirm
        title="确定要删除这个 endpoint 吗?"
        onConfirm={() => handleDelete(endpoint.key)}
        okText="确定"
        cancelText="取消"
      >
        <Button type="text" icon={<DeleteOutlined />} danger />
      </Popconfirm>
    </div>
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
      message.success("Endpoint 添加成功");
    } else {
      message.error("名称和 URL 不能为空");
    }
  };

  const handleDelete = async (key: string) => {
    await window.electron.endpoints.del(key);
    loadEndpoints();
    message.success("Endpoint 删除成功");
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
      <div style={{ maxWidth: 600, margin: "20px auto", padding: 16 }}>
        <Card>
          <Title level={4}>Endpoints 管理</Title>

          <Space style={{ width: "100%", marginBottom: 16 }}>
            <Input
              placeholder="输入新的 endpoint 名称"
              value={newEndpointName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEndpointName(e.target.value)}
              style={{ flex: 1 }}
            />
            <Input
              placeholder="输入新的 endpoint URL"
              value={newEndpointUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEndpointUrl(e.target.value)}
              onPressEnter={handleAdd}
              style={{ flex: 1 }}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
            >
              添加
            </Button>
          </Space>

          <List
            dataSource={endpointsList}
            renderItem={(endpoint: Endpoint, index: number) => (
              <DraggableListItem
                key={endpoint.key}
                endpoint={endpoint}
                index={index}
                moveItem={moveItem}
                handleDelete={handleDelete}
              />
            )}
          />
          
          {fallbackEndpoint && (
            <div
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 4,
                marginBottom: 8,
                padding: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <DragOutlined style={{ marginRight: 8, color: "#999" }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{fallbackEndpoint.name}</div>
                  <div style={{ 
                    color: "#666", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    whiteSpace: "nowrap",
                    maxWidth: "100%"
                  }}
                  onClick={() => window.electron.endpoints.loadFallback()}
                  >
                    {fallbackEndpoint.url}
                  </div>
                </div>
              </div>
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                disabled
              />
            </div>
          )}
        </Card>
      </div>
    </DndProvider>
  );
};

// 创建根元素并渲染应用
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<EndpointsList />);
}
