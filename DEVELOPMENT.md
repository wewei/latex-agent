# 开发指南

## 环境要求

- Node.js >= 18
- pnpm >= 8
- Git

## 开发环境配置

1. 克隆项目：
```bash
git clone [repository-url]
cd latex-agent
```

2. 安装依赖：
```bash
pnpm install
```

## 开发命令

- `pnpm dev` - 启动开发环境
- `pnpm build` - 构建生产版本
- `pnpm lint` - 运行代码检查
- `pnpm test` - 运行测试

## 项目架构

### 整体项目结构
```
src/
├── main/          # Electron 主进程
├── preload/       # 预加载脚本
├── renderer/      # 渲染进程
│   ├── components/ # React 组件
│   └── pages/     # 页面组件
└── shared/        # 共享代码
    ├── types/     # 共享类型定义
    ├── constants/ # 共享常量
    └── utils/     # 共享工具函数
```
### 共享代码 (shared)

位于 `src/shared` 目录，包含可以在主进程、预加载脚本和渲染进程之间共享的代码：

#### 目录结构
```
src/shared/
├── types/          # 共享的类型定义
│   ├── ipc.ts      # IPC 消息类型
│   ├── state.ts    # 共享状态类型
│   └── index.ts    # 类型导出
├── constants/      # 共享常量
│   ├── events.ts   # 事件名称常量
│   └── index.ts    # 常量导出
├── utils/          # 共享工具函数
│   ├── validation.ts # 数据验证函数
│   └── index.ts    # 工具函数导出
└── index.ts        # 主导出文件
```

#### 使用规范
1. 类型定义：
   - 使用 ADT 定义共享类型
   - 确保类型定义不依赖进程特定代码
   - 通过 index.ts 统一导出类型

2. 常量定义：
   - 使用 const 断言确保类型安全
   - 统一管理事件名称等常量
   - 避免魔法字符串

3. 工具函数：
   - 保持纯函数性质
   - 避免副作用
   - 使用 ADT 处理错误和异步

### 主进程 (main)

位于 `src/main` 目录，负责：
- 应用生命周期管理
- 系统级 API 调用
- 窗口管理
- IPC 通信

### 预加载脚本 (preload)

位于 `src/preload` 目录，负责：
- 安全地暴露主进程 API 给渲染进程
- 实现进程间通信桥接

### 渲染进程 (renderer)

位于 `src/renderer` 目录，采用 React 技术栈：

#### 组件结构
- `components/` - 可复用组件
- `pages/` - 页面级组件
- `hooks/` - 自定义 React Hooks
- `utils/` - 工具函数
- `types/` - TypeScript 类型定义

#### 样式方案
- Material-UI 作为基础组件库
- styled-components 用于组件级样式
- 主题配置在 `components/theme.ts`
- 全局样式在 `components/GlobalStyles.ts`

## 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 进行代码格式化

### Git 工作流
1. 从 main 分支创建特性分支
2. 提交前运行 lint 和测试
3. 提交信息遵循 Conventional Commits 规范
4. 创建 Pull Request 进行代码审查

## 构建和发布

1. 更新版本号：
```bash
pnpm version [major|minor|patch]
```

2. 构建应用：
```bash
pnpm build
```

3. 发布：
```bash
pnpm publish
```

## 常见问题

### 依赖安装问题
如果遇到依赖安装问题，尝试：
```bash
pnpm store prune
pnpm install
```

### 开发环境问题
如果开发环境出现问题，尝试：
```bash
pnpm clean
pnpm install
```

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License 