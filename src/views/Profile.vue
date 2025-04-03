<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount, ref, reactive } from "vue";
import { useStore } from "vuex";
import { baseRequest } from "@/utils/api"; // 导入 baseRequest

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const body = document.getElementsByTagName("body")[0];
const store = useStore();

// 用户信息
const userInfo = ref({
  id: "",
  userId: "",
  name: "",
  age: "",
  phoneNumber: "",
  email: "",
  createTime: "",
  state: "",
  version: ""
});

// 编辑状态的用户信息
const editUserInfo = ref({});

// 加载状态
const isLoading = ref(false);
// 消息提示
const message = ref("");
const isSuccess = ref(true);

// 当前激活的标签页
const activeTab = ref('profile');

// 修改密码相关数据
const passwordForm = reactive({
  phoneNumber: '',
  code: '',
  password: '',
  confirmPassword: ''
});

// 验证码倒计时
const countdown = ref(0);
const countdownTimer = ref(null);

// 获取用户信息
const getUserInfo = async () => {
  isLoading.value = true;
  try {
    const response = await baseRequest.post("/customer/detail", {});
    if (response.status === 200) {
      userInfo.value = response.data;
      // 复制一份用于编辑
      editUserInfo.value = { ...response.data };
      // 设置修改密码表单的手机号
      passwordForm.phoneNumber = response.data.phoneNumber || '';
    } else {
      message.value = response.msg || "获取用户信息失败";
      isSuccess.value = false;
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
    message.value = error.message || "获取用户信息失败";
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
};

// 保存用户信息
const saveUserInfo = async () => {
  isLoading.value = true;
  try {
    const response = await baseRequest.post("/customer/edit", editUserInfo.value);
    if (response.status === 200) {
      message.value = "保存成功";
      isSuccess.value = true;
      // 重新获取用户信息
      await getUserInfo();
    } else {
      message.value = response.msg || "保存失败";
      isSuccess.value = false;
    }
  } catch (error) {
    console.error("保存用户信息失败:", error);
    message.value = error.message || "保存失败";
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
};

// 发送验证码
const sendVerificationCode = async () => {
  if (countdown.value > 0) return;

  try {
    isLoading.value = true;
    const response = await baseRequest.post('/sms/send', null, {
      params: {
        phoneNumber: passwordForm.phoneNumber
      }
    });

    if (response.status === 200) {
      message.value = "验证码已发送";
      isSuccess.value = true;

      // 开始倒计时
      countdown.value = 60;
      countdownTimer.value = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(countdownTimer.value);
        }
      }, 1000);
    } else {
      message.value = response.msg || "发送验证码失败";
      isSuccess.value = false;
    }
  } catch (error) {
    console.error("发送验证码失败:", error);
    message.value = error.message || "发送验证码失败";
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
};

// 修改密码
const changePassword = async () => {
  // 表单验证
  if (!passwordForm.phoneNumber) {
    message.value = "请输入手机号";
    isSuccess.value = false;
    return;
  }

  if (!passwordForm.code) {
    message.value = "请输入验证码";
    isSuccess.value = false;
    return;
  }

  if (!passwordForm.password) {
    message.value = "请输入新密码";
    isSuccess.value = false;
    return;
  }

  if (passwordForm.password !== passwordForm.confirmPassword) {
    message.value = "两次输入的密码不一致";
    isSuccess.value = false;
    return;
  }

  try {
    isLoading.value = true;
    const response = await baseRequest.post("/customer/editPassword", {
      phoneNumber: passwordForm.phoneNumber,
      code: passwordForm.code,
      password: passwordForm.password
    });

    if (response.status === 200) {
      message.value = "密码修改成功";
      isSuccess.value = true;

      // 清空表单
      passwordForm.code = '';
      passwordForm.password = '';
      passwordForm.confirmPassword = '';
    } else {
      message.value = response.msg || "密码修改失败";
      isSuccess.value = false;
    }
  } catch (error) {
    console.error("密码修改失败:", error);
    message.value = error.message || "密码修改失败";
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
};

// 切换标签页
const switchTab = (tab) => {
  activeTab.value = tab;
};

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
  // 获取用户信息
  getUserInfo();
});

onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = false;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
});

onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  body.classList.remove("profile-overview");

  // 清除定时器
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
  }
});
</script>
<template>
  <main>
    <div class="container-fluid">
      <div class="page-header min-height-300" style="
          background-image: url(&quot;https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80&quot;);
          margin-right: -24px;
          margin-left: -34%;
        ">
        <span class="mask bg-gradient-success opacity-6"></span>
      </div>
      <div class="card shadow-lg mt-n6">
        <div class="card-body p-3">
          <div class="row gx-4">
            <div class="col-auto">
              <div class="avatar avatar-xl position-relative">
                <img src="../assets/img/team-1.jpg" alt="profile_image" class="shadow-sm w-100 border-radius-lg" />
              </div>
            </div>
            <div class="col-auto my-auto">
              <div class="h-100">
                <h5 class="mb-1">{{ userInfo.name || '用户名' }}</h5>
                <p class="mb-0 font-weight-bold text-sm">用户ID: {{ userInfo.userId || '-' }}</p>
              </div>
            </div>
            <div class="mx-auto mt-3 col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0">
              <div class="nav-wrapper position-relative end-0">
                <ul class="p-1 bg-transparent nav nav-pills nav-fill" role="tablist">
                  <li class="nav-item">
                    <a class="px-0 py-1 mb-0 nav-link" :class="{ 'active': activeTab === 'profile' }"
                      data-bs-toggle="tab" href="javascript:;" role="tab" aria-selected="true"
                      @click="switchTab('profile')">
                      <svg class="text-dark" width="16px" height="16px" viewBox="0 0 42 42" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g transform="translate(-2319.000000, -291.000000)" fill="#FFFFFF" fill-rule="nonzero">
                            <g transform="translate(1716.000000, 291.000000)">
                              <g transform="translate(603.000000, 0.000000)">
                                <path class="color-background"
                                  d="M22.7597136,19.3090182 L38.8987031,11.2395234 C39.3926816,10.9925342 39.592906,10.3918611 39.3459167,9.89788265 C39.249157,9.70436312 39.0922432,9.5474453 38.8987261,9.45068056 L20.2741875,0.1378125 L20.2741875,0.1378125 C19.905375,-0.04725 19.469625,-0.04725 19.0995,0.1378125 L3.1011696,8.13815822 C2.60720568,8.38517662 2.40701679,8.98586148 2.6540352,9.4798254 C2.75080129,9.67332903 2.90771305,9.83023153 3.10122239,9.9269862 L21.8652864,19.3090182 C22.1468139,19.4497819 22.4781861,19.4497819 22.7597136,19.3090182 Z" />
                                <path class="color-background"
                                  d="M23.625,22.429159 L23.625,39.8805372 C23.625,40.4328219 24.0727153,40.8805372 24.625,40.8805372 C24.7802551,40.8805372 24.9333778,40.8443874 25.0722402,40.7749511 L41.2741875,32.673375 L41.2741875,32.673375 C41.719125,32.4515625 42,31.9974375 42,31.5 L42,14.241659 C42,13.6893742 41.5522847,13.241659 41,13.241659 C40.8447549,13.241659 40.6916418,13.2778041 40.5527864,13.3472318 L24.1777864,21.5347318 C23.8390024,21.7041238 23.625,22.0503869 23.625,22.429159 Z"
                                  opacity="0.7" />
                                <path class="color-background"
                                  d="M20.4472136,21.5347318 L1.4472136,12.0347318 C0.953235098,11.7877425 0.352562058,11.9879669 0.105572809,12.4819454 C0.0361450918,12.6208008 6.47121774e-16,12.7739139 0,12.929159 L0,30.1875 L0,30.1875 C0,30.6849375 0.280875,31.1390625 0.7258125,31.3621875 L19.5528096,40.7750766 C20.0467945,41.0220531 20.6474623,40.8218132 20.8944388,40.3278283 C20.963859,40.1889789 21,40.0358742 21,39.8806379 L21,22.429159 C21,22.0503869 20.7859976,21.7041238 20.4472136,21.5347318 Z"
                                  opacity="0.7" />
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span class="ms-1">个人资料</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="px-0 py-1 mb-0 nav-link" :class="{ 'active': activeTab === 'password' }"
                      data-bs-toggle="tab" href="javascript:;" role="tab" aria-selected="false"
                      @click="switchTab('password')">
                      <svg class="text-dark" width="16px" height="16px" viewBox="0 0 40 44" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g transform="translate(-1870.000000, -591.000000)" fill="#FFFFFF" fill-rule="nonzero">
                            <g transform="translate(1716.000000, 291.000000)">
                              <g transform="translate(154.000000, 300.000000)">
                                <path class="color-background"
                                  d="M40,40 L36.3636364,40 L36.3636364,3.63636364 L5.45454545,3.63636364 L5.45454545,0 L38.1818182,0 C39.1854545,0 40,0.814545455 40,1.81818182 L40,40 Z"
                                  opacity="0.603585379"></path>
                                <path class="color-background"
                                  d="M30.9090909,7.27272727 L1.81818182,7.27272727 C0.814545455,7.27272727 0,8.08727273 0,9.09090909 L0,41.8181818 C0,42.8218182 0.814545455,43.6363636 1.81818182,43.6363636 L30.9090909,43.6363636 C31.9127273,43.6363636 32.7272727,42.8218182 32.7272727,41.8181818 L32.7272727,9.09090909 C32.7272727,8.08727273 31.9127273,7.27272727 30.9090909,7.27272727 Z M18.1818182,34.5454545 L7.27272727,34.5454545 L7.27272727,30.9090909 L18.1818182,30.9090909 L18.1818182,34.5454545 Z M25.4545455,27.2727273 L7.27272727,27.2727273 L7.27272727,23.6363636 L25.4545455,23.6363636 L25.4545455,27.2727273 Z M25.4545455,20 L7.27272727,20 L7.27272727,16.3636364 L25.4545455,16.3636364 L25.4545455,20 Z">
                                </path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span class="ms-1">修改密码</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-4 container-fluid">
      <!-- 消息提示 -->
      <div v-if="message" :class="['alert', isSuccess ? 'alert-success' : 'alert-danger', 'mb-4']">
        {{ message }}
      </div>

      <div class="row">
        <!-- 左侧卡片区域 -->
        <div class="col-md-8">
          <!-- 个人资料卡片 -->
          <div v-if="activeTab === 'profile'" class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">编辑个人资料</p>
                <argon-button color="success" size="sm" class="ms-auto" @click="saveUserInfo" :disabled="isLoading">
                  {{ isLoading ? '保存中...' : '保存' }}
                </argon-button>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">基本信息</p>
              <div class="row">
                <div class="col-md-6">
                  <label class="form-control-label">用户ID</label>
                  <argon-input type="text" v-model="editUserInfo.userId" />
                </div>
                <div class="col-md-6">
                  <label class="form-control-label">姓名</label>
                  <argon-input type="text" v-model="editUserInfo.name" />
                </div>
                <div class="col-md-6">
                  <label class="form-control-label">年龄</label>
                  <argon-input type="number" v-model="editUserInfo.age" />
                </div>
                <div class="col-md-6">
                  <label class="form-control-label">账号类型</label>
                  <select class="form-control" v-model="editUserInfo.state">
                    <option value="1">教师</option>
                    <option value="2">学生</option>
                    <option value="3">其他</option>
                  </select>
                </div>
              </div>
              <hr class="horizontal dark" />
              <p class="text-uppercase text-sm">联系方式</p>
              <div class="row">
                <div class="col-md-6">
                  <label class="form-control-label">手机号码</label>
                  <argon-input type="tel" v-model="editUserInfo.phoneNumber" />
                </div>
                <div class="col-md-6">
                  <label class="form-control-label">电子邮箱</label>
                  <argon-input type="email" v-model="editUserInfo.email" />
                </div>
              </div>
              <hr class="horizontal dark" />
              <p class="text-uppercase text-sm">系统信息</p>
              <div class="row">
                <div class="col-md-6">
                  <label class="form-control-label">创建时间</label>
                  <div class="form-control bg-light">{{ userInfo.createTime || '-' }}</div>
                </div>
                <div class="col-md-6">
                  <label class="form-control-label">版本</label>
                  <div class="form-control bg-light">{{ userInfo.version || '-' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 修改密码卡片 -->
          <div v-if="activeTab === 'password'" class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">修改密码</p>
                <argon-button color="success" size="sm" class="ms-auto" @click="changePassword" :disabled="isLoading">
                  {{ isLoading ? '提交中...' : '修改密码' }}
                </argon-button>
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">验证手机号</p>
              <div class="row">
                <div class="col-md-6">
                  <label class="form-control-label">手机号码</label>
                  <argon-input type="tel" v-model="passwordForm.phoneNumber" />
                </div>
                <div class="col-md-6">
                  <label class="form-control-label">验证码</label>
                  <div class="d-flex">
                    <argon-input type="text" v-model="passwordForm.code" class="flex-grow-1 me-2" />
                    <button class="btn btn-primary" type="button" @click="sendVerificationCode"
                      :disabled="countdown > 0 || isLoading" style="height: 40px; white-space: nowrap;">
                      {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
                    </button>
                  </div>
                </div>
              </div>
              <hr class="horizontal dark" />
              <p class="text-uppercase text-sm">设置新密码</p>
              <div class="row">
                <div class="col-md-6">
                  <label class="form-control-label">新密码</label>
                  <argon-input type="password" v-model="passwordForm.password" />
                </div>
                <div class="col-md-6">
                  <label class="form-control-label">确认新密码</label>
                  <argon-input type="password" v-model="passwordForm.confirmPassword" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧个人资料卡片 -->
        <div class="col-md-4">
          <div class="card card-profile">
            <img src="../assets/img/bg-profile.jpg" alt="Image placeholder" class="card-img-top">
            <div class="row justify-content-center">
              <div class="col-4 col-lg-4 order-lg-2">
                <div class="mt-n4 mt-lg-n6 mb-4 mb-lg-0">
                  <a href="javascript:;">
                    <img src="../assets/img/team-1.jpg" class="rounded-circle img-fluid border border-2 border-white">
                  </a>
                </div>
              </div>
            </div>
            <div class="card-body pt-0">
              <div class="text-center mt-4">
                <h5>{{ userInfo.name || '用户名' }}</h5>
                <div class="h6 font-weight-300">
                  <i class="ni location_pin mr-2"></i>用户ID: {{ userInfo.userId || '-' }}
                </div>
                <div class="h6 mt-3">
                  <i class="ni business_briefcase-24 mr-2"></i>联系方式
                </div>
              </div>
              <div class="mt-3 py-2 border-top text-center">
                <div class="row">
                  <div class="col-12">
                    <div class="d-flex justify-content-center">
                      <div class="d-grid text-center mx-3">
                        <span class="text-lg font-weight-bolder">📱</span>
                        <span class="text-sm text-muted">{{ userInfo.phoneNumber || '-' }}</span>
                      </div>
                      <div class="d-grid text-center mx-3">
                        <span class="text-lg font-weight-bolder">📧</span>
                        <span class="text-sm text-muted">{{ userInfo.email || '-' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-3 py-2 border-top">
                <div class="row align-items-center">
                  <div class="col-6">
                    <h6 class="mb-0">创建时间</h6>
                  </div>
                  <div class="col-6 text-end">
                    <span class="text-sm text-muted">{{ userInfo.createTime || '-' }}</span>
                  </div>
                </div>
                <div class="row align-items-center mt-3">
                  <div class="col-6">
                    <h6 class="mb-0">账号类型</h6>
                  </div>
                  <div class="col-6 text-end">
                    <span :class="['badge',
                      userInfo.state === '1' ? 'bg-primary' :
                        userInfo.state === '2' ? 'bg-info' : 'bg-secondary']">
                      {{ userInfo.state === '1' ? '教师' :
                        userInfo.state === '2' ? '学生' : '其他' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.alert {
  transition: all 0.3s ease;
}
</style>
