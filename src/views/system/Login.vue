<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const store = useStore();
const router = useRouter();
const body = document.getElementsByTagName("body")[0];

// 响应式状态
const userId = ref("");
const password = ref("");
const rememberMe = ref(false);
const errorMessage = ref("");
const isLoading = ref(false);

// 引入新的请求方法
import { baseRequest } from "@/utils/api";

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

// 登录提交处理
const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    // 输入验证
    if (!userId.value || !password.value) {
      errorMessage.value = "请输入用户ID和密码";
      isLoading.value = false;
      return;
    }

    // API请求
    const response = await axios.post("/token/login", {
      userId: userId.value,
      password: password.value
    });

    // 处理响应
    if (response.data.status === 200) {
      // 保存token
      const storage = rememberMe.value ? localStorage : sessionStorage;
      storage.setItem("token", response.data.data);

      // 获取用户信息 - 使用新的 baseRequest
      try {
        const userInfoResponse = await baseRequest.post("/customer/detail", {});
        if (userInfoResponse.status === 200) {
          storage.setItem("userInfo", JSON.stringify(userInfoResponse.data));
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }

      // 跳转到仪表盘
      await router.push("/");
    } else {
      errorMessage.value = response.data.msg || "登录失败";
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
};

// 错误处理
const handleError = (error) => {
  if (error.response) {
    // 服务器返回的错误
    const status = error.response.status;
    switch (status) {
      case 400:
        errorMessage.value = "请求参数错误";
        break;
      case 401:
        errorMessage.value = "身份验证失败";
        break;
      case 500:
        errorMessage.value = "服务器内部错误";
        break;
      default:
        errorMessage.value = error.response.data.msg || "请求失败";
    }
  } else if (error.request) {
    errorMessage.value = "无法连接到服务器";
  } else {
    errorMessage.value = "发生未知错误";
  }
};
</script>

<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow" :darkMode="true"
          isBtn="bg-gradient-success" />
      </div>
    </div>
  </div>

  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <!-- 登录表单 -->
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">用户登录</h4>
                  <p class="mb-0">请输入您的账号信息</p>
                </div>

                <div class="card-body">
                  <div v-if="errorMessage" class="alert alert-danger mt-3">
                    {{ errorMessage }}
                  </div>
                  <form @submit.prevent="handleLogin">
                    <!-- 用户ID输入 -->
                    <div class="mb-3">
                      <argon-input v-model.trim="userId" id="userId" type="text" placeholder="用户ID" name="userId"
                        size="lg" :disabled="isLoading" />
                    </div>

                    <!-- 密码输入 -->
                    <div class="mb-3">
                      <argon-input v-model.trim="password" id="password" type="password" placeholder="密码"
                        name="password" size="lg" :disabled="isLoading" />
                    </div>

                    <!-- 记住我开关 -->
                    <div class="form-check form-switch mb-3">
                      <argon-switch v-model="rememberMe" id="rememberMe" name="rememberMe" />
                      <label class="form-check-label" for="rememberMe">
                        保持登录状态
                      </label>
                    </div>

                    <!-- 登录按钮 -->
                    <div class="text-center">
                      <argon-button class="mt-4" variant="gradient" color="success" fullWidth size="lg"
                        :disabled="isLoading">
                        <span v-if="isLoading">
                          <span class="spinner-border spinner-border-sm" role="status"></span>
                          登录中...
                        </span>
                        <span v-else>立即登录</span>
                      </argon-button>
                    </div>
                  </form>
                </div>

                <!-- 注册链接 -->
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    没有账户？
                    <router-link to="/signup" class="text-success text-gradient font-weight-bold">
                      立即注册
                    </router-link>
                  </p>
                </div>
              </div>
            </div>

            <!-- 右侧背景图 -->
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column">
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg');
                  background-size: cover;
                ">
                <span class="mask bg-gradient-success opacity-6"></span>
                <h2 class="mt-5 text-white font-weight-bolder position-relative">
                  "智能教育平台"
                </h2>
                <hr>
                <p class="text-white position-relative">
                  智慧教学 · 个性化学习 · 数据驱动教育创新
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.alert {
  padding: 0.75rem 1.25rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: white;
}

.spinner-border {
  vertical-align: text-bottom;
}

.form-check-label {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
}
</style>