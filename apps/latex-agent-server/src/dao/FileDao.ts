import BaseDao from './BaseDao';
import { File } from '../models';
import { getDatabase } from '../db';

export default class FileDao extends BaseDao<File> {
  constructor() {
    super('files');
  }

  /**
   * 获取工作区下的所有文件
   */
  async findByWorkspaceId(workspaceId: number): Promise<File[]> {
    try {
      const db = getDatabase();
      return await db.all<File[]>(
        'SELECT * FROM files WHERE workspace_id = ? AND is_deleted = 0',
        [workspaceId]
      );
    } catch (error) {
      console.error('Error in FileDao.findByWorkspaceId:', error);
      throw error;
    }
  }

  /**
   * 获取指定目录下的文件
   */
  async findByParentId(parentId: number | null, workspaceId: number): Promise<File[]> {
    try {
      const db = getDatabase();
      let query: string;
      let params: any[];
      
      if (parentId === null) {
        query = 'SELECT * FROM files WHERE parent_id IS NULL AND workspace_id = ? AND is_deleted = 0';
        params = [workspaceId];
      } else {
        query = 'SELECT * FROM files WHERE parent_id = ? AND workspace_id = ? AND is_deleted = 0';
        params = [parentId, workspaceId];
      }
      
      return await db.all<File[]>(query, params);
    } catch (error) {
      console.error('Error in FileDao.findByParentId:', error);
      throw error;
    }
  }
  
  /**
   * 根据路径查找文件
   */
  async findByPath(path: string, workspaceId: number): Promise<File | undefined> {
    try {
      const db = getDatabase();
      return await db.get<File>(
        'SELECT * FROM files WHERE path = ? AND workspace_id = ? AND is_deleted = 0',
        [path, workspaceId]
      );
    } catch (error) {
      console.error('Error in FileDao.findByPath:', error);
      throw error;
    }
  }
  
  /**
   * 移动文件到新位置
   */
  async moveFile(fileId: number, newParentId: number | null): Promise<boolean> {
    try {
      const db = getDatabase();
      const result = await db.run(
        'UPDATE files SET parent_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newParentId, fileId]
      );
      return result.changes! > 0;
    } catch (error) {
      console.error('Error in FileDao.moveFile:', error);
      throw error;
    }
  }
}