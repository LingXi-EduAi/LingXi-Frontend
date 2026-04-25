# 灵犀教育 (LingXi-EduAI)

![logo](public/logo.png)



## 项目简介

随着人工智能技术的飞速发展，我们深信 AI 在教育领域，尤其是在教师备课过程中，蕴含着巨大的潜力。"灵犀教育"应运而生，我们致力于利用前沿的 AI 技术，为教师提供一站式的智能备课解决方案。

"灵犀教育"的核心使命是：**减轻教师备课负担，优化教学流程，提升教学效果，最终助力学生获得更优质、更个性化的学习体验与成果。**

## 核心功能

"灵犀教育"为教师和学生提供了截然不同的功能，旨在通过技术赋能教育的全过程。

### 教师端

- **AI教案生成**：根据教师输入的教学目标和内容，自动生成结构完整、内容丰富的教案。
- **AI课件制作**：一键生成与教案配套的演示文稿，包含图文、案例等多种元素。
- **AI智能出题**：根据知识点和难度要求，快速生成多种题型（选择题、填空题、问答题等）的试卷。
- **作业中心**：发布、批改、管理学生作业，并查看作业完成情况。
- **学情分析**：通过数据可视化图表，智能分析学生的学习进度、知识点掌握情况，为个性化教学提供数据支持。
- **班级管理**：轻松创建和管理班级、学生分组，优化课堂组织。
- **教学资源库**：上传、管理和分享教学资料，构建个人或学校的教学资源中心。

### 学生端

- **智能助教**：提供7x24小时的AI答疑服务，随时解答学习中遇到的问题。
- **个性化学习**：根据学情分析结果，为学生推荐合适的学习资源和练习题。
- **作业中心**：在线完成和提交作业，查看批改结果和教师评语。
- **学习小组**：与同学组队学习，共同探讨问题，协作完成项目。
- **学情报告**：查看自己的学习进度、成绩变化和能力雷达图，明确优势和待提升领域。

## 技术栈

- **前端框架**: Vue.js 3
- **路由**: Vue Router
- **UI框架**: Argon Dashboard 2 (基于 Bootstrap 5)
- **图表**: Chart.js

## 项目结构

项目主要分为三大模块：教师模块、学生模块和系统模块。

```
src/views/
├── student/            # 学生端页面
│   ├── Analytics.vue       # 学情分析
│   ├── HomeworkCenter.vue  # 作业中心
│   ├── LearningMaterials.vue # 学习资料
│   ├── Start.vue           # 学生主页
│   ├── StudyGroup.vue      # 学习小组
│   └── TeachingAssistant.vue # 智能助教
├── system/             # 系统通用页面
│   ├── Login.vue           # 登录
│   ├── Profile.vue         # 个人中心
│   ├── RoleSelection.vue   # 角色选择
│   └── Signup.vue          # 注册
└── teacher/            # 教师端页面
    ├── Analytics.vue       # 学情分析
    ├── CoursewareHub.vue   # 课件中心
    ├── TeachingPlan.vue    # 教学方案
    ├── class/              # 班级管理
    └── homework/           # 作业相关
        ├── AIQuiz.vue      # AI出题
        └── HomeworkHub.vue # 作业中心
```

## 环境要求

- Node.js 16+
- npm 8+ 或 yarn 1.22+
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/LingXi-EduAi/LingXi-Frontend.git
cd LingXi-Frontend
```

### 2. 安装依赖
```bash
npm install
# 或使用yarn
yarn install
```

### 3. 环境配置

项目支持多种配置方式：

#### 方式一：使用环境变量（推荐）
创建 `.env.local` 文件：
```bash
# 后端API地址
VUE_APP_BASE_API=http://localhost:5678
# AI服务API地址  
VUE_APP_AI_API=https://cloud.dify.ai
```

#### 方式二：修改配置文件
直接修改 `src/config/env.js` 中的配置：
```javascript
development: {
  baseAPI: 'http://localhost:5678',
  aiAPI: 'https://cloud.dify.ai',
  // 其他配置...
}
```

### 4. 启动开发服务器
```bash
npm run serve
# 或使用yarn
yarn serve
```

### 5. 访问应用
在浏览器中打开 `http://localhost:8080`

### 6. 构建生产版本
```bash
npm run build
# 或使用yarn
yarn build
```

## 开发指南

### 目录结构详解

```
src/
├── assets/                 # 静态资源
│   ├── css/               # 全局样式文件
│   ├── fonts/             # 字体文件
│   ├── img/               # 图片资源
│   ├── js/                # JavaScript工具
│   └── scss/              # SCSS样式文件
├── components/            # 全局组件
│   ├── ArgonAlert.vue     # 警告组件
│   ├── ArgonButton.vue    # 按钮组件
│   ├── ArgonInput.vue     # 输入框组件
│   └── ...                # 其他UI组件
├── config/                # 配置文件
│   ├── api.js             # API配置
│   └── env.js             # 环境配置
├── examples/              # 示例组件
│   ├── Cards/             # 卡片组件
│   ├── Charts/            # 图表组件
│   ├── Navbars/           # 导航栏组件
│   └── ...
├── router/                # 路由配置
│   ├── guards.js          # 路由守卫
│   └── index.js           # 路由定义
├── store/                 # Vuex状态管理
├── utils/                 # 工具函数
│   ├── api.js             # API请求封装
│   ├── request.js         # 请求工具
│   └── tokenMigration.js  # Token迁移工具
├── views/                 # 页面组件
└── styles/                # 样式文件
```

### 开发规范

#### 命名规范
- **组件文件**: 使用PascalCase，如 `UserProfile.vue`
- **页面文件**: 使用PascalCase，如 `StudentDashboard.vue`
- **工具文件**: 使用camelCase，如 `apiUtils.js`
- **样式类**: 使用kebab-case，如 `.user-profile-card`

#### 代码规范
- 使用ES6+语法
- 组件使用Composition API
- 统一使用2个空格缩进
- 使用ESLint进行代码检查
- 提交前进行代码格式化

#### API调用规范
```javascript
// 推荐使用封装的API方法
import { baseRequest } from '@/utils/api';

// 正确的API调用方式
const response = await baseRequest.post('/api/endpoint', data);

// 错误处理
try {
  const result = await baseRequest.post('/api/endpoint', data);
  // 处理成功响应
} catch (error) {
  // 处理错误
  console.error('API调用失败:', error.message);
}
```

### 主要特性

#### 响应式设计
- 支持移动端、平板和桌面端
- 使用Bootstrap 5响应式栅格系统
- 适配主流分辨率和设备

#### 主题定制
- 支持浅色/深色主题切换
- 可自定义主题色彩
- 支持组件级别的样式覆盖

#### 国际化支持
- 预留国际化接口
- 支持多语言切换
- 日期、时间本地化处理

#### 性能优化
- 路由懒加载
- 组件按需加载
- 图片懒加载
- 代码分割优化

### 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产版本
npm run build

# 运行单元测试
npm run test:unit

# 运行端到端测试
npm run test:e2e

# 代码检查
npm run lint

# 代码格式化
npm run lint:fix
```

### 浏览器兼容性

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| IE | 不支持 |

### 部署指南

#### 开发环境部署
```bash
# 启动开发服务器
npm run serve

# 访问地址: http://localhost:8080
```

#### 生产环境部署
```bash
# 构建生产版本
npm run build

# 部署到Web服务器
# 将dist目录内容复制到Web服务器根目录
```

#### Docker部署
```bash
# 构建镜像
docker build -t lingxi-frontend .

# 运行容器
docker run -d -p 80:80 lingxi-frontend
```

#### Nginx配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # 处理Vue Router的history模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api {
        proxy_pass http://backend:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 故障排除

#### 常见问题

1. **依赖安装失败**
   ```bash
   # 清除npm缓存
   npm cache clean --force
   
   # 删除node_modules重新安装
   rm -rf node_modules
   npm install
   ```

2. **开发服务器启动失败**
   - 检查端口8080是否被占用
   - 确认Node.js版本是否符合要求
   - 检查防火墙设置

3. **API请求失败**
   - 检查后端服务是否启动
   - 验证API配置是否正确
   - 检查网络连接和跨域设置

4. **构建失败**
   - 检查代码语法错误
   - 确认所有依赖已正确安装
   - 检查构建环境配置

### 贡献指南

我们欢迎所有形式的贡献！

#### 提交Bug报告
1. 在GitHub Issues中搜索是否已有相同问题
2. 创建新的Issue，详细描述问题
3. 提供复现步骤和环境信息
4. 如可能，提供错误截图或日志

#### 提交功能请求
1. 在Issues中描述新功能的需求和用例
2. 说明功能的预期行为
3. 考虑功能对现有系统的影响

#### 提交代码
1. Fork项目到个人仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 遵循代码规范进行开发
4. 添加必要的测试用例
5. 提交代码 (`git commit -m 'Add amazing feature'`)
6. 推送到个人仓库 (`git push origin feature/amazing-feature`)
7. 创建Pull Request

### 版本历史

- **v2.1.0** (2024-01-15)
  - 新增AI智能助教功能
  - 优化用户界面交互体验
  - 修复已知Bug

- **v2.0.0** (2023-12-01)
  - 重构项目架构
  - 升级到Vue 3 + Composition API
  - 新增学情分析模块

- **v1.5.0** (2023-10-15)
  - 添加作业系统功能
  - 优化移动端适配
  - 性能优化

- **v1.0.0** (2023-08-01)
  - 项目初始版本发布
  - 基础教学管理功能

### 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

### 联系我们

- **项目主页**: [https://github.com/LingXi-EduAi/LingXi-Frontend](https://github.com/LingXi-EduAi/LingXi-Frontend)
- **问题反馈**: [GitHub Issues](https://github.com/LingXi-EduAi/LingXi-Frontend/issues)
- **技术交流**: [Discussions](https://github.com/LingXi-EduAi/LingXi-Frontend/discussions)
- **官方网站**: [https://lingxi-edu.com](https://lingxi-edu.com)
- **技术支持**: support@lingxi-edu.com

### 致谢

感谢以下开源项目为本项目提供的支持：
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Argon Dashboard](https://www.creative-tim.com/product/argon-dashboard) - 优秀的管理面板模板
- [Bootstrap](https://getbootstrap.com/) - 强大的CSS框架
- [Chart.js](https://www.chartjs.org/) - 简洁的图表库

同时感谢所有为本项目做出贡献的开发者和用户！