# LaTeX Agent 开发助手提示

## 项目特点

这是一个基于 Electron 的 LaTeX 写作辅助工具，采用函数式编程范式，使用 ADT（代数数据类型）而不是类和接口。主要特点：

- 使用 pnpm 作为包管理器
- 采用 Electron 三进程架构
- 渲染层使用 React + MUI + styled-components
- 严格遵循函数式编程原则

## 编码规范

### 函数式编程原则
- 优先使用纯函数
- 避免副作用
- 使用不可变数据结构
- 采用函数组合而不是继承
- 使用 ADT 进行类型建模

### 类型系统
- 使用 TypeScript 严格模式
- 优先使用 ADT 而不是类和接口
- 使用 discriminated unions 进行类型区分
- 避免使用 any 类型

### 组件设计
- 使用函数组件而不是类组件
- 优先使用 React Hooks
- 组件应该是纯函数
- 使用 styled-components 进行组件级样式定义
- 主题配置和全局样式放在 components 目录下

## 最佳实践

### 组件组织规范

#### 有状态组件
采用 Container/Presentational 模式，遵循以下规范：

1. 文件组织：
```
components/
  ├── FeatureName/
  │   ├── index.ts        # 导出 Container 组件和类型
  │   ├── FeatureNameCt.tsx  # Container 组件
  │   └── FeatureNameRp.tsx  # Presentational 组件
```

2. 命名规范：
- Container 组件：`[FeatureName]Ct`
- Presentational 组件：`[FeatureName]Rp`
- 类型定义：`[FeatureName]Props`, `[FeatureName]State`

3. 职责划分：
- Container 组件：
  - 管理状态和副作用
  - 处理业务逻辑
  - 向 Presentational 组件传递 props
- Presentational 组件：
  - 纯渲染逻辑
  - 无状态
  - 接收 props 并渲染 UI

4. 示例：
```typescript
// FeatureNameCt.tsx
type FeatureNameState = {
  data: DataType;
  loading: boolean;
};

const FeatureNameCt: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return <FeatureNameRp {...state} />;
};

// FeatureNameRp.tsx
type FeatureNameRpProps = {
  data: DataType;
  loading: boolean;
};

const FeatureNameRp: React.FC<FeatureNameRpProps> = ({ data, loading }) => {
  if (loading) return <LoadingSpinner />;
  return <DataView data={data} />;
};

// index.ts
export { FeatureNameCt as FeatureName };
export type { FeatureNameState, FeatureNameRpProps };
```

#### 无状态组件
简单无状态组件可以直接在单文件中定义：

```typescript
// components/Button.tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => (
  <StyledButton variant={variant} onClick={onClick}>
    {label}
  </StyledButton>
);

export default Button;
```

### 状态管理
- 使用 React Context 进行状态共享
- 优先使用 useReducer 而不是 useState
- 使用 ADT 定义状态类型
- 避免全局状态

### 错误处理
- 使用 Result 类型处理错误
- 避免使用 try-catch
- 使用 Either 类型进行错误处理

### 异步处理
- 使用 Task/Either 组合处理异步操作
- 避免使用 Promise 直接处理异步
- 使用 ADT 包装异步结果

## 项目结构指南
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

1. 文件组织：
```
src/
  ├── shared/
  │   ├── types/          # 共享的类型定义
  │   │   ├── ipc.ts      # IPC 消息类型
  │   │   ├── state.ts    # 共享状态类型
  │   │   └── index.ts    # 类型导出
  │   ├── constants/      # 共享常量
  │   │   ├── events.ts   # 事件名称常量
  │   │   └── index.ts    # 常量导出
  │   ├── utils/          # 共享工具函数
  │   │   ├── validation.ts # 数据验证函数
  │   │   └── index.ts    # 工具函数导出
  │   └── index.ts        # 主导出文件
```

2. 使用规范：
- 类型定义：
  ```typescript
  // shared/types/ipc.ts
  export type IpcMessage = 
    | { type: 'SAVE_DOCUMENT'; payload: Document }
    | { type: 'LOAD_DOCUMENT'; payload: { id: string } }
    | { type: 'DOCUMENT_SAVED'; payload: { success: boolean } };
  ```