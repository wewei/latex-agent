import { documentDao, fileDao, Document, recentVisitDao } from 'latex-agent-dao';

class DocumentService {
  /**
   * 创建新文档
   * @param content 文档内容
   * @param fileId 关联的文件ID (可选)
   * @param userId 用户ID
   */
  async createDocument(content?: string): Promise<Document> {    
    // 创建文档
    const document = await documentDao.createDocument(content);
    if (!document) {
      throw new Error('Failed to create document');
    }
    return document;
  }
  
  /**
   * 更新文档内容
   * @param documentId 文档ID
   * @param content 新的文档内容
   */
  async updateDocument(documentId: number, content: string): Promise<Document> {
    // 获取文档
    const document = await documentDao.findById(documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // 更新文档
    return documentDao.updateDocument(documentId, content);
  }
  
  /**
   * 获取文档内容
   * @param documentId 文档ID
   */
  async getDocument(documentId: number, userId?:number): Promise<Document | { content: string, version: number }> {
    const document = await documentDao.findById(documentId);
 
    if (!document) {
      return { content: '', version: 0 };
    }      
    if(userId != undefined){        
      //保存用户最近访问记录
      //？这里记录的是documentID, 而不是fileID, 再确认
      const result = await recentVisitDao.recordVisit(userId, documentId);
      console.log('result',result);
      if (!result) {
        console.error('Failed to record visit');
      }
    }
    return document;
  }
  
  /**
   * 删除文档
   * @param documentId 文档ID
   * @param userId 用户ID
   */
  async deleteDocument(documentId: number): Promise<boolean> {
    // 验证文档是否存在
    const document = await documentDao.findById(documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // 删除文档
    return documentDao.deleteDocument(documentId);
  }
  
  /**
   * 搜索文档内容
   * @param searchTerm 搜索关键词
   * @param workspaceId 工作区ID (可选)
   */
  async searchDocuments(searchTerm: string, workspaceId?: number): Promise<any[]> {
    return documentDao.searchContent(searchTerm, workspaceId);
  }
}

export default new DocumentService();