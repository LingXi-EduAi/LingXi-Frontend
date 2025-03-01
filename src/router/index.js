import {createRouter, createWebHistory} from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import Start from "@/views/Start.vue";
import HomeworkHub from "@/views/HomeworkHub.vue";
import CoursewareHub from "@/views/CoursewareHub.vue";
import Syllabus from "@/views/Syllabus.vue";

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
        name: "课程大纲",
        component: Syllabus,
    }, {
        path: "/coursewareHub",
        name: "课件中心",
        component: CoursewareHub,
    }, {
        path: "/dashboard-default",
        name: "Dashboard",
        component: Dashboard,
    },
    {
        path: "/tables",
        name: "Tables",
        component: Tables,
    },
    {
        path: "/billing",
        name: "Billing",
        component: Billing,
    },
    {
        path: "/virtual-reality",
        name: "Virtual Reality",
        component: VirtualReality,
    },
    {
        path: "/rtl-page",
        name: "RTL",
        component: RTL,
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile,
    },
    {
        path: "/signin",
        name: "Signin",
        component: Signin,
    },
    {
        path: "/signup",
        name: "Signup",
        component: Signup,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    linkActiveClass: "active",
});

export default router;
