<script setup>
import { onBeforeUnmount, onBeforeMount, ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { baseRequest } from "@/utils/api";

import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

const store = useStore();
const router = useRouter();

// 表单数据
const formData = reactive({
  userId: "",
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  agreeTerms: true,
  state: "1" // 默认状态为激活
});

// 错误信息
const errors = reactive({
  userId: "",
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  agreeTerms: "",
  general: ""
});

// 注册状态
const isSubmitting = ref(false);
const registerSuccess = ref(false);

// 表单验证
const validateForm = () => {
  let isValid = true;
  
  // 重置所有错误
  Object.keys(errors).forEach(key => errors[key] = "");
  
  // 验证用户ID
  if (!formData.userId) {
    errors.userId = "账号不能为空";
    isValid = false;
  } else if (formData.userId.length > 32) {
    errors.userId = "账号过长，不能超过32位";
    isValid = false;
  }
  
  // 验证姓名
  if (!formData.name) {
    errors.name = "姓名不能为空";
    isValid = false;
  } else if (formData.name.length > 32) {
    errors.name = "姓名过长，不能超过32位";
    isValid = false;
  }
  
  // 验证邮箱
  if (!formData.email) {
    errors.email = "邮箱不能为空";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "邮箱格式错误";
    isValid = false;
  }
  
  // 验证手机号
  if (!formData.phoneNumber) {
    errors.phoneNumber = "手机号不能为空";
    isValid = false;
  } else if (!/^1[3-9]\d{9}$/.test(formData.phoneNumber)) {
    errors.phoneNumber = "手机号格式错误";
    isValid = false;
  }
  
  // 验证密码
  if (!formData.password) {
    errors.password = "密码不能为空";
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = "密码长度不能少于6位";
    isValid = false;
  }
  
  // 验证确认密码
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "两次输入的密码不一致";
    isValid = false;
  }
  
  // 验证用户协议
  if (!formData.agreeTerms) {
    errors.agreeTerms = "请同意用户协议";
    isValid = false;
  }
  
  return isValid;
};

// 提交注册
const handleRegister = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  errors.general = "";
  
  try {
    const response = await baseRequest.post("/customer/add", formData);
    
    if (response.code === 0) {
      registerSuccess.value = true;
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      errors.general = response.msg || "注册失败，请稍后再试";
    }
  } catch (error) {
    errors.general = error.message || "注册失败，请稍后再试";
  } finally {
    isSubmitting.value = false;
  }
};

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
              <!-- 成功提示 -->
              <div v-if="registerSuccess" class="alert alert-success text-white" role="alert">
                注册成功！正在跳转到登录页面...
              </div>
              
              <!-- 错误提示 -->
              <div v-if="errors.general" class="alert alert-danger text-white" role="alert">
                {{ errors.general }}
              </div>
              
              <form role="form" @submit.prevent="handleRegister">
                <!-- 用户ID -->
                <argon-input
                  id="userId"
                  type="text"
                  placeholder="账号"
                  aria-label="UserId"
                  v-model="formData.userId"
                  :error="errors.userId"
                />
                <div v-if="errors.userId" class="text-danger text-xs mb-2">{{ errors.userId }}</div>
                
                <!-- 姓名 -->
                <argon-input
                  id="name"
                  type="text"
                  placeholder="姓名"
                  aria-label="Name"
                  v-model="formData.name"
                  :error="errors.name"
                />
                <div v-if="errors.name" class="text-danger text-xs mb-2">{{ errors.name }}</div>
                
                <!-- 电子邮件 -->
                <argon-input
                  id="email"
                  type="email"
                  placeholder="电子邮件"
                  aria-label="Email"
                  v-model="formData.email"
                  :error="errors.email"
                />
                <div v-if="errors.email" class="text-danger text-xs mb-2">{{ errors.email }}</div>
                
                <!-- 手机号 -->
                <argon-input
                  id="phoneNumber"
                  type="tel"
                  placeholder="手机号"
                  aria-label="PhoneNumber"
                  v-model="formData.phoneNumber"
                  :error="errors.phoneNumber"
                />
                <div v-if="errors.phoneNumber" class="text-danger text-xs mb-2">{{ errors.phoneNumber }}</div>
                
                <!-- 密码 -->
                <argon-input
                  id="password"
                  type="password"
                  placeholder="密码"
                  aria-label="Password"
                  v-model="formData.password"
                  :error="errors.password"
                />
                <div v-if="errors.password" class="text-danger text-xs mb-2">{{ errors.password }}</div>
                
                <!-- 确认密码 -->
                <argon-input
                  id="confirmPassword"
                  type="password"
                  placeholder="确认密码"
                  aria-label="Confirm Password"
                  v-model="formData.confirmPassword"
                  :error="errors.confirmPassword"
                />
                <div v-if="errors.confirmPassword" class="text-danger text-xs mb-2">{{ errors.confirmPassword }}</div>
                
                <!-- 用户协议 -->
                <argon-checkbox v-model="formData.agreeTerms">
                  <label class="form-check-label" for="flexCheckDefault">
                    我同意
                    <a href="javascript:;" class="text-dark font-weight-bolder">用户协议</a>
                  </label>
                </argon-checkbox>
                <div v-if="errors.agreeTerms" class="text-danger text-xs mb-2">{{ errors.agreeTerms }}</div>
                
                <div class="text-center">
                  <argon-button
                    type="submit"
                    fullWidth
                    color="dark"
                    variant="gradient"
                    class="my-4 mb-2"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting">注册中...</span>
                    <span v-else>注册</span>
                  </argon-button>
                </div>
                <p class="text-sm mt-3 mb-0">
                  已经有账户了？
                  <router-link to="/login" class="text-dark font-weight-bolder">登录</router-link>
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
