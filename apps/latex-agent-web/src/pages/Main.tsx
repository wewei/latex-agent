import React from 'react';
import { Typography, Card } from 'antd';

const { Title } = Typography;

const MainPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>LaTeX Agent</Title>
        <p>Welcome to LaTeX Agent. This is the main page.</p>
      </Card>
    </div>
  );
};

export default MainPage; 