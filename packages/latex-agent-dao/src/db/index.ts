import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

const DB_PATH = process.env.DB_PATH || 'latex-agent.db';
let db: Database | null = null;

// 初始化数据库表
export const initializeDatabase = async (): Promise<Database> => {
  try {
    console.info('正在初始化数据库... path =', DB_PATH);
    // 打开数据库连接
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });
    
    console.info('已连接到 SQLite 数据库');
    
    // 初始化表结构
    await initializeTables();
    
    return db;
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
}

/**
 * 初始化数据库表结构
 */
const initializeTables = async (): Promise<void> => {
  if (!db) throw new Error('数据库未初始化');
  
  console.info('正在初始化数据库表...');
  
  try {
    // 启用外键约束
    await db.exec('PRAGMA foreign_keys = ON');
    
    // 用户表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        default_workspace_id INTEGER,
        is_admin BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 工作区表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        visibility TEXT DEFAULT 'private',
        owner_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT 0,
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);
    
    // 文件表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        parent_id INTEGER,
        owner_id INTEGER NOT NULL,
        document_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT 0,
        workspace_id INTEGER NOT NULL,
        FOREIGN KEY (parent_id) REFERENCES files (id),
        FOREIGN KEY (owner_id) REFERENCES users (id),
        FOREIGN KEY (workspace_id) REFERENCES workspaces (id),
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE SET NULL
      )
    `);
    
    // 为 document_id 添加索引以提高查询性能
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_files_document_id
      ON files (document_id)
    `);
    
    // 工作区用户关系表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS workspace_users (
        workspace_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        role TEXT NOT NULL DEFAULT 'viewer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (workspace_id, user_id),
        FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);
    
    // 最近访问记录表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS recent_visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        file_id INTEGER NOT NULL,
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE
      )
    `);
    
    // 文档内容表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        version INTEGER DEFAULT 1,
        hash TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 创建索引提高查询性能
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_recent_visits_user_time
      ON recent_visits (user_id, visited_at DESC)
    `);
    
    console.info('数据库表初始化完成');
  } catch (err) {
    console.error('初始化数据库表出错:', err);
    throw err;
  }
};

/**
 * 关闭数据库连接
 */
export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.close();
    console.info('数据库连接已关闭');
  }
};

/**
 * 获取数据库实例
 */
export const getDatabase = (): Database => {
  if (!db) {
    throw new Error('数据库未初始化');
  }
  return db;
};

// 导出默认对象，包含所有数据库功能
export default {
  initializeDatabase,
  closeDatabase,
  getDatabase
};