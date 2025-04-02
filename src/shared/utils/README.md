# 工具函数 (Utils)

存放共享的工具函数，保持纯函数性质。

## 主要工具函数

以下是工具函数的示例，实际工具函数请根据项目需求实现：

### 数据验证示例
```typescript
// validation.ts
// 示例：文档验证函数
export const validateDocument = (doc: unknown): Result<Document, ValidationError> => {
  // 验证逻辑
};

// 示例：LaTeX 语法验证函数
export const validateLatex = (content: string): Result<string, ValidationError> => {
  // LaTeX 语法验证
};
```

### 文件处理示例
```typescript
// file.ts
// 示例：文件读取函数
export const readFile = (path: string): TaskEither<Error, string> => {
  // 文件读取逻辑
};

// 示例：文件写入函数
export const writeFile = (path: string, content: string): TaskEither<Error, void> => {
  // 文件写入逻辑
};
```

### 字符串处理示例
```typescript
// string.ts
// 示例：LaTeX 特殊字符转义函数
export const escapeLatex = (str: string): string => {
  // LaTeX 特殊字符转义
};

// 示例：空白字符标准化函数
export const normalizeWhitespace = (str: string): string => {
  // 空白字符标准化
};
```

## 开发规范

- 保持纯函数性质
- 使用 ADT 处理错误和异步
- 避免副作用
- 提供完整的类型定义
- 通过 index.ts 统一导出函数

## 错误处理示例

使用 Result/Either 类型处理错误：
```typescript
// 示例：错误处理类型定义
type Result<T, E> = 
  | { type: 'success'; value: T }
  | { type: 'error'; error: E };
```

## 异步处理示例

使用 Task/Either 组合处理异步操作：
```typescript
// 示例：异步处理类型定义
type TaskEither<E, A> = Task<Either<E, A>>;
``` 