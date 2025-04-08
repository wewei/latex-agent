import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Space, Typography } from 'antd';
import { FileTextOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [colSpan, setColSpan] = useState(8);

  // 响应式布局
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 576) {
        setColSpan(24);
      } else if (windowWidth < 992) {
        setColSpan(12);
      } else {
        setColSpan(8);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化时调用一次
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>仪表盘</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable>
            <Statistic
              title="文档总数"
              value={93}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable>
            <Statistic
              title="活跃用户"
              value={12}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card hoverable>
            <Statistic
              title="处理时间"
              value={2.5}
              suffix="分钟"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="最近活动" 
            hoverable 
            style={{ height: '100%', minHeight: 300 }}
          >
            <p>这里显示最近的系统活动...</p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="系统状态" 
            hoverable 
            style={{ height: '100%', minHeight: 300 }}
          >
            <p>这里显示系统状态信息...</p>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Dashboard; 