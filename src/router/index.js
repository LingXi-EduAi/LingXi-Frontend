import {createRouter, createWebHistory} from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Start from "@/views/Start.vue";
import HomeworkHub from "@/views/HomeworkHub.vue";
import CoursewareHub from "@/views/CoursewareHub.vue";
import Syllabus from "@/views/Syllabus.vue";
import Analytics from "@/views/Analytics.vue";
import ClassManagement from "@/views/ClassManagement.vue";
import TeachingAssistant from "@/views/TeachingAssistant.vue";
import ClassGroupingManagement from "@/views/ClassGroupingManagement.vue";

const routes = [
    {
        path: "/",
        name: "/",
        redirect: "/start",
    }, {
        path: "/start",
        name: "开始",
        component: Start,
    }, {
        path: "/homeworkHub",
        name: "作业中心",
        component: HomeworkHub,
    }, {
        path: "/syllabus",
        name: "教学方案",
        component: Syllabus,
    }, {
        path: "/coursewareHub",
        name: "课件中心",
        component: CoursewareHub,
    }, {
        path: "/analytics",
        name: "学情分析",
        component: Analytics,
    }, {
        path: "/teaching-assistant",
        name: "助教",
        component: TeachingAssistant,
    }, {
        path: "/dashboard-default",
        name: "Dashboard",
        component: Dashboard,
    }, {
        path: "/tables",
        name: "Tables",
        component: Tables,
    }, {
        path: "/billing",
        name: "Billing",
        component: Billing,
    }, {
        path: "/virtual-reality",
        name: "Virtual Reality",
        component: VirtualReality,
    }, {
        path: "/rtl-page",
        name: "RTL",
        component: RTL,
    }, {
        path: "/profile",
        name: "Profile",
        component: Profile,
    }, {
        path: "/signin",
        name: "Signin",
        component: Login,
    }, {
        path: "/signup",
        name: "Signup",
        component: Signup,
    }, {
        path: '/class-management',
        name: '班级管理',
        component: ClassManagement,
    }, {
        path: "/class-grouping-management",
        name: "分班模板管理",
        component: ClassGroupingManagement,
    }, {
        path: "/class-adding",
        name: "添加班级",
        component: () => import("@/views/ClassAdding.vue"),
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    linkActiveClass: "active",
});

export default router;
