<script setup>
import { onBeforeUnmount, onBeforeMount, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";

import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

const store = useStore();
const router = useRouter();

// 表单数据
const form = ref({
  userId: "",
  name: "",
  email: "",
  phoneNumber: "",
  age: "",
  password: "",
  confirmPassword: "",
  state: "0"
});

// 勾选协议
const agree = ref(false);

// 提交状态与错误提示
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(1[3-9])\d{9}$/;

const validate = () => {
  if (!form.value.userId || !form.value.name || !form.value.email || !form.value.phoneNumber || !form.value.password) {
    errorMessage.value = "请填写必填项";
    return false;
  }
  if (!emailRegex.test(form.value.email)) {
    errorMessage.value = "邮箱格式不正确";
    return false;
  }
  if (!phoneRegex.test(form.value.phoneNumber)) {
    errorMessage.value = "手机号格式不正确";
    return false;
  }
  if (emailRegex.test(form.value.userId) || phoneRegex.test(form.value.userId)) {
    errorMessage.value = "用户ID不能是邮箱或手机号格式";
    return false;
  }
  if (form.value.userId && form.value.userId.length > 32) {
    errorMessage.value = "用户ID不能超过32位";
    return false;
  }
  if (form.value.password.length < 6) {
    errorMessage.value = "密码至少6位";
    return false;
  }
  if (form.value.confirmPassword !== form.value.password) {
    errorMessage.value = "两次输入的密码不一致";
    return false;
  }
  if (form.value.age && (isNaN(Number(form.value.age)) || Number(form.value.age) < 0 || Number(form.value.age) > 150)) {
    errorMessage.value = "年龄数值不合法";
    return false;
  }
  if (!agree.value) {
    errorMessage.value = "请先同意用户协议";
    return false;
  }
  errorMessage.value = "";
  return true;
};

const handleSignup = async () => {
  if (!validate()) return;
  isLoading.value = true;
  successMessage.value = "";
  try {
    const payload = {
      userId: form.value.userId.trim(),
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      phoneNumber: form.value.phoneNumber.trim(),
      age: form.value.age ? Number(form.value.age) : undefined,
      password: form.value.password,
      state: form.value.state
    };
    // 去掉 undefined 字段
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    // 匿名注册：直接使用 axios，不拼接 token
    const resp = await axios.post("/customer/add", payload);
    if (resp.data && resp.data.status === 200) {
      successMessage.value = "注册成功，请登录";
      // 1.5s 后跳转登录
      setTimeout(() => router.push("/login"), 1500);
    } else {
      errorMessage.value = (resp.data && resp.data.msg) || "注册失败";
    }
  } catch (err) {
    if (err && err.response && err.response.data && err.response.data.msg) {
      errorMessage.value = err.response.data.msg;
    } else {
      errorMessage.value = err.message || "注册失败";
    }
  } finally {
    isLoading.value = false;
  }
};

// 交互优化：任意修改表单或勾选协议时，自动清除错误提示
watch(agree, (val) => {
  if (val && errorMessage.value) {
    errorMessage.value = "";
  }
});
watch(form, () => {
  if (errorMessage.value) {
    errorMessage.value = "";
  }
}, { deep: true });

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
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBtn="bg-gradient-light" />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
      style="
        background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg&quot;);
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">Welcome!</h1>
            <p class="text-lead text-white">
              快来注册你的账户吧！
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <h3>立即注册</h3>
            </div>
            <div class="card-body" style="padding-top: 0">
              <form role="form" @submit.prevent="handleSignup">
                <div v-if="errorMessage" class="alert alert-danger mt-2">{{ errorMessage }}</div>
                <div v-if="successMessage" class="alert alert-success mt-2">{{ successMessage }}</div>

                <argon-input
                  id="userId"
                  type="text"
                  placeholder="用户ID（必填）"
                  aria-label="UserId"
                  v-model.trim="form.userId"
                />
                <argon-input
                  id="name"
                  type="text"
                  placeholder="姓名（必填）"
                  aria-label="Name"
                  v-model.trim="form.name"
                />
                <argon-input
                  id="email"
                  type="email"
                  placeholder="电子邮件（必填）"
                  aria-label="Email"
                  v-model.trim="form.email"
                />
                <argon-input
                  id="phoneNumber"
                  type="tel"
                  placeholder="手机号（必填）"
                  aria-label="PhoneNumber"
                  v-model.trim="form.phoneNumber"
                />
                <argon-input
                  id="age"
                  type="number"
                  placeholder="年龄（可选）"
                  aria-label="Age"
                  v-model.trim="form.age"
                />
                <argon-input
                  id="password"
                  type="password"
                  placeholder="密码（至少6位）"
                  aria-label="Password"
                  v-model="form.password"
                />
                <argon-input
                  id="confirmPassword"
                  type="password"
                  placeholder="确认密码"
                  aria-label="ConfirmPassword"
                  v-model="form.confirmPassword"
                />
                <argon-checkbox v-model="agree">
                  <label class="form-check-label" for="flexCheckDefault">
                    我同意
                    <a href="javascript:;" class="text-dark font-weight-bolder">用户协议</a>
                  </label>
                </argon-checkbox>
                <div class="text-center">
                  <argon-button
                    fullWidth
                    color="dark"
                    variant="gradient"
                    class="my-4 mb-2"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
                    <span v-else>注册</span>
                  </argon-button>
                </div>
                <p class="text-sm mt-3 mb-0">
                  已经有账户了？
                  <a href="javascript:;" class="text-dark font-weight-bolder" @click.prevent="router.push('/login')">登录</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <app-footer />
</template>
