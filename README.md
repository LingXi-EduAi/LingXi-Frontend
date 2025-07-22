# 灵犀教育 (LingXi-EduAI)

![logo](public/logo.png)



## 项目简介

随着人工智能技术的飞速发展，我们深信 AI 在教育领域，尤其是在教师备课过程中，蕴含着巨大的潜力。“灵犀教育”应运而生，我们致力于利用前沿的 AI 技术，为教师提供一站式的智能备课解决方案。

“灵犀教育”的核心使命是：**减轻教师备课负担，优化教学流程，提升教学效果，最终助力学生获得更优质、更个性化的学习体验与成果。**

## 核心功能

“灵犀教育”为教师和学生提供了截然不同的功能，旨在通过技术赋能教育的全过程。

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

## 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/LingXi-EduAi/LingXi-Frontend.git
   cd LingXi-Frontend
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **添加`.env`配置文件**
   
   复制`.env.example`并填写完整相关后端配置及 api 接口

4. **启动项目**

   ```bash
   npm run serve
   ```

5. **访问应用**

   在浏览器中打开 `http://localhost:8080`

## License

Distributed under the MIT License. See `LICENSE` for more information.