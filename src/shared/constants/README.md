# 常量定义 (Constants)

存放共享的常量定义，使用 const 断言确保类型安全。

## 主要常量

以下是常量定义的示例，实际常量定义请根据项目需求实现：

### IPC 事件常量示例
```typescript
// events.ts
// 示例：IPC 事件常量定义
export const IPC_EVENTS = {
  SAVE_DOCUMENT: 'save-document',
  LOAD_DOCUMENT: 'load-document',
  DOCUMENT_SAVED: 'document-saved',
} as const;

export type IpcEvent = typeof IPC_EVENTS[keyof typeof IPC_EVENTS];
```

### 应用配置常量示例
```typescript
// config.ts
// 示例：应用配置常量定义
export const APP_CONFIG = {
  VERSION: '1.0.0',
  NAME: 'LaTeX Agent',
  AUTHOR: 'Your Name',
} as const;
```

### 文件类型常量示例
```typescript
// file-types.ts
// 示例：文件类型常量定义
export const FILE_TYPES = {
  LATEX: '.tex',
  PDF: '.pdf',
  LOG: '.log',
} as const;
```

## 开发规范

- 使用 const 断言确保类型安全
- 统一管理事件名称等常量
- 避免魔法字符串
- 通过 index.ts 统一导出常量
- 使用 TypeScript 的 keyof 和 typeof 操作符获取类型 