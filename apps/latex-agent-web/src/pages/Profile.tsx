import React, { useState, useEffect } from 'react';
import { Card, Avatar, Descriptions, Button, Space, Typography, Row, Col } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Profile: React.FC = () => {
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

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>个人中心</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card hoverable>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={isMobile ? 80 : 120} icon={<UserOutlined />} />
              <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>admin</Title>
              <div>管理员</div>
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                style={{ marginTop: 24 }}
              >
                编辑资料
              </Button>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={16}>
          <Card 
            title="用户详情" 
            hoverable
            style={{ height: '100%' }}
          >
            <Descriptions 
              bordered 
              column={{ xs: 1, sm: 2, md: 2 }}
              layout={isMobile ? 'vertical' : 'horizontal'}
            >
              <Descriptions.Item label="用户名">admin</Descriptions.Item>
              <Descriptions.Item label="邮箱">admin@example.com</Descriptions.Item>
              <Descriptions.Item label="角色">管理员</Descriptions.Item>
              <Descriptions.Item label="注册时间">2024-01-01</Descriptions.Item>
              <Descriptions.Item label="最后登录">2024-04-08</Descriptions.Item>
              <Descriptions.Item label="状态">活跃</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card 
            title="活动记录" 
            hoverable
          >
            <p>最近没有活动记录</p>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Profile; 