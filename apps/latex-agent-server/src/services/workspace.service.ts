import { workspaceDao, workspaceUserDao } from 'latex-agent-dao';
import { Workspace } from 'latex-agent-dao';

class WorkspaceService {
  /**
   * 获取用户的所有工作区
   */
  async getUserWorkspaces(userId: number): Promise<Workspace[]> {
    try {
      return await workspaceDao.findByUserId(userId);
    } catch (error) {
      console.error('Error in WorkspaceService.getUserWorkspaces:', error);
      throw error;
    }
  }
  
  /**
   * 通过ID获取工作区
   */
  async getWorkspaceById(id: number, userId: number): Promise<Workspace & { memberCount: number }> {
    try {
      const workspace = await workspaceDao.findById(id);
      
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      
      // 检查用户是否有权限访问工作区
      const hasAccess = await this.checkAccess(id, userId);
      
      if (!hasAccess) {
        throw new Error('Permission denied');
      }
      
      // 获取工作区成员数量
      const memberCount = await workspaceDao.getMemberCount(id);
      
      return {
        ...workspace,
        memberCount
      };
    } catch (error) {
      console.error('Error in WorkspaceService.getWorkspaceById:', error);
      throw error;
    }
  }
  
  /**
   * 创建工作区
   */
  async createWorkspace(
    data: { name: string; description?: string; visibility: 'public' | 'private' | 'team' },
    userId: number
  ): Promise<Workspace> {
    try {
      const { name, description, visibility = 'private' } = data;
      
      // 创建工作区
      const newWorkspace = await workspaceDao.create({
        name,
        description,
        visibility,
        owner_id: userId,
        is_deleted: false,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString()
      });
      
      // 添加创建者作为所有者
      await workspaceUserDao.addUser(newWorkspace.id, userId, 'owner');
      
      return newWorkspace;
    } catch (error) {
      console.error('Error in WorkspaceService.createWorkspace:', error);
      throw error;
    }
  }
  
  /**
   * 更新工作区
   */
  async updateWorkspace(
    id: number,
    data: { name?: string; description?: string; visibility: 'public' | 'private' | 'team'},
    userId: number
  ): Promise<Workspace | undefined> {
    try {
      const workspace = await workspaceDao.findById(id);
      
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      
      // 检查用户是否是所有者
      if (workspace.owner_id !== userId) {
        throw new Error('Permission denied');
      }
      
      return await workspaceDao.update(id, data);
    } catch (error) {
      console.error('Error in WorkspaceService.updateWorkspace:', error);
      throw error;
    }
  }
  
  /**
   * 删除工作区
   */
  async deleteWorkspace(id: number, userId: number): Promise<boolean> {
    try {
      const workspace = await workspaceDao.findById(id);
      
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      
      // 检查用户是否是所有者
      if (workspace.owner_id !== userId) {
        throw new Error('Permission denied');
      }
      
      // 软删除工作区
      return await workspaceDao.softDelete(id);
    } catch (error) {
      console.error('Error in WorkspaceService.deleteWorkspace:', error);
      throw error;
    }
  }
  
  /**
   * 获取工作区成员
   */
  async getWorkspaceMembers(id: number, userId: number): Promise<any[]> {
    try {
      const workspace = await workspaceDao.findById(id);
      
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      
      // 检查用户是否有权限访问工作区
      const hasAccess = await this.checkAccess(id, userId);
      
      if (!hasAccess) {
        throw new Error('Permission denied');
      }
      
      // 获取工作区成员
      return await workspaceUserDao.findByWorkspaceId(id);
    } catch (error) {
      console.error('Error in WorkspaceService.getWorkspaceMembers:', error);
      throw error;
    }
  }
  
  /**
   * 检查用户是否有权限访问工作区
   */
  async checkAccess(workspaceId: number, userId: number): Promise<boolean> {
    try {
      return await workspaceDao.checkUserAccess(workspaceId, userId);
    } catch (error) {
      console.error('Error in WorkspaceService.checkAccess:', error);
      throw error;
    }
  }
}

export default new WorkspaceService();