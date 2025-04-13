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

  /**
   * 创建文件并关联文档
   * @param fileData 文件数据
   * @param documentId 关联的文档ID (可选)
   * @returns 创建的文件
   */
  async createWithDocument(fileData: Omit<File, 'id'>, documentId: number): Promise<File> {
    try {
      const db = getDatabase();
      
      // 准备文件数据
      const now = new Date().toISOString();
      const data = {
        ...fileData,
        document_id: documentId,
        created_at: fileData.created_at || now,
        updated_at: fileData.updated_at || now,
        is_deleted: fileData.is_deleted || false
      };
      
      // 插入文件记录
      const result = await db.run(
        `INSERT INTO files (
          name, parent_id, owner_id, document_id, 
          created_at, updated_at, is_deleted, workspace_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.name,
          data.parent_id, 
          data.owner_id, 
          data.document_id,
          data.created_at, 
          data.updated_at, 
          data.is_deleted ? 1 : 0, 
          data.workspace_id
        ]
      );
      
      // 返回创建的文件，包括生成的ID
      return {
        ...data,
        id: result.lastID as number
      };
    } catch (error) {
      console.error('Error in FileDao.createWithDocument:', error);
      throw error;
    }
  }
}