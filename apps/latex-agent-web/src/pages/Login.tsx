import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService, LoginParams } from '../services/api';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values: LoginParams) => {
    setLoading(true);
    try {
      // 调用登录 API
      const response = await authService.login(values);
      
      // 保存登录状态和用户信息
      localStorage.setItem('token', response.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(response.user));
      
      message.success('登录成功');
      
      // 获取重定向路径
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    message.info(`使用 ${provider} 登录功能待实现`);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>LaTeX Agent</Title>
          <Text type="secondary">登录您的账户</Text>
        </div>
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Link to="/register">还没有账户？立即注册</Link>
          </div>
          
          <Divider>或使用以下方式登录</Divider>
          
          <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
            <Button 
              icon={<GoogleOutlined />} 
              shape="circle" 
              size="large"
              onClick={() => handleSocialLogin('Google')}
            />
            <Button 
              icon={<GithubOutlined />} 
              shape="circle" 
              size="large"
              onClick={() => handleSocialLogin('GitHub')}
            />
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 