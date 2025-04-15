import { recentVisitDao } from 'latex-agent-dao';

class RecentVisitService {
  /**
   * 记录用户访问文件
   * @param userId 用户ID
   * @param fileId 文件ID
   */
  async recordVisit(userId: number, fileId: number): Promise<any> {    
    // 记录访问
    const visit = await recentVisitDao.recordVisit(userId, fileId);
    if (!visit) {
      throw new Error('Failed to record visit');
    }
    return visit;
  }
  
  /**
   * 获取用户最近访问的文件
   * @param userId 用户ID
   * @param workspaceId 工作空间ID
   * @param limit 返回数量限制
   */
  async getUserRecentVisits(userId: number, workspaceId: number,  limit: number = 20): Promise<any[]> {
    return recentVisitDao.getUserRecentVisits(userId, workspaceId, limit);
  }
  
  /**
   * 清除用户的访问记录
   * @param userId 用户ID
   */
  async clearUserVisits(userId: number): Promise<boolean> {
    return recentVisitDao.clearUserVisits(userId);
  }
  
  /**
   * 清除特定文件的访问记录
   * @param fileId 文件ID
   */
  async clearFileVisits(fileId: number): Promise<boolean> {
    return recentVisitDao.clearFileVisits(fileId);
  }
}

export default new RecentVisitService(); 