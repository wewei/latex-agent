import React, { useState, useEffect, use } from 'react';
import { Typography, Card, Button, Dropdown, Menu, Tabs, Space, Row, Col, Avatar, Tooltip, Empty, MenuProps, Modal, message, Pagination, PaginationProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext ,GlobalStateProvider, GlobalStateContext} from '../common/GlobalStateContext';
import {
  PlusOutlined,
  FileOutlined,
  LockOutlined,
  EllipsisOutlined,
  ClockCircleOutlined,
  UserOutlined,
  StarOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { authService, fileService,recentVisitService } from '../services/api';
import { UserProfile } from '../services/api/user';
// import UserProfileComponent from '../components/UserProfileComp';



const { Title } = Typography;
const { TabPane } = Tabs;

// 辅助函数：格式化最后编辑时间
const formatLastEdited = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) {
    return '今天';
  } else if (diffInDays === 1) {
    return '昨天';
  } else if (diffInDays < 7) {
    return `${diffInDays}天前`;
  } else if (diffInDays < 30) {
    return `${Math.floor(diffInDays / 7)}周前`;
  } else {
    return `${Math.floor(diffInDays / 30)}月前`;
  }
};

const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('');
  const [currentDocuments, setCurrentDocuments] = useState<any[]>([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const {userProfile} = useGlobalContext()
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const showModal = (docId: string) => {
    setIsModalOpen(true);
    setSelectedDocId(docId);
  };
  // 使用 React Router 的导航钩子
  const navigate = useNavigate(); 

  const fetchDocuments = async () => {
    if(!userProfile) {
      setCurrentDocuments([]); 
      return;
    }
    switch (activeTab) {
      case 'all':
        const fetchAll = async () => {
          const files = await fileService.getByWorkspace(userProfile.currentWorkspace,
            { page: pageNo, pageSize: pageSize, order: 'desc', orderBy: 'updated_at' });
          //@TODO creator 需要从数据库中返回
          if (files && files.items) {
            const transformedDocs = files.items.map((file: any) => ({
              id: file.id,
              title: file.name,
              isPrivate: true,
              creator: userProfile?.username?.charAt(0)?.toUpperCase() || 'U',
              ownerId: file.owner_id,
              ownerName: file.owner_name,
              lastEdited: formatLastEdited(file.updated_at)
            }));
            setTotalDocuments(files.total);
            setCurrentDocuments(transformedDocs);
          } else {
            setCurrentDocuments([]);
          }
        }
        fetchAll();
        break;
      case 'recent':
        const fetchRecent = async () => {
          const files = await recentVisitService.getRecentVisitByWorkspace(userProfile.currentWorkspace,
             { page: pageNo, pageSize: pageSize, order: 'desc', orderBy: 'visited_at' })
          ;

          if (files && files.items) {
            const transformedDocs = files.items.map((file: any) => ({
              id: file.id,
              title: file.name,
              isPrivate: true,
              creator: userProfile?.username?.charAt(0)?.toUpperCase() || 'U',
              ownerId: file.owner_id,
              ownerName: file.owner_name,
              lastVisited: formatLastEdited(file.visited_at)
            }));
            setTotalDocuments(files.total);
            setCurrentDocuments(transformedDocs);
          } else {
            setCurrentDocuments([]);
          }
        }
        fetchRecent();
        break;
      case 'created':
        const fetchMyFiles = async () => {
          const files = await fileService.getMyListByWorkspace(userProfile.currentWorkspace,
            { page: pageNo, pageSize: pageSize, order: 'desc', orderBy: 'created_at' });
          
          if (files && files.items) {
            const transformedDocs = files.items.map((file: any) => ({
              id: file.id,
              title: file.name,
              isPrivate: true,
              creator: userProfile?.username?.charAt(0)?.toUpperCase() || 'U',
              ownerId: file.owner_id,
              ownerName: file.owner_name,
              lastCreated: formatLastEdited(file.created_at)
            }));
            setTotalDocuments(files.total);
            setCurrentDocuments(transformedDocs);
          } else {
            setCurrentDocuments([]);
          }
        }
        fetchMyFiles();
        break;
      case 'favorites':
        setCurrentDocuments([]);
        break;
    }
  }

  useEffect(() => {
    console.log('userProfile changed:', userProfile);
    if(userProfile!=undefined && userProfile.id!=''){
      setLoading(false);
      setActiveTab('all');
    }
  }, [userProfile]);
  
 
  useEffect(() => {    
    // 这里可以添加任何需要在组件加载时执行的逻辑
    fetchDocuments();
  }, [activeTab, pageNo, pageSize]);


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

  // 添加创建新文档处理函数
  const handleCreateNewDocument = async () => {
    try {
      // 显示加载状态或禁用按钮（如果需要）
      // setIsCreating(true);

      // 调用API创建新文档
      const response = await fileService.create({
        name: `新文档`,
        workspace_id: userProfile?.currentWorkspace || '',
        content: '', // 空白文档内容,
        type: 'file'
      });

      // 创建成功后导航到编辑页面
      navigate(`/edit/${response.document_id}`);
    } catch (error) {
      console.error('创建文档失败:', error);
      // 这里可以添加错误处理，如显示错误消息
      // message.error('创建文档失败，请重试');
    } finally {
      // 恢复按钮状态（如果需要）
      // setIsCreating(false);
    }
  };

  // 添加卡片点击处理函数
  const handleCardClick = (docId: string) => {
    navigate(`/edit/${docId}`);
  };
  
  const handleDeleteFile = async (docId: string) => {
    console.log('handleDeleteFile', docId);
    try {
      // 调用API删除文档
      const response = await fileService.delete(docId);
      messageApi.success('删除成功！');
      fetchDocuments();
    } catch (error) {
      console.error('删除文档失败:', error);
    } finally {
      setIsModalOpen(false);
    }
  }

  

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
        
        {contextHolder}
        {currentDocuments.map(doc => (
          <Col xs={24} sm={12} md={8} key={doc.id}>
            <Card
              bordered={false}
              hoverable
              onClick={() => handleCardClick(doc.id)}
              style={{ 
                borderRadius: 8, 
                overflow: 'hidden',
                cursor: 'pointer'
              }}
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
            >
              <div style={{ marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0 }}>{doc.title}</Title>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <LockOutlined /> 私有
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        
                <Button type="text" title='删除' danger icon={<DeleteOutlined />}  onClick={(e) => {e.stopPropagation();showModal(doc.id);}}>
                </Button>
                  <Tooltip title="更多操作">
                   
                    <Button
                      type="text"
                      icon={<EllipsisOutlined />}
                      size="small"
                      style={{ marginLeft: 'auto' }}
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
                        // 这里可以添加更多操作的处理逻辑
                      }}
                    />
                  </Tooltip>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                <Avatar style={{ backgroundColor: '#87d068' }} size="small">
                  {doc.creator}
                </Avatar>
                <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>
                  由
                  {
                    doc.ownerId === userProfile.id ? '你' : doc.ownerName
                  }创建
                </span>
                <span style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>
                  {
                    doc.lastEdited ? '上次编辑于'+doc.lastEdited :
                    doc.lastCreated ? '创建于'+doc.lastCreated : 
                    doc.lastVisited ? '上次查看于'+doc.lastVisited : ""
                  }
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
            onClick={handleCreateNewDocument}
          >
            新建 AI
          </Button>

          {/* <Dropdown overlay={newDropdownMenu} trigger={['click']}>
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
          </Dropdown> */}
        </div>
        
        {/* 显示当前用户信息 */}
        {/* <UserProfileComponent/> */}
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

      {/* 增加分页信息 */}
      <Pagination
        total={totalDocuments}
        current={pageNo}
        pageSize={pageSize}
        showTotal={(total, range) => `第${range[0]}-${range[1]}条数据 , 共${total}条`}
        onChange={(page, pageSize) => {
          console.log('page', page, 'pagesize', pageSize);
          setPageNo(page);
          setPageSize(pageSize);
        }}
        align='end'
      />
     
      {/* //显示模式对话框 */}
      <Modal title="确认删除" open={isModalOpen} onOk={
        ()=>{
          handleDeleteFile(selectedDocId);
      }} 
      onCancel={()=>setIsModalOpen(false)}>
        <p>文件删除后无法恢复，确认删除此文件么？</p>
      </Modal>
    </div>
  );
};

export default MainPage;