# 组件目录 (Components)

存放可复用的 React 组件，采用函数式编程范式。

## 组件组织

### 有状态组件
采用 Container/Presentational 模式：

```
FeatureName/
  ├── index.ts        # 导出 Container 组件和类型
  ├── FeatureNameCt.tsx  # Container 组件
  └── FeatureNameRp.tsx  # Presentational 组件
```

### 无状态组件
简单组件直接在单文件中定义：

```
Button.tsx
Input.tsx
```

## 开发规范

- 使用函数组件
- 采用 Container/Presentational 模式
- 使用 styled-components 进行样式定义
- 保持组件的纯函数性质
- 使用 ADT 定义组件属性

## 文件命名

- Container 组件：`[FeatureName]Ct.tsx`
- Presentational 组件：`[FeatureName]Rp.tsx`
- 无状态组件：`[ComponentName].tsx`

## 主题配置

- `theme.ts` - Material-UI 主题配置
- `GlobalStyles.ts` - 全局样式定义 