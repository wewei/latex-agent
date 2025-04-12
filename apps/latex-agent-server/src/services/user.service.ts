import { userDao, workspaceDao } from '../dao';
import { User } from '../models';

class UserService {
  /**
   * 获取所有用户
   */
  async getAllUsers(): Promise<User[]> {
    try {
      return await userDao.findAll();
    } catch (error) {
      console.error('Error in UserService.getAllUsers:', error);
      throw error;
    }
  }
  
  /**
   * 通过ID获取用户
   */
  async getUserById(id: number): Promise<User | undefined> {
    try {
      const user = await userDao.findById(id);
      return user;
    } catch (error) {
      console.error('Error in UserService.getUserById:', error);
      throw error;
    }
  }
  
  /**
   * 创建用户
   */
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const existingUser = await userDao.findByUsername(userData.username);
      
      if (existingUser) {
        throw new Error('Username already exists');
      }
      
      const existingEmail = await userDao.findByEmail(userData.email);
      if (existingEmail) {
        throw new Error('Email already exists');
      }

      // 创建用户
      const user = await userDao.create(userData);
      
      // 创建默认工作区
      const workspace = await workspaceDao.createWorkspace({
        name: userData.username + "'s Workspace",
        description: 'Default workspace',
        owner_id: user.id,
        visibility: 'private',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_deleted: false
      });

      
      // 返回更新后的用户对象
      const updatedUser = await userDao.update(user.id, { 
        default_workspace_id: workspace.id 
      });
      
      if (!updatedUser) {
        throw new Error('Failed to update user with default workspace ID');
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Error in UserService.createUser:', error);
      throw error;
    }
  }
  
  /**
   * 更新用户
   */
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    try {
      const user = await userDao.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      
      // 验证用户名唯一性
      if (userData.username && userData.username !== user.username) {
        const existingUser = await userDao.findByUsername(userData.username);
        if (existingUser) {
          throw new Error('Username already exists');
        }
      }
      
      // 验证邮箱唯一性
      if (userData.email && userData.email !== user.email) {
        const existingEmail = await userDao.findByEmail(userData.email);
        if (existingEmail) {
          throw new Error('Email already exists');
        }
      }
      
      return await userDao.update(id, userData);
    } catch (error) {
      console.error('Error in UserService.updateUser:', error);
      throw error;
    }
  }
  
  /**
   * 删除用户
   */
  async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await userDao.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      
      return await userDao.delete(id);
    } catch (error) {
      console.error('Error in UserService.deleteUser:', error);
      throw error;
    }
  }
  
  /**
   * 更新用户密码
   */
  async updatePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await userDao.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      
      // 验证当前密码是否正确
      if (user.password_hash !== currentPassword) {
        throw new Error('Current password is incorrect');
      }
      
      return await userDao.updatePassword(id, newPassword);
    } catch (error) {
      console.error('Error in UserService.updatePassword:', error);
      throw error;
    }
  }
}

export default new UserService();