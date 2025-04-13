import { workspaceDao, workspaceUserDao, userDao } from 'latex-agent-dao';

class WorkspaceUserService {
  /**
   * 添加用户到工作区
   */
  async addUserToWorkspace(workspaceId: number, userId: number, role: string, currentUserId: number): Promise<any> {
    try {
      const workspace = await workspaceDao.findById(workspaceId);
      
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      
      // 只有工作区所有者可以添加用户
      if (workspace.owner_id !== currentUserId) {
        throw new Error('Permission denied');
      }
      
      // 检查用户是否存在
      const userExists = await userDao.findById(userId);
      
      if (!userExists) {
        throw new Error('User not found');
      }
      
      // 检查用户是否已在工作区
      const userRole = await workspaceUserDao.findUserRole(workspaceId, userId);
      
      if (userRole) {
        throw new Error('User is already a member of this workspace');
      }
      
      // 添加用户到工作区
      const success = await workspaceUserDao.addUser(workspaceId, userId, role);
      
      return {
        workspaceId,
        userId,
        role,
        success
      };
    } catch (error) {
      console.error('Error in WorkspaceUserService.addUserToWorkspace:', error);
      throw error;
    }
  }
  
  /**
   * 更新工作区中用户的角色
   */
  async updateUserRole(workspaceId: number, userIdToUpdate: number, role: string, currentUserId: number): Promise<any> {
    try {
      const workspace = await workspaceDao.findById(workspaceId);
      
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      
      // 只有工作区所有者可以更新角色
      if (workspace.owner_id !== currentUserId) {
        throw new Error('Permission denied');
      }
      
      // 检查用户是否在工作区
      const userRole = await workspaceUserDao.findUserRole(workspaceId, userIdToUpdate);
      
      if (!userRole) {
        throw new Error('User is not a member of this workspace');
      }
      
      // 更新用户角色
      const success = await workspaceUserDao.updateUserRole(workspaceId, userIdToUpdate, role);
      
      return {
        workspaceId,
        userId: userIdToUpdate,
        role,
        success
      };
    } catch (error) {
      console.error('Error in WorkspaceUserService.updateUserRole:', error);
      throw error;
    }
  }
  
  /**
   * 从工作区移除用户
   */
  async removeUserFromWorkspace(workspaceId: number, userIdToRemove: number, currentUserId: number): Promise<any> {
    try {
      const workspace = await workspaceDao.findById(workspaceId);
      
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      
      // 检查是否是工作区所有者或自己删除自己
      const isSelfRemoval = currentUserId === userIdToRemove;
      const isOwner = workspace.owner_id === currentUserId;
      
      if (!isSelfRemoval && !isOwner) {
        throw new Error('Permission denied');
      }
      
      // 工作区所有者不能被移除
      if (workspace.owner_id === userIdToRemove) {
        throw new Error('The workspace owner cannot be removed');
      }
      
      // 检查用户是否在工作区
      const userRole = await workspaceUserDao.findUserRole(workspaceId, userIdToRemove);
      
      if (!userRole) {
        throw new Error('User is not a member of this workspace');
      }
      
      // 从工作区移除用户
      const success = await workspaceUserDao.removeUser(workspaceId, userIdToRemove);
      
      return {
        workspaceId,
        userId: userIdToRemove,
        success
      };
    } catch (error) {
      console.error('Error in WorkspaceUserService.removeUserFromWorkspace:', error);
      throw error;
    }
  }
  
  /**
   * 转移工作区所有权
   */
  async transferOwnership(workspaceId: number, newOwnerId: number, currentUserId: number): Promise<any> {
    try {
      const workspace = await workspaceDao.findById(workspaceId);
      
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      
      // 只有当前所有者可以转移所有权
      if (workspace.owner_id !== currentUserId) {
        throw new Error('Permission denied');
      }
      
      // 检查新所有者是否存在
      const newOwner = await userDao.findById(newOwnerId);
      
      if (!newOwner) {
        throw new Error('New owner not found');
      }
      
      // 检查新所有者是否已在工作区
      const userRole = await workspaceUserDao.findUserRole(workspaceId, newOwnerId);
      
      if (!userRole) {
        throw new Error('New owner must be a member of the workspace');
      }
      
      // 更新工作区所有者
      await workspaceDao.update(workspaceId, { owner_id: newOwnerId });
      
      // 确保新所有者有 owner 角色
      await workspaceUserDao.updateUserRole(workspaceId, newOwnerId, 'owner');
      
      // 将当前所有者角色更改为编辑者
      if (currentUserId !== newOwnerId) {
        await workspaceUserDao.updateUserRole(workspaceId, currentUserId, 'editor');
      }
      
      return {
        workspaceId,
        newOwnerId,
        previousOwnerId: workspace.owner_id,
        success: true
      };
    } catch (error) {
      console.error('Error in WorkspaceUserService.transferOwnership:', error);
      throw error;
    }
  }
}

export default new WorkspaceUserService();