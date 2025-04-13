import UserDao from './dao/UserDao';
import WorkspaceDao from './dao/WorkspaceDao';
import FileDao from './dao/FileDao';
import WorkspaceUserDao from './dao/WorkspaceUserDao';
import DocumentDao from './dao/DocumentDao';
import RecentVisitDao from './dao/RecentVisitDao';

// 单例实例
const userDao = new UserDao();
const workspaceDao = new WorkspaceDao();
const fileDao = new FileDao();
const workspaceUserDao = new WorkspaceUserDao();
const recentVisitDao = new RecentVisitDao();
const documentDao = new DocumentDao();

// 命名导出
export {
  userDao,
  workspaceDao,
  fileDao,
  workspaceUserDao,
  recentVisitDao,
  documentDao
};

// 类导出
export {
  UserDao,
  WorkspaceDao,
  FileDao,
  WorkspaceUserDao,
  RecentVisitDao,
  DocumentDao
};

// 默认导出
export default {
  user: userDao,
  workspace: workspaceDao,
  file: fileDao,
  workspaceUser: workspaceUserDao,
  recentVisit: recentVisitDao,
  document: documentDao
};

// 导出模型接口
export * from './models';

export * from './db';