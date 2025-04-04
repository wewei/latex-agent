import React from 'react';
import { DetailPanelRp } from './DetailPanelRp';

export const DetailPanelCt: React.FC = () => {
  // 这里将来会根据路由参数获取详细信息
  const mockDetail = {
    title: '论文初稿',
    content: '这是一个示例文档内容...',
    lastModified: new Date().toISOString(),
  };

  return <DetailPanelRp detail={mockDetail} />;
}; 