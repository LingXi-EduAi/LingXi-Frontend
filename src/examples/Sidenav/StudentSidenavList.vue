<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "./SidenavItem.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  // 修改路由判断逻辑，适配新的路由结构
  return routeArr.length > 2 ? routeArr[2] : routeArr[1];
};
</script>
<template>
  <div class="collapse navbar-collapse w-auto h-auto h-100" id="sidenav-collapse-main">
    <ul class="navbar-nav">
      <!-- 1. 开始 -->
      <li class="nav-item">
        <sidenav-item to="/student/start" :class="getRoute() === 'start' ? 'active' : ''" :navText="isRTL ? 'بداية .' : '开始'">
          <template v-slot:icon>
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
              style="min-width: 20px !important; min-height: 20px !important;">
              <path d="M9 18V42H39V18L24 6L9 18Z" fill="#65CB8F" stroke="#333" stroke-width="4" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M19 29V42H29V29H19Z" fill="#77CAC3" stroke="#FFF" stroke-width="4" stroke-linejoin="round" />
              <path d="M9 42H39" stroke="#333" stroke-width="4" stroke-linecap="round" />
            </svg>
          </template>
        </sidenav-item>
      </li>

      <!-- 2. 作业中心 -->
      <li class="nav-item">
        <sidenav-item to="/student/my-homework" :class="getRoute() === 'my-homework' ? 'active' : ''"
          :navText="isRTL ? 'مركز العمليات' : '作业中心'">
          <template v-slot:icon>
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
              style="min-width: 20px !important; min-height: 20px !important;">
              <path d="M5 6H39C39 6 43 8 43 13C43 18 39 20 39 20H5C5 20 9 18 9 13C9 8 5 6 5 6Z" fill="#65CB8F"
                stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M43 28H9C9 28 5 30 5 35C5 40 9 42 9 42H43C43 42 39 40 39 35C39 30 43 28 43 28Z" fill="#65CB8F"
                stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
        </sidenav-item>
      </li>

      <!-- 3. 学情分析 -->
      <li class="nav-item">
        <sidenav-item to="/student/analytics" :class="getRoute() === 'analytics' ? 'active' : ''"
          :navText="isRTL ? 'تحليل الحالة التعليمية' : '学情分析'">
          <template v-slot:icon>
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
              style="min-width: 20px !important; min-height: 20px !important;">
              <path d="M44 5H3.99998V17H44V5Z" fill="#65CB8F" stroke="#333" stroke-width="4" stroke-linejoin="round" />
              <path d="M3.99998 41.0301L16.1756 28.7293L22.7549 35.0301L30.7982 27L35.2786 31.368" stroke="#333"
                stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M44 16.1719V42.1719" stroke="#333" stroke-width="4" stroke-linecap="round" />
              <path d="M3.99998 16.1719V30.1719" stroke="#333" stroke-width="4" stroke-linecap="round" />
              <path d="M13.0155 43H44" stroke="#333" stroke-width="4" stroke-linecap="round" />
              <path d="M17 11H38" stroke="#FFF" stroke-width="4" stroke-linecap="round" />
              <path d="M9.99998 10.9966H11" stroke="#FFF" stroke-width="4" stroke-linecap="round" />
            </svg>
          </template>
        </sidenav-item>
      </li>

      <!-- 4. AI助教 -->
      <li class="nav-item">
        <sidenav-item to="/student/teaching-assistant" :class="getRoute() === 'teaching-assistant' ? 'active' : ''"
          :navText="isRTL ? 'مساعد التدريس' : 'AI助教'">
          <template v-slot:icon>
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
              style="min-width: 20px !important; min-height: 20px !important;">
              <path d="M39 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6Z" fill="#65CB8F" stroke="#333" stroke-width="4" />
              <path d="M32 24C32 28.4183 28.4183 32 24 32C19.5817 32 16 28.4183 16 24C16 19.5817 19.5817 16 24 16C28.4183 16 32 19.5817 32 24Z" fill="#77CAC3" stroke="#FFF" stroke-width="4" />
              <path d="M24 16V12" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M32 24H36" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M24 32V36" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M16 24H12" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
        </sidenav-item>
      </li>

      <!-- 4.1 知识点自测助手 -->
      <li class="nav-item">
        <sidenav-item to="/student/self-test-assistant" :class="getRoute() === 'self-test-assistant' ? 'active' : ''"
          :navText="isRTL ? 'مساعد الاختبار الذاتي' : '知识点自测助手'">
          <template v-slot:icon>
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
              style="min-width: 20px !important; min-height: 20px !important;">
              <path d="M9 6H39V42H9V6Z" fill="#65CB8F" stroke="#333" stroke-width="4"/>
              <path d="M16 19H32" stroke="#FFF" stroke-width="4" stroke-linecap="round"/>
              <path d="M16 27H32" stroke="#FFF" stroke-width="4" stroke-linecap="round"/>
              <path d="M16 35H26" stroke="#FFF" stroke-width="4" stroke-linecap="round"/>
            </svg>
          </template>
        </sidenav-item>
      </li>

      <!-- 5. 学习小组 -->
      <li class="nav-item">
        <sidenav-item to="/student/study-group" :class="getRoute() === 'study-group' ? 'active' : ''"
          :navText="isRTL ? 'مجموعة الدراسة' : '学习小组'">
          <template v-slot:icon>
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
              style="min-width: 20px !important; min-height: 20px !important;">
              <path
                d="M24 20C27.866 20 31 16.866 31 13C31 9.13401 27.866 6 24 6C20.134 6 17 9.13401 17 13C17 16.866 20.134 20 24 20Z"
                fill="#65CB8F" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 7.25488C10.1865 8.51983 9 10.6214 9 13.0002C9 15.5465 10.3596 17.7753 12.3924 19.0002"
                stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M36 7.25488C37.8135 8.51983 39 10.6214 39 13.0002C39 15.3789 37.8135 17.4806 36 18.7455"
                stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M12 40V42H36V40C36 36.2725 36 34.4087 35.391 32.9385C34.5791 30.9783 33.0217 29.4209 31.0615 28.609C29.5913 28 27.7275 28 24 28C20.2725 28 18.4087 28 16.9385 28.609C14.9783 29.4209 13.4209 30.9783 12.609 32.9385C12 34.4087 12 36.2725 12 40Z"
                fill="#65CB8F" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M43.9999 42.0001V40.8001C43.9999 36.3197 43.9999 34.0795 43.128 32.3682C42.361 30.8629 41.1371 29.6391 39.6318 28.8721"
                stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M4.00009 42.0001V40.8001C4.00009 36.3197 4.00009 34.0795 4.87204 32.3682C5.63902 30.8629 6.86287 29.6391 8.36816 28.8721"
                stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
        </sidenav-item>
      </li>

      <!-- 6. 学习资源 -->
      <li class="nav-item">
        <sidenav-item to="/student/learning-materials" :class="getRoute() === 'learning-materials' ? 'active' : ''"
          :navText="isRTL ? 'مصادر التعلم' : '学习资源'">
          <template v-slot:icon>
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
              style="min-width: 20px !important; min-height: 20px !important;">
              <path d="M32 6H22V42H32V6Z" fill="#65CB8F" stroke="#333" stroke-width="4" stroke-linejoin="round" />
              <path d="M42 6H32V42H42V6Z" fill="#65CB8F" stroke="#333" stroke-width="4" stroke-linejoin="round" />
              <path d="M10 6L18 7L14.5 42L6 41L10 6Z" fill="#65CB8F" stroke="#333" stroke-width="4"
                stroke-linejoin="round" />
              <path d="M37 18V15" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M27 18V15" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
        </sidenav-item>
      </li>

      <li class="mt-3 nav-item">
        <h6 v-if="isRTL" class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'">
          صفحات المرافق
        </h6>
        <h6 v-else class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6" :class="isRTL ? 'me-4' : 'ms-2'">
          账户设置
        </h6>
      </li>

      <li class="nav-item">
        <sidenav-item to="/student/profile" :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="isRTL ? 'حساب تعريفي' : '个人设置'">
          <template v-slot:icon>
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
              style="min-width: 20px !important; min-height: 20px !important;">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
                stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M24 23C26.7614 23 29 20.7614 29 18C29 15.2386 26.7614 13 24 13C21.2386 13 19 15.2386 19 18C19 20.7614 21.2386 23 24 23Z"
                fill="#65CB8F" stroke="#333" stroke-width="4" stroke-linejoin="round" />
              <path d="M10.022 38.332C10.3657 33.1206 14.7016 29 20 29H28C33.2914 29 37.6229 33.1097 37.9767 38.3113"
                stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>