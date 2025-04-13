import BaseDao from './BaseDao';
import { User } from '../models';
import { getDatabase } from '../db';

export default class UserDao extends BaseDao<User> {
  constructor() {
    super('users');
  }

  /**
   * 通过用户名查找用户
   */
  async findByUsername(username: string): Promise<User | undefined> {
    try {
      const db = getDatabase();
      return await db.get<User>(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
    } catch (error) {
      console.error('Error in UserDao.findByUsername:', error);
      throw error;
    }
  }

  /**
   * 通过邮箱查找用户
   */
  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const db = getDatabase();
      return await db.get<User>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
    } catch (error) {
      console.error('Error in UserDao.findByEmail:', error);
      throw error;
    }
  }

  /**
   * 验证用户登录
   */
  async verifyLogin(username: string, passwordHash: string): Promise<User | undefined> {
    try {
      const db = getDatabase();
      return await db.get<User>(
        'SELECT * FROM users WHERE username = ? AND password_hash = ?',
        [username, passwordHash]
      );
    } catch (error) {
      console.error('Error in UserDao.verifyLogin:', error);
      throw error;
    }
  }
  
  /**
   * 更新用户密码
   */
  async updatePassword(userId: number, passwordHash: string): Promise<boolean> {
    try {
      const db = getDatabase();
      const result = await db.run(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [passwordHash, userId]
      );
      return result.changes! > 0;
    } catch (error) {
      console.error('Error in UserDao.updatePassword:', error);
      throw error;
    }
  }
}