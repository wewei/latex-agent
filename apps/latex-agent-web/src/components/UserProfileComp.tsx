// src/components/UserProfileComponent.tsx
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../common/GlobalStateContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { DownOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Space, Avatar, MenuProps } from 'antd';

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

const UserProfileComponent: React.FC = () => {
  const { userProfile, setUserProfile, other, setOther } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  // 使用 React Router 的导航钩子
  const navigate = useNavigate();

  const handleUserMenuClick = async ({ key }: { key: string }) => {
    console.log('handleUerMenu。。。。。')
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
      }
    } else {
      navigate(`/${key}`);
    }
  };


  // 在组件挂载时检查用户登录状态
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        setLoading(true);
        const profile = await authService.getMyProfile();
        console.log('User profile:', profile);
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to get user profile:', error);
        // 重定向到登录页面
        navigate('/login');
        // 如果没有使用 React Router，可以使用以下方式重定向
        // window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    checkUserAuth();
  }, []);
  {/* 显示当前用户信息 */ }
  return (
    <div style={{ position: 'relative', marginRight: 2, width: 160 }}>
      <Dropdown
        menu={{
          items: userMenuItems
          , onClick: handleUserMenuClick
        }}
        // overlayStyle={{ width: 110 }}
        placement="bottomRight"
        trigger={['hover']}
        getPopupContainer={() => document.getElementById('user-dropdown-container') || document.body}
      >

        <Space style={{ cursor: 'pointer' }}>
          <Avatar style={{ backgroundColor: '#5829BC' }}>
            {userProfile.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <span style={{ marginLeft: 8 }}>{userProfile.username}</span>
          <DownOutlined />
        </Space>
      </Dropdown>
    </div>

  );
};

export default UserProfileComponent;