# 渲染进程 (Renderer Process)

渲染进程负责应用的用户界面，使用 React 技术栈构建。

## 主要职责

- 用户界面渲染
- 用户交互处理
- 状态管理
- 与主进程通信

## 技术栈

- React
- Material-UI
- styled-components
- TypeScript

## 开发规范

- 使用函数式组件
- 采用 Container/Presentational 模式
- 使用 styled-components 进行样式定义
- 保持组件的纯函数性质

## 目录结构

- `components/` - 可复用组件
- `pages/` - 页面级组件
- `hooks/` - 自定义 React Hooks
- `utils/` - 工具函数
- `types/` - TypeScript 类型定义 