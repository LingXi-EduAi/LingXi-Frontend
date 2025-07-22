import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "/",
        redirect: "/role-selection",
    },
    {
        path: "/role-selection",
        name: "角色选择",
        component: () => import("@/views/system/RoleSelection.vue"),
    },
    // 教师相关路由
    {
        path: "/teacher",
        name: "教师",
        component: () => import("@/views/teacher/TeacherLayout.vue"),
        children: [
            {
                path: "start",
                name: "教师 - 主页",
                component: () => import("@/views/teacher/Start.vue"),
            },
            {
                path: "homework-hub",
                name: "教师 - 作业中心",
                component: () => import("@/views/teacher/homework/HomeworkHub.vue"),
            },
            {
                path: "teaching-plan",
                name: "教师 - 教学方案",
                component: () => import("@/views/teacher/TeachingPlan.vue"),
            },
            {
                path: "teaching-plan-pro",
                name: "教师 - 教学方案Pro",
                component: () => import("@/views/teacher/TeachingPlanPro.vue"),
            },
            {
                path: "courseware-hub",
                name: "教师 - 课件中心",
                component: () => import("@/views/teacher/CoursewareHub.vue"),
            },
            {
                path: "analytics",
                name: "教师 - 学情分析",
                component: () => import("@/views/teacher/Analytics.vue"),
            },
            {
                path: "class",
                name: "教师 - 班级管理",
                children: [
                    {
                        path: "management",
                        name: "教师 - 班级管理",
                        component: () => import("@/views/teacher/class/ClassManagement.vue"),
                    },
                    {
                        path: "grouping",
                        name: "教师 - 分组模板",
                        component: () => import("@/views/teacher/class/ClassGroupingManagement.vue"),
                    },
                    {
                        path: "add",
                        name: "教师 - 添加班级",
                        component: () => import("@/views/teacher/class/ClassAdding.vue"),
                    },
                ],
            },
            {
                path: "ai-quiz",
                name: "教师 - AI出题",
                component: () => import("@/views/teacher/homework/AIQuiz.vue"),
            },
            {
                path: "learning-materials",
                name: "教师 - 学习资料",
                component: () => import("@/views/teacher/LearningMaterials.vue"),
            },
            {
                path: "/teacher/new-note",
                name: "教师 - 新建笔记",
                component: () => import("@/views/teacher/NewNote.vue"),
            }
        ]
    },
    // 学生相关路由
    {
        path: "/student",
        name: "学生",
        component: () => import("@/views/student/StudentLayout.vue"),
        children: [
            {
                path: "start",
                name: "学生 - 主页",
                component: () => import("@/views/student/Start.vue"),
            },
            {
                path: "teaching-assistant",
                name: "学生 - 助教",
                component: () => import("@/views/student/TeachingAssistant.vue"),
            },
            {
                path: "analytics",
                name: "学生 - 学情分析",
                component: () => import("@/views/student/Analytics.vue"),
            },
            {
                path: "learning-materials",
                name: "学生 - 学习资源",
                component: () => import("@/views/student/LearningMaterials.vue"),
            },
            {
                path: "study-group",
                name: "学生 - 学习小组",
                component: () => import("@/views/student/StudyGroup.vue"),
            },
            {
                path: "my-homework",
                name: "学生 - 作业中心",
                component: () => import("@/views/student/HomeworkCenter.vue"),
            },
            {
                path: "profile",
                name: "学生 - 个人设置",
                component: () => import("@/views/system/Profile.vue"),
            },
        ]
    },
    // 系统相关路由
    {
        path: "/profile",
        name: "账户",
        component: () => import("@/views/system/Profile.vue"),
    },
    {
        path: "/login",
        name: "登录",
        component: () => import("@/views/system/Login.vue"),
    },
    {
        path: "/signup",
        name: "注册",
        component: () => import("@/views/system/Signup.vue"),
    },
    // 错误页面
    {
        path: "/404",
        name: "404",
        component: () => import("@/views/system/NotFound.vue"),
    },
    {
        path: "/403",
        name: "403",
        component: () => import("@/views/system/Forbidden.vue"),
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    linkActiveClass: "active",
});

export default router;
