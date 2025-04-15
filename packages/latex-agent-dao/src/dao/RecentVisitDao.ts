import BaseDao from './BaseDao';
import { RecentVisit } from '../models';
import { getDatabase } from '../db';

export default class RecentVisitDao extends BaseDao<RecentVisit> {
  constructor() {
    super('recent_visits');
  }

  /**
   * 记录用户访问
   * @param userId 用户ID
   * @param fileId 文件ID
   * @returns 访问记录
   */
  async recordVisit(userId: number, fileId: number): Promise<RecentVisit> {
    const db = getDatabase();
    
    // 检查是否已有访问记录
    const existingVisit = await db.get<RecentVisit>(
      `SELECT * FROM recent_visits 
       WHERE user_id = ? AND file_id = ?`, 
      [userId, fileId]
    );
    
    if (existingVisit) {
      // 如果已有记录，更新访问时间
      await db.run(
        `UPDATE recent_visits 
         SET visited_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [existingVisit.id]
      );
      
      return {
        ...existingVisit,
        visited_at: new Date().toISOString()
      };
    } else {
      // 如果没有记录，创建新记录
      const result = await db.run(
        `INSERT INTO recent_visits (user_id, file_id, visited_at)
         VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [userId, fileId]
      );
      
      return {
        id: result.lastID as number,
        user_id: userId,
        file_id: fileId,
        visited_at: new Date().toISOString()
      };
    }
  }

  /**
   * 获取用户最近访问
   * @param userId 用户ID
   * @param workspaceId 工作空间ID
   * @param limit 返回数量限制
   * @returns 最近访问记录列表，包含文件基本信息
   */
  async getUserRecentVisits(userId: number, workspaceId: number, limit: number = 20): Promise<any[]> {
    const db = getDatabase();

    return db.all(`
         SELECT rv.user_id, rv.file_id as document_id, rv.visited_at, f.*, u.username as owner_name
      FROM recent_visits rv
      JOIN documents d ON rv.file_id = d.id
      JOIN files f ON f.document_id = d.id
      JOIN users u ON f.owner_id = u.id
      WHERE rv.user_id = ? AND f.is_deleted = 0 AND f.workspace_id = ?
      ORDER BY rv.visited_at DESC
      LIMIT ?
    `, [userId, workspaceId, limit]);
  }
  
  /**
   * 清除用户的访问记录
   * @param userId 用户ID
   * @returns 是否成功清除
   */
  async clearUserVisits(userId: number): Promise<boolean> {
    const db = getDatabase();
    
    const result = await db.run(
      `DELETE FROM recent_visits WHERE user_id = ?`,
      [userId]
    );
    
    return (result.changes ?? 0) > 0;
  }
  
  /**
   * 清除特定文件的访问记录
   * @param fileId 文件ID
   * @returns 是否成功清除
   */
  async clearFileVisits(fileId: number): Promise<boolean> {
    const db = getDatabase();
    
    const result = await db.run(
      `DELETE FROM recent_visits WHERE file_id = ?`,
      [fileId]
    );
    
    return (result.changes ?? 0) > 0;
  }
}