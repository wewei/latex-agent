import BaseDao from './BaseDao';
import { Workspace } from '../models';
import { getDatabase } from '../db';

export default class WorkspaceDao extends BaseDao<Workspace> {
  constructor() {
    super('workspaces');
  }

  /**
   * 获取用户的所有工作区
   */
  async findByUserId(userId: number): Promise<Workspace[]> {
    try {
      const db = getDatabase();
      return await db.all<Workspace[]>(
        `SELECT w.* FROM workspaces w 
         LEFT JOIN workspace_users wu ON w.id = wu.workspace_id 
         WHERE (w.owner_id = ? OR wu.user_id = ?) 
         AND w.is_deleted = 0`,
        [userId, userId]
      );
    } catch (error) {
      console.error('Error in WorkspaceDao.findByUserId:', error);
      throw error;
    }
  }

  /**
   * 检查用户是否有权限访问工作区
   */
  async checkUserAccess(workspaceId: number, userId: number): Promise<boolean> {
    try {
      const db = getDatabase();
      const result = await db.get(
        `SELECT 1 FROM workspaces w 
         LEFT JOIN workspace_users wu ON w.id = wu.workspace_id 
         WHERE w.id = ? AND (w.owner_id = ? OR wu.user_id = ?) 
         AND w.is_deleted = 0`,
        [workspaceId, userId, userId]
      );
      return !!result;
    } catch (error) {
      console.error('Error in WorkspaceDao.checkUserAccess:', error);
      throw error;
    }
  }
  
  /**
   * 获取工作区的成员数量
   */
  async getMemberCount(workspaceId: number): Promise<number> {
    try {
      const db = getDatabase();
      const result = await db.get<{ count: number }>(
        `SELECT COUNT(DISTINCT user_id) as count FROM workspace_users WHERE workspace_id = ?`,
        [workspaceId]
      );
      return result?.count || 0;
    } catch (error) {
      console.error('Error in WorkspaceDao.getMemberCount:', error);
      throw error;
    }
  }
}