import { getDatabase } from '../db';

/**
 * 基础数据访问对象类
 * 提供通用的 CRUD 操作
 */
export default abstract class BaseDao<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * 根据 ID 查找记录
   */
  async findById(id: number): Promise<T | undefined> {
    try {
      const db = getDatabase();
      return await db.get<T>(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    } catch (error) {
      console.error(`Error in ${this.tableName}.findById:`, error);
      throw error;
    }
  }

  /**
   * 查找所有记录
   */
  async findAll(options: {
    where?: Record<string, any>,
    orderBy?: string,
    limit?: number,
    offset?: number
  } = {}): Promise<T[]> {
    try {
      const db = getDatabase();
      let query = `SELECT * FROM ${this.tableName}`;
      const params: any[] = [];

      // 添加WHERE条件
      if (options.where) {
        const whereClauses: string[] = [];
        Object.entries(options.where).forEach(([key, value]) => {
          whereClauses.push(`${key} = ?`);
          params.push(value);
        });
        
        if (whereClauses.length > 0) {
          query += ` WHERE ${whereClauses.join(' AND ')}`;
        }
      }

      // 添加排序
      if (options.orderBy) {
        query += ` ORDER BY ${options.orderBy}`;
      }

      // 添加分页
      if (options.limit) {
        query += ` LIMIT ?`;
        params.push(options.limit);
        
        if (options.offset) {
          query += ` OFFSET ?`;
          params.push(options.offset);
        }
      }

      return await db.all<T[]>(query, params);
    } catch (error) {
      console.error(`Error in ${this.tableName}.findAll:`, error);
      throw error;
    }
  }

  /**
   * 创建新记录
   */
  async create(data: Omit<T, 'id'>): Promise<T> {
    try {
      const db = getDatabase();
      const columns = Object.keys(data).join(', ');
      const placeholders = Array(Object.keys(data).length).fill('?').join(', ');
      const values = Object.values(data);

      const result = await db.run(
        `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
        values
      );

      return this.findById(result.lastID!) as Promise<T>;
    } catch (error) {
      console.error(`Error in ${this.tableName}.create:`, error);
      throw error;
    }
  }

  /**
   * 更新记录
   */
  async update(id: number, data: Partial<T>): Promise<T | undefined> {
    try {
      const db = getDatabase();
      const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), id];

      await db.run(
        `UPDATE ${this.tableName} SET ${updates} WHERE id = ?`,
        values
      );

      return this.findById(id);
    } catch (error) {
      console.error(`Error in ${this.tableName}.update:`, error);
      throw error;
    }
  }

  /**
   * 删除记录（物理删除）
   */
  async delete(id: number): Promise<boolean> {
    try {
      const db = getDatabase();
      const result = await db.run(
        `DELETE FROM ${this.tableName} WHERE id = ?`,
        [id]
      );
      return result.changes! > 0;
    } catch (error) {
      console.error(`Error in ${this.tableName}.delete:`, error);
      throw error;
    }
  }
  
  /**
   * 删除记录（软删除）
   */
  async softDelete(id: number): Promise<boolean> {
    try {
      const db = getDatabase();
      const result = await db.run(
        `UPDATE ${this.tableName} SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [id]
      );
      return result.changes! > 0;
    } catch (error) {
      console.error(`Error in ${this.tableName}.softDelete:`, error);
      throw error;
    }
  }
}