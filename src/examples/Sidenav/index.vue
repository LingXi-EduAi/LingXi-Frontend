<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import SidenavList from "./SidenavList.vue";
import StudentSidenavList from "./StudentSidenavList.vue";
import logo from "@/assets/img/logo-ct-dark.png";
import logoWhite from "@/assets/img/logo-ct.png";

const store = useStore();
const route = useRoute();
const isRTL = computed(() => store.state.isRTL);
const layout = computed(() => store.state.layout);
const sidebarType = computed(() => store.state.sidebarType);
const darkMode = computed(() => store.state.darkMode);

// 判断当前是否为学生端页面
const isStudentPage = computed(() => {
  // 修改判断逻辑，使用路径前缀判断
  return route.path.startsWith('/student');
});
</script>
<template>
  <div
    v-show="layout === 'default'"
    class="min-height-300 position-absolute w-100"
    :class="`${darkMode ? 'bg-transparent' : 'bg-primary'}`"
  />

  <aside
    class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
    :class="`${isRTL ? 'me-3 rotate-caret fixed-end' : 'fixed-start ms-3'}    
      ${layout === 'landing' ? 'bg-transparent shadow-none' : ' '} ${sidebarType}`"
    id="sidenav-main"
  >
    <div class="sidenav-header">
      <i
        class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true"
        id="iconSidenav"
      ></i>

      <router-link
        class="d-block h-100 w-100"
        to="/"
        style="max-width: 200px; padding: 1rem;">
        <img
          :src="darkMode || sidebarType === 'bg-default' ? logoWhite : logo"
          class="h-100 w-100"
          style="object-fit: contain;"
          alt="main_logo"
        />
      </router-link>
    </div>

    <hr class="mt-0 horizontal dark" />
    <student-sidenav-list v-if="isStudentPage" />
    <sidenav-list v-else />
  </aside>
</template>
