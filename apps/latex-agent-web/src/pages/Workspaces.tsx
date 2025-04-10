import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Row, Col, Input, Modal, Form, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FolderOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface WorkspaceType {
  key: string;
  name: string;
  description: string;
  status: string;
  owner: string;
  createTime: string;
  memberCount: number;
}

const Workspaces: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingWorkspace, setEditingWorkspace] = useState<WorkspaceType | null>(null);

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

  const handleCreateWorkspace = () => {
    setEditingWorkspace(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditWorkspace = (workspace: WorkspaceType) => {
    setEditingWorkspace(workspace);
    form.setFieldsValue(workspace);
    setIsModalVisible(true);
  };

  const handleDeleteWorkspace = (workspace: WorkspaceType) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除工作区 "${workspace.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        message.success(`工作区 "${workspace.name}" 已删除`);
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingWorkspace) {
        message.success(`工作区 "${values.name}" 已更新`);
      } else {
        message.success(`工作区 "${values.name}" 已创建`);
      }
      setIsModalVisible(false);
    });
  };

  const columns: ColumnsType<WorkspaceType> = [
    {
      title: '工作区名称',
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
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      responsive: ['md'],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '活跃' ? 'success' : 'default'}>
          {status}
        </Tag>
      ),
      responsive: ['sm'],
    },
    {
      title: '所有者',
      dataIndex: 'owner',
      key: 'owner',
      responsive: ['md'],
    },
    {
      title: '成员数',
      dataIndex: 'memberCount',
      key: 'memberCount',
      responsive: ['sm'],
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      responsive: ['lg'],
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} size={isMobile ? 'small' : 'middle'} onClick={() => handleEditWorkspace(record)}>
            {!isMobile && '编辑'}
          </Button>
          <Button type="text" danger icon={<DeleteOutlined />} size={isMobile ? 'small' : 'middle'} onClick={() => handleDeleteWorkspace(record)}>
            {!isMobile && '删除'}
          </Button>
        </Space>
      ),
    },
  ];

  const data: WorkspaceType[] = [
    {
      key: '1',
      name: '研究项目',
      description: '用于学术研究的协作空间',
      status: '活跃',
      owner: 'admin',
      createTime: '2024-04-01',
      memberCount: 5,
    },
    {
      key: '2',
      name: '论文写作',
      description: '论文写作和编辑工作区',
      status: '活跃',
      owner: 'admin',
      createTime: '2024-04-05',
      memberCount: 3,
    },
    {
      key: '3',
      name: '数据分析',
      description: '数据分析和可视化工作区',
      status: '非活跃',
      owner: 'user1',
      createTime: '2024-03-15',
      memberCount: 2,
    },
    {
      key: '4',
      name: '项目协作',
      description: '团队项目协作空间',
      status: '活跃',
      owner: 'admin',
      createTime: '2024-03-20',
      memberCount: 8,
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>工作区管理</Title>
      
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={16} md={18}>
            <Search
              placeholder="搜索工作区"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
            />
          </Col>
          <Col xs={24} sm={8} md={6} style={{ textAlign: isMobile ? 'left' : 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateWorkspace}>
              创建工作区
            </Button>
          </Col>
        </Row>
        
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
      </Card>

      <Modal
        title={editingWorkspace ? "编辑工作区" : "创建工作区"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={isMobile ? '90%' : '500px'}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: '活跃' }}
        >
          <Form.Item
            name="name"
            label="工作区名称"
            rules={[{ required: true, message: '请输入工作区名称' }]}
          >
            <Input placeholder="请输入工作区名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入工作区描述' }]}
          >
            <Input.TextArea placeholder="请输入工作区描述" rows={3} />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择工作区状态' }]}
          >
            <Select placeholder="请选择工作区状态">
              <Option value="活跃">活跃</Option>
              <Option value="非活跃">非活跃</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default Workspaces; 