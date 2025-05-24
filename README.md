# 笔记管理系统 - 管理员后台

一个基于 React + TypeScript + Ant Design 的现代化笔记管理系统管理员后台。

## 技术栈

- **前端框架**: React 19
- **类型系统**: TypeScript
- **UI 组件库**: Ant Design 5.x
- **路由管理**: React Router 6
- **样式预处理**: Less
- **HTTP 客户端**: Axios
- **构建工具**: Vite
- **包管理器**: pnpm

## 功能特性

### 🔐 管理员认证
- 管理员登录认证
- JWT Token 认证
- 路由守卫保护

### 📊 管理员仪表盘
- 系统统计数据（用户数、笔记数、脑电波使用情况）
- 最近用户和笔记展示
- 快速操作入口

### 📝 笔记管理
- 查看所有用户笔记
- 笔记详情查看
- 删除笔记功能
- 按用户筛选

### 👥 用户管理
- 用户列表管理
- 编辑用户信息（用户名、邮箱）
- 删除用户操作
- 用户搜索功能

### 🎨 界面设计
- 现代简约的设计风格
- 响应式布局适配
- 优雅的交互动效
- 良好的用户体验

## 项目结构

```
src/
├── components/          # 通用组件
├── layouts/            # 布局组件
│   ├── MainLayout.tsx  # 主布局
│   └── MainLayout.less # 布局样式
├── pages/              # 页面组件
│   ├── Login.tsx       # 管理员登录页面
│   ├── Dashboard.tsx   # 管理员仪表盘
│   ├── Notes.tsx       # 笔记管理
│   └── Users.tsx       # 用户管理
├── services/           # API 服务
│   ├── api.ts          # API 基础配置
│   ├── userService.ts  # 用户相关 API
│   ├── noteService.ts  # 笔记相关 API
│   └── dashboardService.ts # 仪表盘 API
├── types/              # TypeScript 类型定义
│   └── index.ts        # 通用类型
├── utils/              # 工具函数
│   └── index.ts        # 通用工具
├── styles/             # 样式文件
│   └── global.less     # 全局样式
├── hooks/              # 自定义 Hooks
├── store/              # 状态管理
├── App.tsx             # 应用入口
└── main.tsx            # 主入口文件
```

## 开发指南

### 环境要求

- Node.js >= 16
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
```

## 管理员登录

默认管理员账号信息：
- **用户名**: admin
- **密码**: admin123456

## API 接口

项目使用 RESTful API 设计，对接管理员后台接口：

### 管理员认证接口
- `POST /api/admin/login` - 管理员登录

### 仪表盘接口
- `GET /api/admin/dashboard` - 获取仪表盘数据

### 用户管理接口
- `GET /api/admin/users` - 获取用户列表
- `GET /api/admin/users/:id` - 获取用户详情
- `PUT /api/admin/users/:id` - 更新用户信息
- `DELETE /api/admin/users/:id` - 删除用户

### 笔记管理接口
- `GET /api/admin/notes` - 获取笔记列表
- `DELETE /api/admin/notes/:id` - 删除笔记

## 配置说明

### 环境变量

创建 `.env` 文件配置环境变量：

```env
# API基础地址 - 管理员接口
VITE_API_BASE_URL=http://localhost:5000/api/admin

# 应用标题
VITE_APP_Title=笔记管理系统

# 开发环境配置
VITE_NODE_ENV=development
```

### 路径别名

项目配置了 `@` 别名指向 `src` 目录，可以使用：

```typescript
import { formatDateTime } from '@/utils';
import MainLayout from '@/layouts/MainLayout';
```

## 后端对接

### API响应格式

后端统一返回格式：

```json
{
  "code": 0,           // 0: 成功, 非0: 失败
  "message": "提示信息",
  "data": {            // 具体数据
    // ...
  }
}
```

### 认证机制

- 使用JWT Token进行身份认证
- Token存储在localStorage中
- 请求头自动添加Authorization字段

## 样式规范

- 使用 Less 预处理器
- 采用 BEM 命名规范
- 响应式设计优先
- 统一的设计变量

## 功能说明

### 管理员仪表盘
- 显示系统整体统计数据
- 展示最近用户注册和笔记创建情况
- 提供快速导航入口

### 用户管理
- 支持用户信息的查看、编辑和删除
- 提供用户搜索功能
- 分页显示用户列表

### 笔记管理
- 查看所有用户创建的笔记
- 支持按用户筛选笔记
- 提供笔记详情查看
- 支持删除不当笔记

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码变更
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
