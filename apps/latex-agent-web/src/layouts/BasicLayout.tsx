import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Button, Dropdown, Avatar, Space, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  FileTextOutlined,
  FolderOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  HomeOutlined,
  FolderViewOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { authService } from '../services/api';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  
   
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768 && !collapsed) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [collapsed]);

  // 从路径中获取当前选中的菜单项
  const pathParts = location.pathname.split('/').filter(Boolean);
  const selectedKeys = pathParts.length > 0 ? [`${pathParts[0]}${pathParts.length > 1 ? `/${pathParts[1]}` : ''}`] : ['dashboard'];
  const openKeys = pathParts.length > 0 ? [pathParts[0]] : [];

  const menuItems: MenuProps['items'] = [    
    {
      key: 'main',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: 'edit/test-document',
      icon: <FileTextOutlined />,
      label: 'Test Document',
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },    
    {
      key: 'workspaces',
      icon: <TeamOutlined />,
      label: '工作区管理',
    },
    {
      key: 'folders',
      icon: <FolderOutlined />,
      label: '文件夹管理',
      children: [
        {
          key: 'folders/list',
          icon:<FolderViewOutlined />,
          label: '所有文件夹',
        },
        {
          key: 'folders/documents',
          icon: <FileTextOutlined />,
          label: '文件管理',
        },
      ],
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleUserMenuClick = async ({ key }: { key: string }) => {
    console.log('haandleUerMenu。。。。。')
    if (key === 'logout') {
      try {
        // 调用登出 API
        await authService.logout();
        
        // 清除本地存储的认证信息
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        
        // 重定向到登录页面
        navigate('/login');
      } catch (error) {
        console.error('登出失败:', error);
        message.error('登出失败，请稍后重试');
      }
    } else {
      navigate(`/${key}`);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        style={{
          overflow: 'auto',
          position: isMobile ? 'fixed' : 'relative',
          height: '100vh',
          left: 0,
          zIndex: 1000
        }}
      >
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          fontSize: collapsed && !isMobile ? '12px' : '16px',
          overflow: 'hidden'
        }}>
          {collapsed && !isMobile ? 'LA' : 'LaTeX Agent'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={({ key }) => {
            // 处理子菜单路径
            navigate(`/${key}`);
          }}
        />
      </Sider>
      {/* collapsed ? 30 : 30 这里暂时处理成一样的参数值，需要验证一下浏览器显示效果 */}
      <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 30 : 30), transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer,
          position: 'sticky',
          top: 0,
          zIndex: 999,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ 
                fontSize: '16px', 
                width: 64, 
                height: 64,
              }}
            />
            <div style={{ marginLeft: 16 }}>
              <span style={{ fontSize: '18px' }}>LaTeX Agent 工作平台</span>
            </div>
          </div>
          
          <div id='user-dropdown-container' style={{ position: 'relative',  marginRight: 12, width: 160}}>
             <Dropdown 
              menu={{ items: userMenuItems
                , onClick: handleUserMenuClick 
              }} 
              // overlayStyle={{ width: 110 }}
              placement="bottomRight"
              trigger={['hover']}              
              getPopupContainer={() => document.getElementById('user-dropdown-container') || document.body}
            >
              
              <Space style={{ cursor: 'pointer' }}>
                  <Avatar icon={<UserOutlined />} />
                  <span style={{ display: isMobile ? 'none' : 'inline' }}>admin</span>
                  <DownOutlined />
                </Space>
            </Dropdown> 
          </div>
        </Header>
        <Content
          style={{
            marginTop: '16px',
            marginLeft: '0px',
            marginRight: '0px',
            marginBottom: '0px',
            padding: 16,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout; 