import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Row, Col, Input, Modal, Form, Select, message, Tree, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FolderOutlined, FolderOpenOutlined, FolderAddOutlined, ShareAltOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import folderService, { SharePermission } from '../services/api/folder';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface FolderType {
  key: string;
  name: string;
  path: string;
  parentId: string | null;
  workspaceId: string;
  createTime: string;
  updateTime: string;
  fileCount: number;
}

const Folders: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [shareForm] = Form.useForm();
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);
  const [sharingFolder, setSharingFolder] = useState<FolderType | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCreateFolder = () => {
    setEditingFolder(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditFolder = (folder: FolderType) => {
    setEditingFolder(folder);
    form.setFieldsValue(folder);
    setIsModalVisible(true);
  };

  const handleDeleteFolder = (folder: FolderType) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除文件夹 "${folder.name}" 吗？此操作将同时删除文件夹内的所有内容。`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        message.success(`文件夹 "${folder.name}" 已删除`);
      },
    });
  };

  const handleShareFolder = (folder: FolderType) => {
    setSharingFolder(folder);
    shareForm.resetFields();
    setIsShareModalVisible(true);
  };

  const handleShareModalOk = () => {
    shareForm.validateFields().then(values => {
      // 这里应该调用API分享文件夹
      // 实际使用时替换为: await folderService.share(sharingFolder!.key, values);
      message.success(`文件夹 "${sharingFolder!.name}" 已分享给 ${values.email}`);
      setIsShareModalVisible(false);
    });
  };

  const columns: ColumnsType<FolderType> = [
    {
      title: '文件夹名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (text, record) => (
        <Space>
          <FolderOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true,
      responsive: ['md'],
    },
    {
      title: '所属工作区',
      dataIndex: 'workspaceId',
      key: 'workspaceId',
      render: (workspaceId: string) => {
        const workspace = workspaces.find(w => w.key === workspaceId);
        return workspace ? workspace.name : workspaceId;
      },
      responsive: ['md'],
    },
    {
      title: '文件数量',
      dataIndex: 'fileCount',
      key: 'fileCount',
      responsive: ['sm'],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      responsive: ['lg'],
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      responsive: ['lg'],
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} size={isMobile ? 'small' : 'middle'} onClick={() => handleEditFolder(record)}>
            {!isMobile && '编辑'}
          </Button>
          <Tooltip title="分享文件夹">
            <Button type="text" icon={<ShareAltOutlined />} size={isMobile ? 'small' : 'middle'} onClick={() => handleShareFolder(record)}>
              {!isMobile && '分享'}
            </Button>
          </Tooltip>
          <Button type="text" danger icon={<DeleteOutlined />} size={isMobile ? 'small' : 'middle'} onClick={() => handleDeleteFolder(record)}>
            {!isMobile && '删除'}
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟工作区数据
  const workspaces = [
    { key: '1', name: '研究项目' },
    { key: '2', name: '论文写作' },
    { key: '3', name: '数据分析' },
    { key: '4', name: '项目协作' },
  ];

  // 模拟文件夹数据
  const data: FolderType[] = [
    {
      key: '1',
      name: '研究资料',
      path: '/研究项目/研究资料',
      parentId: null,
      workspaceId: '1',
      createTime: '2024-04-01',
      updateTime: '2024-04-10',
      fileCount: 12,
    },
    {
      key: '2',
      name: '参考文献',
      path: '/研究项目/参考文献',
      parentId: null,
      workspaceId: '1',
      createTime: '2024-04-02',
      updateTime: '2024-04-09',
      fileCount: 8,
    },
    {
      key: '3',
      name: '数据分析',
      path: '/研究项目/研究资料/数据分析',
      parentId: '1',
      workspaceId: '1',
      createTime: '2024-04-05',
      updateTime: '2024-04-08',
      fileCount: 5,
    },
    {
      key: '4',
      name: '实验记录',
      path: '/研究项目/研究资料/实验记录',
      parentId: '1',
      workspaceId: '1',
      createTime: '2024-04-06',
      updateTime: '2024-04-07',
      fileCount: 3,
    },
    {
      key: '5',
      name: '论文草稿',
      path: '/论文写作/论文草稿',
      parentId: null,
      workspaceId: '2',
      createTime: '2024-04-03',
      updateTime: '2024-04-11',
      fileCount: 4,
    },
    {
      key: '6',
      name: '图表',
      path: '/论文写作/图表',
      parentId: null,
      workspaceId: '2',
      createTime: '2024-04-04',
      updateTime: '2024-04-12',
      fileCount: 6,
    },
  ];

  // 构建树形结构数据
  const buildTreeData = (folders: FolderType[]): DataNode[] => {
    const folderMap = new Map<string, DataNode>();
    const roots: DataNode[] = [];

    // 首先创建所有节点
    folders.forEach(folder => {
      folderMap.set(folder.key, {
        key: folder.key,
        title: folder.name,
        isLeaf: false,
        children: [],
      });
    });

    // 然后构建树形结构
    folders.forEach(folder => {
      const node = folderMap.get(folder.key)!;
      if (folder.parentId === null) {
        roots.push(node);
      } else {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      }
    });

    return roots;
  };

  const treeData = buildTreeData(data);

  const onExpand = (newExpandedKeys: React.Key[], info: any) => {
    setExpandedKeys(newExpandedKeys as string[]);
    setAutoExpandParent(false);
  };

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2}>文件夹管理</Title>
        </Col>
        <Col>
          <Space>
            <Button 
              type={viewMode === 'list' ? 'primary' : 'default'} 
              icon={<FolderOpenOutlined />} 
              onClick={() => setViewMode('list')}
            >
              列表视图
            </Button>
            <Button 
              type={viewMode === 'tree' ? 'primary' : 'default'} 
              icon={<FolderOutlined />} 
              onClick={() => setViewMode('tree')}
            >
              树形视图
            </Button>
            <Button 
              type="primary" 
              icon={<FolderAddOutlined />} 
              onClick={handleCreateFolder}
            >
              新建文件夹
            </Button>
          </Space>
        </Col>
      </Row>
      
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={16} md={18}>
            <Search
              placeholder="搜索文件夹"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
            />
          </Col>
          <Col xs={24} sm={8} md={6} style={{ textAlign: isMobile ? 'left' : 'right' }}>
            <Space>
              <Button 
                type={viewMode === 'list' ? 'primary' : 'default'} 
                icon={<FolderOutlined />} 
                onClick={() => setViewMode('list')}
              >
                {!isMobile && '列表视图'}
              </Button>
              <Button 
                type={viewMode === 'tree' ? 'primary' : 'default'} 
                icon={<FolderOpenOutlined />} 
                onClick={() => setViewMode('tree')}
              >
                {!isMobile && '树形视图'}
              </Button>
              <Button type="primary" icon={<FolderAddOutlined />} onClick={handleCreateFolder}>
                {!isMobile && '新建文件夹'}
              </Button>
            </Space>
          </Col>
        </Row>
        
        {viewMode === 'list' ? (
          <Table 
            columns={columns} 
            dataSource={data}
            scroll={{ x: 'max-content' }}
            pagination={{ 
              responsive: true,
              showSizeChanger: !isMobile,
              showQuickJumper: !isMobile,
            }}
          />
        ) : (
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px' }}>
            <Tree
              showLine
              showIcon
              defaultExpandAll
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={onSelect}
              treeData={treeData}
            />
          </div>
        )}
      </Card>

      <Modal
        title={editingFolder ? "编辑文件夹" : "新建文件夹"}
        open={isModalVisible}
        onOk={() => {
          form.validateFields().then(values => {
            if (editingFolder) {
              message.success(`文件夹 "${values.name}" 已更新`);
            } else {
              message.success(`文件夹 "${values.name}" 已创建`);
            }
            setIsModalVisible(false);
          });
        }}
        onCancel={() => setIsModalVisible(false)}
        width={isMobile ? '90%' : '500px'}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="文件夹名称"
            rules={[{ required: true, message: '请输入文件夹名称' }]}
          >
            <Input placeholder="请输入文件夹名称" />
          </Form.Item>
          <Form.Item
            name="workspaceId"
            label="所属工作区"
            rules={[{ required: true, message: '请选择所属工作区' }]}
          >
            <Select placeholder="请选择所属工作区">
              {workspaces.map(workspace => (
                <Option key={workspace.key} value={workspace.key}>{workspace.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="parentId"
            label="父文件夹"
          >
            <Select 
              placeholder="请选择父文件夹（可选）"
              allowClear
            >
              <Option value={null}>根目录</Option>
              {data.map(folder => (
                <Option key={folder.key} value={folder.key}>{folder.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 分享文件夹对话框 */}
      <Modal
        title={`分享文件夹: ${sharingFolder?.name || ''}`}
        open={isShareModalVisible}
        onOk={handleShareModalOk}
        onCancel={() => setIsShareModalVisible(false)}
        width={500}
      >
        <Form
          form={shareForm}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="分享给"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>
          <Form.Item
            name="permission"
            label="权限"
            rules={[{ required: true, message: '请选择权限' }]}
            initialValue={SharePermission.READ}
          >
            <Select placeholder="请选择权限">
              <Option value={SharePermission.READ}>只读</Option>
              <Option value={SharePermission.WRITE}>可编辑</Option>
              <Option value={SharePermission.ADMIN}>管理员</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="message"
            label="留言"
          >
            <Input.TextArea placeholder="请输入留言（可选）" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default Folders; 