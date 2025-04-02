# 页面目录 (Pages)

存放页面级组件，每个页面代表应用的一个主要视图。

## 页面组织

```
pages/
  ├── Editor/          # 编辑器页面
  │   ├── index.tsx    # 页面入口
  │   └── components/  # 页面特定组件
  ├── Settings/        # 设置页面
  │   ├── index.tsx
  │   └── components/
  └── About/           # 关于页面
      ├── index.tsx
      └── components/
```

## 开发规范

- 使用函数组件
- 采用 Container/Presentational 模式
- 页面特定组件放在页面目录下的 components 文件夹
- 可复用组件放在根 components 目录
- 使用 ADT 定义页面状态和属性

## 路由配置

页面路由在 `App.tsx` 中配置，使用 React Router 进行路由管理。

## 状态管理

- 页面级状态使用 React Context
- 使用 useReducer 管理复杂状态
- 使用 ADT 定义状态类型 