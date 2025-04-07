import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "/",
        redirect: "/start",
    }, {
        path: "/role-selection",
        name: "角色选择",
        component: () => import("@/views/RoleSelection.vue"),
    }, {
        path: "/student-start",
        name: "学生首页",
        component: () => import("@/views/StudentStart.vue"),
    }, {
        path: "/start",
        name: "开始",
        component: () => import("@/views/Start.vue"),
    }, {
        path: "/homework-hub",
        name: "作业中心",
        component: () => import("@/views/HomeworkHub.vue"),
    }, {
        path: "/teaching-plan",
        name: "教学方案",
        component: () => import("@/views/TeachingPlan.vue"),
    }, {
        path: "/courseware-hub",
        name: "课件中心",
        component: () => import("@/views/CoursewareHub.vue"),
    }, {
        path: "/analytics",
        name: "学情分析",
        component: () => import("@/views/Analytics.vue"),
    }, {
        path: "/teaching-assistant",
        name: "助教",
        component: () => import("@/views/TeachingAssistant.vue"),
    }, {
        path: "/profile",
        name: "账户",
        component: () => import("@/views/Profile.vue"),
    }, {
        path: "/login",
        name: "登录",
        component: () => import("@/views/Login.vue"),
    }, {
        path: "/signup",
        name: "注册",
        component: () => import("@/views/Signup.vue"),
    }, {
        path: '/class-management',
        name: '班级管理',
        component: () => import("@/views/ClassManagement.vue"),
    }, {
        path: "/class-grouping-management",
        name: "分组模板管理",
        component: () => import("@/views/ClassGroupingManagement.vue"),
    }, {
        path: "/class-adding",
        name: "添加班级",
        component: () => import("@/views/ClassAdding.vue"),
    }, {
        path: "/ai-quiz",
        name: "AI测验",
        component: () => import("@/views/AIQuiz.vue"),
    }, {
        path: "/learning-materials",
        name: "学习资料",
        component: () => import("@/views/LearningMaterials.vue"),
    }, {
        path: "/404",
        name: "404",
        component: () => import("@/views/NotFound.vue"),
    }, {
        path: "/403",
        name: "403",
        component: () => import("@/views/Forbidden.vue"),
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    linkActiveClass: "active",
});

export default router;
