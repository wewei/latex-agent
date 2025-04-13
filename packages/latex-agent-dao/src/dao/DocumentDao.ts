import BaseDao from './BaseDao';
import { Document } from '../models';
import { getDatabase } from '../db';
import crypto from 'crypto';

export default class DocumentDao extends BaseDao<Document> {
  constructor() {
    super('documents');
  }

  /**
   * 创建新文档
   * @param content 文档内容
   * @param fileId 关联的文件ID (可选)
   * @returns 创建的文档对象
   */
  async createDocument(content?: string): Promise<Document> {
    const db = getDatabase();
    
    // 计算内容的哈希值
    const hash = content ? crypto.createHash('md5').update(content).digest('hex') : undefined;
    const now = new Date().toISOString();
    
    // 创建新文档
    const result = await db.run(
      `INSERT INTO documents (content, version, hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [content || null, 1, hash, now, now]
    );
    
    return {
      id: result.lastID as number,
      content: content || null,
      version: 1,
      hash,
      created_at: now,
      updated_at: now
    };
  }

  /**
   * 更新现有文档
   * @param documentId 文档ID
   * @param content 新的文档内容
   * @returns 更新后的文档对象
   */
  async updateDocument(documentId: number, content: string): Promise<Document> {
    const db = getDatabase();
    
    // 获取现有文档
    const existingDoc = await this.findById(documentId);
    if (!existingDoc) {
      throw new Error(`Document with ID ${documentId} not found`);
    }
    
    // 计算内容的哈希值
    const hash = crypto.createHash('md5').update(content).digest('hex');
    
    // 如果内容没有变化，则不更新
    if (existingDoc.hash === hash) {
      return existingDoc;
    }
    
    const now = new Date().toISOString();
    const newVersion = existingDoc.version + 1;
    
    // 更新文档
    await db.run(
      `UPDATE documents 
       SET content = ?, version = ?, hash = ?, updated_at = ? 
       WHERE id = ?`,
      [content, newVersion, hash, now, documentId]
    );
    
    return {
      ...existingDoc,
      content,
      version: newVersion,
      hash,
      updated_at: now
    };
  }

  /**
   * 获取文档详情
   * @param documentId 文档ID
   * @returns 文档对象或undefined
   */
  async findById(documentId: number): Promise<Document | undefined> {
    const db = getDatabase();
    
    return db.get<Document>(
      `SELECT * FROM documents WHERE id = ?`,
      [documentId]
    );
  }

  /**
   * 获取文档内容
   * @param documentId 文档ID
   * @returns 文档内容，如果文档不存在则返回null
   */
  async getContent(documentId: number): Promise<string | null> {
    const db = getDatabase();
    
    const result = await db.get<{ content: string }>(
      `SELECT content FROM documents WHERE id = ?`,
      [documentId]
    );
    
    return result ? result.content : null;
  }

  /**
   * 获取文档内容与版本信息
   * @param documentId 文档ID
   * @returns 包含内容和版本信息的对象，文档不存在则返回null
   */
  async getContentWithVersion(documentId: number): Promise<{ content: string; version: number } | null> {
    const db = getDatabase();
    
    const result = await db.get<{ content: string; version: number }>(
      `SELECT content, version FROM documents WHERE id = ?`,
      [documentId]
    );
    
    return result || null;
  }

  /**
   * 删除文档
   * @param documentId 文档ID
   * @returns 是否成功删除
   */
  async deleteDocument(documentId: number): Promise<boolean> {
    const db = getDatabase();
    
    const result = await db.run(
      `DELETE FROM documents WHERE id = ?`,
      [documentId]
    );
    
    return (result.changes ?? 0) > 0;
  }
  
  /**
   * 搜索文档内容
   * @param searchTerm 搜索关键词
   * @param workspaceId 工作区ID (可选)
   * @returns 匹配的文档信息
   */
  async searchContent(searchTerm: string, workspaceId?: number): Promise<any[]> {
    const db = getDatabase();
    
    let query = `
      SELECT d.id, d.file_id, d.content, d.version, d.updated_at,
             f.name as file_name, f.path as file_path,
             f.workspace_id, w.name as workspace_name
      FROM documents d
      LEFT JOIN files f ON d.file_id = f.id
      LEFT JOIN workspaces w ON f.workspace_id = w.id
      WHERE d.content LIKE ?
    `;
    
    const params: any[] = [`%${searchTerm}%`];
    
    if (workspaceId) {
      query += ` AND (f.workspace_id = ? OR f.workspace_id IS NULL)`;
      params.push(workspaceId);
    }
    
    query += ` AND (f.is_deleted = 0 OR f.is_deleted IS NULL)`;
    
    return db.all(query, params);
  }
}