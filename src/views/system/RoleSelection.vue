<script setup>
import { useRouter } from 'vue-router';
import ArgonButton from "@/components/ArgonButton.vue";
import { onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const body = document.getElementsByTagName("body")[0];

// 生命周期钩子
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});

onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

// 角色选择处理
const selectRole = (role) => {
  if (role === 'teacher') {
    router.push('/teacher/start');
  } else if (role === 'student') {
    router.push('/student/start');
  }
};
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-center align-items-center" style="min-height: 80vh;">
      <div class="card card-body blur shadow-blur mx-3 mx-md-4">
        <div class="text-center mb-5">
          <h1 class="text-gradient text-primary">灵犀 智能备课助手</h1>
          <h3 class="mb-0">请选择您的角色</h3>
        </div>
        
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="card h-100 role-card" @click="selectRole('teacher')">
              <div class="card-body p-4 text-center">
                <div class="icon icon-shape icon-lg bg-gradient-primary shadow text-center border-radius-lg mb-3">
                  <i class="ni ni-single-02 opacity-10"></i>
                </div>
                <h4 class="text-gradient text-primary mb-0">教师端</h4>
                <p class="mb-4">管理班级、布置作业、查看学情分析</p>
                <argon-button color="primary" variant="gradient" fullWidth>进入教师端</argon-button>
              </div>
            </div>
          </div>
          
          <div class="col-md-6 mb-4">
            <div class="card h-100 role-card" @click="selectRole('student')">
              <div class="card-body p-4 text-center">
                <div class="icon icon-shape icon-lg bg-gradient-success shadow text-center border-radius-lg mb-3">
                  <i class="ni ni-hat-3 opacity-10"></i>
                </div>
                <h4 class="text-gradient text-success mb-0">学生端</h4>
                <p class="mb-4">查看课程、完成作业、参与在线测验</p>
                <argon-button color="success" variant="gradient" fullWidth>进入学生端</argon-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.role-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.role-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: #5e72e4;
}

.text-gradient.text-primary {
  background-image: linear-gradient(310deg, #7928CA, #FF0080);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
}

.text-gradient.text-success {
  background-image: linear-gradient(310deg, #2152ff, #21d4fd);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
}
</style>