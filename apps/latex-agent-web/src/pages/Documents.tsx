import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Typography, Card, Input, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Search } = Input;

interface DataType {
  key: string;
  name: string;
  status: string;
  createTime: string;
  updateTime: string;
}

const Documents: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化时调用一次
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: '文档名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '已完成' ? 'success' : 'processing'}>
          {status}
        </Tag>
      ),
      responsive: ['md'],
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
          <Button type="text" icon={<EditOutlined />} size={isMobile ? 'small' : 'middle'}>
            {!isMobile && '编辑'}
          </Button>
          <Button type="text" danger icon={<DeleteOutlined />} size={isMobile ? 'small' : 'middle'}>
            {!isMobile && '删除'}
          </Button>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      name: '示例文档 1',
      status: '已完成',
      createTime: '2024-04-08 10:00:00',
      updateTime: '2024-04-08 11:00:00',
    },
    {
      key: '2',
      name: '示例文档 2',
      status: '处理中',
      createTime: '2024-04-08 09:00:00',
      updateTime: '2024-04-08 09:30:00',
    },
    {
      key: '3',
      name: '研究报告',
      status: '已完成',
      createTime: '2024-04-07 14:30:00',
      updateTime: '2024-04-07 16:45:00',
    },
    {
      key: '4',
      name: '学术论文',
      status: '处理中',
      createTime: '2024-04-06 11:20:00',
      updateTime: '2024-04-06 13:10:00',
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>文档管理</Title>
      
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={16} md={18}>
            <Search
              placeholder="搜索文档"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
            />
          </Col>
          <Col xs={24} sm={8} md={6} style={{ textAlign: isMobile ? 'left' : 'right' }}>
            <Button type="primary" icon={<PlusOutlined />}>
              新建文档
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
    </Space>
  );
};

export default Documents; 