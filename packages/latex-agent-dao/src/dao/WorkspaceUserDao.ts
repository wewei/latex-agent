import { WorkspaceUser } from '../models';
import { getDatabase } from '../db';

export default class WorkspaceUserDao {
  /**
   * 获取工作区的所有用户
   */
  async findByWorkspaceId(workspaceId: number): Promise<WorkspaceUser[]> {
    try {
      const db = getDatabase();
      return await db.all<WorkspaceUser[]>(
        'SELECT * FROM workspace_users WHERE workspace_id = ?',
        [workspaceId]
      );
    } catch (error) {
      console.error('Error in WorkspaceUserDao.findByWorkspaceId:', error);
      throw error;
    }
  }

  /**
   * 获取用户的工作区权限
   */
  async findUserRole(workspaceId: number, userId: number): Promise<string | null> {
    try {
      const db = getDatabase();
      const result = await db.get<{ role: string }>(
        'SELECT role FROM workspace_users WHERE workspace_id = ? AND user_id = ?',
        [workspaceId, userId]
      );
      return result ? result.role : null;
    } catch (error) {
      console.error('Error in WorkspaceUserDao.findUserRole:', error);
      throw error;
    }
  }

  /**
   * 添加用户到工作区
   */
  async addUser(workspaceId: number, userId: number, role: string = 'viewer'): Promise<boolean> {
    try {
      const db = getDatabase();
      const result = await db.run(
        'INSERT INTO workspace_users (workspace_id, user_id, role) VALUES (?, ?, ?)',
        [workspaceId, userId, role]
      );
      return result.changes! > 0;
    } catch (error) {
      console.error('Error in WorkspaceUserDao.addUser:', error);
      throw error;
    }
  }

  /**
   * 更新用户在工作区的权限
   */
  async updateUserRole(workspaceId: number, userId: number, role: string): Promise<boolean> {
    try {
      const db = getDatabase();
      const result = await db.run(
        'UPDATE workspace_users SET role = ? WHERE workspace_id = ? AND user_id = ?',
        [role, workspaceId, userId]
      );
      return result.changes! > 0;
    } catch (error) {
      console.error('Error in WorkspaceUserDao.updateUserRole:', error);
      throw error;
    }
  }

  /**
   * 从工作区移除用户
   */
  async removeUser(workspaceId: number, userId: number): Promise<boolean> {
    try {
      const db = getDatabase();
      const result = await db.run(
        'DELETE FROM workspace_users WHERE workspace_id = ? AND user_id = ?',
        [workspaceId, userId]
      );
      return result.changes! > 0;
    } catch (error) {
      console.error('Error in WorkspaceUserDao.removeUser:', error);
      throw error;
    }
  }
}