import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Dropdown, Menu, Tabs, Space, Row, Col, Avatar, Tooltip, Empty, MenuProps  } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  PlusOutlined, 
  DownOutlined, 
  ImportOutlined, 
  FileOutlined,
  LockOutlined,
  EllipsisOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  StarOutlined
} from '@ant-design/icons';
import { authService } from '../services/api';


const { Title } = Typography;
const { TabPane } = Tabs;

// 模拟文档数据 - 分类整理
const recentDocuments = [
  {
    id: 1,
    title: 'Copy of Startup Pitch Deck Template',
    preview: 'https://via.placeholder.com/300x180/333/fff?text=Startup+Pitch',
    isPrivate: true,
    creator: 'JY',
    lastEdited: '2天前'
  },
  {
    id: 2,
    title: 'Untitled',
    preview: 'https://via.placeholder.com/300x180/eee/999?text=Untitled',
    isPrivate: true,
    creator: 'JY',
    lastEdited: '5天前'
  },
  {
    id: 3,
    title: 'Gamma Tips & Tricks',
    preview: 'https://via.placeholder.com/300x180/f5f5ff/333?text=Gamma+Tips',
    isPrivate: true,
    creator: 'JY',
    lastEdited: '5天前'
  }
];

const createdDocuments = [
  {
    id: 4,
    title: 'My Research Paper',
    preview: 'https://via.placeholder.com/300x180/fff5f5/333?text=Research+Paper',
    isPrivate: true,
    creator: 'JY',
    lastEdited: '1周前'
  },
  {
    id: 5,
    title: 'Project Proposal',
    preview: 'https://via.placeholder.com/300x180/f5fff5/333?text=Project+Proposal',
    isPrivate: false,
    creator: 'JY',
    lastEdited: '2周前'
  }
];

const favoriteDocuments = [
  {
    id: 6,
    title: 'Important Notes',
    preview: 'https://via.placeholder.com/300x180/f5f5ff/333?text=Important+Notes',
    isPrivate: true,
    creator: 'JY',
    lastEdited: '3天前'
  }
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

// 所有文档集合
const allDocuments = [...recentDocuments, ...createdDocuments, ...favoriteDocuments];

const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 使用 React Router 的导航钩子
  const navigate = useNavigate();
  
  // 在组件挂载时检查用户登录状态
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        setLoading(true);
        const profile = await authService.getMyProfile();
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
  }, [navigate]);
  
  // 如果正在加载用户信息，显示加载状态
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>加载中...</div>
      </div>
    );
  }

  const newDropdownMenu = (
    <Menu>
      <Menu.Item key="blank">从空白页面新建</Menu.Item>
      <Menu.Item key="template">从模板新建</Menu.Item>
      <Menu.Item key="ai">使用AI新建</Menu.Item>
    </Menu>
  );

  const importDropdownMenu = (
    <Menu>
      <Menu.Item key="file">从文件导入</Menu.Item>
      <Menu.Item key="link">从链接导入</Menu.Item>
    </Menu>
  );

  // 根据当前标签页选择要显示的文档
  const getDocumentsByTab = () => {
    switch (activeTab) {
      case 'all':
        return allDocuments;
      case 'recent':
        return recentDocuments;
      case 'created':
        return createdDocuments;
      case 'favorites':
        return favoriteDocuments;
      default:
        return [];
    }
  };

  // 获取当前标签页下的文档
  const currentDocuments = getDocumentsByTab();

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
      }
    } else {
      navigate(`/${key}`);
    }
  };

  // 渲染文档卡片
  const renderDocumentCards = () => {
    if (currentDocuments.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Empty description="没有找到文档" />
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {currentDocuments.map(doc => (
          <Col xs={24} sm={12} md={8} key={doc.id}>
            <Card
              bordered={false}
              cover={
                <div style={{ height: 180, overflow: 'hidden' }}>
                  <img 
                    alt={doc.title}
                    src={doc.preview}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              }
              bodyStyle={{ padding: '12px' }}
              style={{ borderRadius: 8, overflow: 'hidden' }}
            >
              <div style={{ marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0 }}>{doc.title}</Title>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <LockOutlined /> 私有
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Tooltip title="更多操作">
                    <Button 
                      type="text" 
                      icon={<EllipsisOutlined />} 
                      size="small"
                      style={{ marginLeft: 'auto' }}
                    />
                  </Tooltip>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                <Avatar style={{ backgroundColor: '#87d068' }} size="small">
                  {doc.creator}
                </Avatar>
                <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>
                  由你创建
                </span>
                <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>
                  上次查看于 {doc.lastEdited}
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 顶部导航栏 */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            style={{ backgroundColor: '#5829BC', borderColor: '#5829BC' }}
          >
            新建 AI
          </Button>
          
          <Dropdown overlay={newDropdownMenu} trigger={['click']}>
            <Button>
              <Space>
                <PlusOutlined />
                从空白页面新建
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          
          <Dropdown overlay={importDropdownMenu} trigger={['click']}>
            <Button>
              <Space>
                <ImportOutlined />
                导入
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
        
        {/* 显示当前用户信息 */}
        {userProfile && (
          <div>
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
              <Avatar style={{ backgroundColor: '#5829BC' }}>
              {userProfile.username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <span style={{ marginLeft: 8 }}>{userProfile.username}</span>
                  <DownOutlined />
                </Space>
            </Dropdown> 
          </div>
        )}
      </div>

      {/* 标签栏 */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        style={{ marginBottom: 30 }}
      >
        <TabPane tab={<Space><FileOutlined />全部</Space>} key="all" />
        <TabPane tab={<Space><ClockCircleOutlined />最近查看</Space>} key="recent" />
        <TabPane tab={<Space><UserOutlined />由你创建</Space>} key="created" />
        <TabPane tab={<Space><StarOutlined />收藏夹</Space>} key="favorites" />
      </Tabs>

      {/* 文档卡片网格 - 根据当前标签页显示不同内容 */}
      {renderDocumentCards()}
    </div>
  );
};

export default MainPage;