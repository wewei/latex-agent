# 类型定义 (Types)

存放共享的类型定义，使用 ADT（代数数据类型）进行类型建模。

## 主要类型

以下是类型定义的示例，实际类型定义请根据项目需求实现：

### IPC 消息类型示例
```typescript
// ipc.ts
// 示例：IPC 消息类型定义
export type IpcMessage = 
  | { type: 'SAVE_DOCUMENT'; payload: Document }
  | { type: 'LOAD_DOCUMENT'; payload: { id: string } }
  | { type: 'DOCUMENT_SAVED'; payload: { success: boolean } };
```

### 状态类型示例
```typescript
// state.ts
// 示例：文档相关类型定义
export type Document = {
  id: string;
  content: string;
  metadata: DocumentMetadata;
};

export type DocumentMetadata = {
  title: string;
  author: string;
  date: Date;
};
```

### 错误类型示例
```typescript
// error.ts
// 示例：应用错误类型定义
export type AppError = 
  | { type: 'FILE_ERROR'; message: string }
  | { type: 'VALIDATION_ERROR'; message: string }
  | { type: 'NETWORK_ERROR'; message: string };
```

## 开发规范

- 使用 ADT 定义类型
- 使用 discriminated unions 进行类型区分
- 避免使用 any 类型
- 通过 index.ts 统一导出类型
- 保持类型定义的纯函数性质 