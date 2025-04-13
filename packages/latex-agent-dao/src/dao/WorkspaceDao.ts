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

  /**
   * 创建工作区
   * @param workspaceData 工作区数据
   * @param trx 事务对象（可选）
   * @returns 创建的工作区
   */
  async createWorkspace(workspaceData: Omit<Workspace, 'id'>, trx?: any): Promise<Workspace> {
    try {
      const db = trx || getDatabase();
      
      // 确保包含必要的默认值
      const workspace = {
        ...workspaceData,
        created_at: workspaceData.created_at || new Date().toISOString(),
        updated_at: workspaceData.updated_at || new Date().toISOString(),
        is_deleted: 0
      };
      
      const result = await db.run(
        `INSERT INTO workspaces (
          name, description, owner_id, created_at, updated_at, is_deleted
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          workspace.name,
          workspace.description,
          workspace.owner_id,
          workspace.created_at,
          workspace.updated_at,
          workspace.is_deleted
        ]
      );
      
      // 获取新创建的工作区ID
      const workspaceId = result.lastID;
      
      // 返回创建的工作区
      return {
        id: workspaceId,
        ...workspace,
        is_deleted: Boolean(workspace.is_deleted)
      } as Workspace;
    } catch (error) {
      console.error('Error in WorkspaceDao.createWorkspace:', error);
      throw error;
    }
  }

  /**
   * 删除工作区（软删除）
   * @param workspaceId 工作区ID
   * @param trx 事务对象（可选）
   * @returns 是否成功删除
   */
  async deleteWorkspace(workspaceId: number, trx?: any): Promise<boolean> {
    try {
      const db = trx || getDatabase();
      
      // 软删除 - 将 is_deleted 设置为 1
      const result = await db.run(
        `UPDATE workspaces SET is_deleted = 1, updated_at = ? WHERE id = ?`,
        [new Date().toISOString(), workspaceId]
      );
      
      return result.changes > 0;
    } catch (error) {
      console.error('Error in WorkspaceDao.deleteWorkspace:', error);
      throw error;
    }
  }

  /**
   * 更新工作区
   * @param workspaceId 工作区ID
   * @param workspaceData 更新的工作区数据
   * @param trx 事务对象（可选）
   * @returns 更新后的工作区
   */
  async updateWorkspace(workspaceId: number, workspaceData: Partial<Workspace>, trx?: any): Promise<Workspace> {
    try {
      const db = trx || getDatabase();
      
      // 获取现有工作区信息
      const existingWorkspace = await db.get(
        `SELECT * FROM workspaces WHERE id = ? AND is_deleted = 0`,
        [workspaceId]
      ) as Workspace;
      
      if (!existingWorkspace) {
        throw new Error(`Workspace with id ${workspaceId} not found`);
      }
      
      // 合并现有数据和更新数据
      const updatedWorkspace = {
        ...existingWorkspace,
        ...workspaceData,
        updated_at: new Date().toISOString()
      };
      
      // 执行更新
      await db.run(
        `UPDATE workspaces SET 
          name = ?, 
          description = ?, 
          owner_id = ?,
          updated_at = ?
         WHERE id = ?`,
        [
          updatedWorkspace.name,
          updatedWorkspace.description,
          updatedWorkspace.owner_id,
          updatedWorkspace.updated_at,
          workspaceId
        ]
      );
      
      return updatedWorkspace;
    } catch (error) {
      console.error('Error in WorkspaceDao.updateWorkspace:', error);
      throw error;
    }
  }
}