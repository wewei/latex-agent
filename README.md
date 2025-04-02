# LaTeX Agent

一个基于 Electron 的 AI 助手，帮助用户更高效地使用 LaTeX 写作。

## 技术栈

- Electron
- TypeScript
- React
- Material-UI
- styled-components
- pnpm

## 主要功能

- LaTeX 文档智能补全
- 实时语法检查
- 智能模板推荐
- AI 辅助写作

## 快速开始

1. 安装依赖：
```bash
pnpm install
```

2. 启动开发环境：
```bash
pnpm dev
```

3. 构建应用：
```bash
pnpm build
```

## 项目结构

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

## 开发文档

详细开发文档请参考 [DEVELOPMENT.md](./DEVELOPMENT.md) 