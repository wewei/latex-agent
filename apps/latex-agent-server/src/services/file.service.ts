import { fileDao, documentDao } from 'latex-agent-dao';
import { File, Document } from 'latex-agent-dao';
import workspaceService from './workspace.service';

class FileService {
  /**
   * 获取工作区下的所有文件
   */
  async getFilesByWorkspace(workspaceId: number, userId: number): Promise<File[]> {
    try {
      // TODO:检查用户是否有权限访问工作区
      // const hasAccess = await workspaceService.checkAccess(workspaceId, userId);
      
      // if (!hasAccess) {
      //   throw new Error('Permission denied');
      // }
      
      return await fileDao.findByWorkspaceId(workspaceId);
    } catch (error) {
      console.error('Error in FileService.getFilesByWorkspace:', error);
      throw error;
    }
  }
  
  /**
   * 获取目录下的文件
   */
  async getFilesByParent(workspaceId: number, parentId: number | null, userId: number): Promise<File[]> {
    try {
      // 检查用户是否有权限访问工作区
      const hasAccess = await workspaceService.checkAccess(workspaceId, userId);
      
      if (!hasAccess) {
        throw new Error('Permission denied');
      }
      
      return await fileDao.findByParentId(parentId, workspaceId);
    } catch (error) {
      console.error('Error in FileService.getFilesByParent:', error);
      throw error;
    }
  }
  
   /**
   * 获取工作区下指定用户创建的所有文件
   */
   async getFilesByWorkspaceAndUser(workspaceId: number, userId: number): Promise<File[]> {
    try {
      // 检查用户是否有权限访问工作区
      const hasAccess = await workspaceService.checkAccess(workspaceId, userId);
      
      if (!hasAccess) {
        throw new Error('Permission denied');
      }
      
      return await fileDao.findByWorkspaceIdAndUserId(workspaceId, userId);
    } catch (error) {
      console.error('Error in FileService.getFilesByWorkspaceAndUser:', error);
      throw error;
    }
  }
  
  /**
   * 通过ID获取文件
   */
  async getFileById(id: number, userId: number): Promise<File | undefined> {
    try {
      const file = await fileDao.findById(id);
      
      if (!file) {
        throw new Error('File not found');
      }
      
      // 检查用户是否有权限访问工作区
      const hasAccess = await workspaceService.checkAccess(file.workspace_id, userId);
      
      if (!hasAccess) {
        throw new Error('Permission denied');
      }
      
      return file;
    } catch (error) {
      console.error('Error in FileService.getFileById:', error);
      throw error;
    }
  }
  
  /**
   * 创建文件
   */
  async createFile(fileData: Omit<File, 'id' | 'is_deleted'>, userId: number): Promise<File> {
    try {
      // 检查用户是否有权限访问工作区
      const hasAccess = await workspaceService.checkAccess(fileData.workspace_id, userId);
      
      if (!hasAccess) {
        throw new Error('Permission denied');
      }
      
      // 创建文件
      return await fileDao.create({
        ...fileData,
        owner_id: userId,
        is_deleted: false
      });
    } catch (error) {
      console.error('Error in FileService.createFile:', error);
      throw error;
    }
  }
  
  /**
   * 创建文件并关联文档
   * @param fileData 文件数据
   * @param content 文档内容 (可选)
   * @returns 创建的文件和文档
   */
  async createFileWithDocument(
    fileData: Omit<File, 'id'>, 
    content?: string
  ): Promise<File> {
    // 如果提供了内容，先创建文档
    const document = await documentDao.createDocument(content);
    
    // 创建文件并关联文档    
    return await fileDao.createWithDocument(fileData, document?.id);
  }
  
  /**
   * 更新文件
   */
  async updateFile(id: number, fileData: Partial<File>, userId: number): Promise<File | undefined> {
    try {
      const file = await fileDao.findById(id);
      
      if (!file) {
        throw new Error('File not found');
      }
      
      // 检查用户是否有权限访问工作区
      const hasAccess = await workspaceService.checkAccess(file.workspace_id, userId);
      
      if (!hasAccess) {
        throw new Error('Permission denied');
      }
      
      // 更新文件
      return await fileDao.update(id, fileData);
    } catch (error) {
      console.error('Error in FileService.updateFile:', error);
      throw error;
    }
  }
  
  /**
   * 删除文件
   */
  async deleteFile(id: number, userId: number): Promise<boolean> {
    try {
      const file = await fileDao.findById(id);
      
      if (!file) {
        throw new Error('File not found');
      }
      
      // 检查用户是否有权限访问工作区
      const hasAccess = await workspaceService.checkAccess(file.workspace_id, userId);
      
      if (!hasAccess) {
        throw new Error('Permission denied');
      }
      
      // 软删除文件
      return await fileDao.softDelete(id);
    } catch (error) {
      console.error('Error in FileService.deleteFile:', error);
      throw error;
    }
  }
  
  /**
   * 移动文件
   */
  async moveFile(id: number, parentId: number | null, userId: number): Promise<File | undefined> {
    try {
      const file = await fileDao.findById(id);
      
      if (!file) {
        throw new Error('File not found');
      }
      
      // 检查用户是否有权限访问工作区
      const hasAccess = await workspaceService.checkAccess(file.workspace_id, userId);
      
      if (!hasAccess) {
        throw new Error('Permission denied');
      }
      
      // 移动文件
      await fileDao.moveFile(id, parentId);
      
      // 获取更新后的文件
      return await fileDao.findById(id);
    } catch (error) {
      console.error('Error in FileService.moveFile:', error);
      throw error;
    }
  }
  }

export default new FileService();