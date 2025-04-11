import UserDao from './UserDao';
import WorkspaceDao from './WorkspaceDao';
import FileDao from './FileDao';
import WorkspaceUserDao from './WorkspaceUserDao';

// 单例实例
const userDao = new UserDao();
const workspaceDao = new WorkspaceDao();
const fileDao = new FileDao();
const workspaceUserDao = new WorkspaceUserDao();

export {
  userDao,
  workspaceDao,
  fileDao,
  workspaceUserDao
};

// 类导出，允许创建新实例
export {
  UserDao,
  WorkspaceDao,
  FileDao,
  WorkspaceUserDao
};

// 默认导出单例对象
export default {
  user: userDao,
  workspace: workspaceDao,
  file: fileDao,
  workspaceUser: workspaceUserDao
};