import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  message, 
  Empty,
  Tooltip
} from 'antd';
import { 
  FolderOutlined, 
  UserOutlined, 
  LockOutlined, 
  FileTextOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import folderService, { Share, SharePermission, SharedWithMeFolder } from '../services/api/folder';

const { Title, Text } = Typography;

interface SharedFolderType {
  id: string;
  folderId: string;
  folderName: string;
  folderPath: string;
  ownerName: string;
  ownerEmail: string;
  permission: SharePermission;
  sharedAt: string;
}

const SharedFolders: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sharedFolders, setSharedFolders] = useState<SharedFolderType[]>([]);
  const navigate = useNavigate();

  // 加载分享给我的文件夹列表
  const loadSharedFolders = async () => {
    setLoading(true);
    try {
      // 调用API获取分享给当前用户的文件夹列表
      const response = await folderService.getSharedWithMe({
        page: 1,
        pageSize: 10
      });
      
      setSharedFolders(response.items);
    } catch (error) {
      console.error('加载分享文件夹失败:', error);
      message.error('加载分享文件夹失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSharedFolders();
  }, []);

  // 处理查看文件夹
  const handleViewFolder = (folderId: string) => {
    navigate(`/folders/documents?folderId=${folderId}`);
  };

  // 渲染权限标签
  const renderPermissionTag = (permission: SharePermission) => {
    let color = 'default';
    let text = '未知';
    
    switch (permission) {
      case SharePermission.READ:
        color = 'blue';
        text = '只读';
        break;
      case SharePermission.WRITE:
        color = 'green';
        text = '可编辑';
        break;
      case SharePermission.ADMIN:
        color = 'purple';
        text = '管理员';
        break;
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  const columns: ColumnsType<SharedFolderType> = [
    {
      title: '文件夹名称',
      dataIndex: 'folderName',
      key: 'folderName',
      render: (text, record) => (
        <Space>
          <FolderOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '路径',
      dataIndex: 'folderPath',
      key: 'folderPath',
      ellipsis: true,
      responsive: ['md'],
    },
    {
      title: '分享者',
      key: 'owner',
      render: (_, record) => (
        <Space>
          <UserOutlined />
          <span>{record.ownerName}</span>
          <Text type="secondary">({record.ownerEmail})</Text>
        </Space>
      ),
      responsive: ['sm'],
    },
    {
      title: '权限',
      dataIndex: 'permission',
      key: 'permission',
      render: (permission) => renderPermissionTag(permission),
    },
    {
      title: '分享时间',
      dataIndex: 'sharedAt',
      key: 'sharedAt',
      render: (date) => new Date(date).toLocaleString(),
      responsive: ['lg'],
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="查看文件夹">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewFolder(record.folderId)}
            />
          </Tooltip>
          {record.permission !== SharePermission.READ && (
            <Tooltip title="编辑文件">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => handleViewFolder(record.folderId)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>分享给我的文件夹</Title>
      
      <Card>
        <Table 
          columns={columns} 
          dataSource={sharedFolders}
          rowKey="id"
          loading={loading}
          pagination={{ 
            responsive: true,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          locale={{ 
            emptyText: (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description="暂无分享给我的文件夹" 
              />
            ) 
          }}
        />
      </Card>
    </Space>
  );
};

export default SharedFolders; 