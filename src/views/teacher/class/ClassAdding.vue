<script setup>
import { ref, onMounted, reactive } from 'vue';
import { baseRequest } from "@/utils/api";
import { useRouter } from 'vue-router'; // 引入 router

const router = useRouter(); // 获取 router 实例

// 班级表单数据
const classForm = reactive({
  name: '',
  information: '',
  notice: '',
  classGroupingId: '',
  teacherId: ''
});

// 分组列表
const groupingList = ref([]);

// 加载状态
const isLoading = ref(false);
// 消息提示
const message = ref('');
const isSuccess = ref(true);

// 获取分组列表
const getGroupingList = async () => {
  try {
    const response = await baseRequest.post('/classGrouping/list', {});
    if (response.status === 200 && response.data && response.data.list) {
      groupingList.value = response.data.list || [];
    } else {
      message.value = response.msg || '获取班级分组列表失败';
      isSuccess.value = false;
    }
  } catch (error) {
    console.error('获取班级分组列表失败:', error);
    message.value = error.message || '获取班级分组列表失败';
    isSuccess.value = false;
  }
};

// 创建班级
const createClass = async () => {
  if (!classForm.name) {
    message.value = '请输入班级名称';
    isSuccess.value = false;
    return;
  }

  if (!classForm.classGroupingId) {
    message.value = '请选班级分组';
    isSuccess.value = false;
    return;
  }

  isLoading.value = true;
  try {
    const response = await baseRequest.post('/LXClass/add', classForm);
    if (response.status === 200) {
      message.value = '班级创建成功，即将跳转到班级管理页面...';
      isSuccess.value = true;
      // 重置表单
      classForm.name = '';
      classForm.information = '';
      classForm.notice = '';
      
      // 1秒后跳转到班级管理页面
      setTimeout(() => {
        router.push('teacher/class/management');
      }, 1000);
    } else {
      message.value = response.msg || '创建班级失败';
      isSuccess.value = false;
    }
  } catch (error) {
    console.error('创建班级失败:', error);
    message.value = error.message || '创建班级失败';
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
};

// 加入班级
const joinClassCode = ref('');
const joinClass = async () => {
  if (!joinClassCode.value || joinClassCode.value.length !== 6) {
    message.value = '请输入正确的6位班级邀请码';
    isSuccess.value = false;
    return;
  }

  // 这里添加加入班级的API调用
  // ...
};

onMounted(() => {
  // 获取分组列表
  getGroupingList();

  // 从localStorage获取用户信息
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"));
    if (userInfo) {
      classForm.teacherId = userInfo.id;
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
});
</script>

<template>
  <div class="py-2 container-fluid">
    <!-- 消息提示 -->
    <div v-if="message" :class="['alert', isSuccess ? 'alert-success' : 'alert-danger', 'mb-4']">
      {{ message }}
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <!-- 创建班级模块 -->
          <div class="col-lg-6 mb-4">
            <div class="card h-100 p-4">
              <div class="card-header p-0 bg-transparent">
                <h4 class="mb-3">创建新班级</h4>
              </div>
              <div class="card-body pt-0">
                <form @submit.prevent="createClass">
                  <div class="mb-3">
                    <label class="form-label">班级名称</label>
                    <input type="text" class="form-control" placeholder="请输入班级名称" v-model="classForm.name">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">选择班级分组</label>
                    <select class="form-select" v-model="classForm.classGroupingId">
                      <option value="">请选择班级分组</option>
                      <option v-for="group in groupingList" :key="group.id" :value="group.id">
                        {{ group.name }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">班级信息</label>
                    <textarea class="form-control" rows="3" placeholder="请输入班级信息"
                      v-model="classForm.information"></textarea>
                  </div>
                  <div class="mb-4">
                    <label class="form-label">班级公告</label>
                    <textarea class="form-control" rows="3" placeholder="请输入班级公告" v-model="classForm.notice"></textarea>
                  </div>
                  <button class="btn bg-gradient-primary w-100" type="submit" :disabled="isLoading">
                    {{ isLoading ? '创建中...' : '立即创建' }}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- 加入班级模块 -->
          <div class="col-lg-6 mb-4">
            <div class="card h-100 p-4">
              <div class="card-header p-0 bg-transparent">
                <h4 class="mb-3">加入现有班级</h4>
              </div>
              <div class="card-body pt-0">
                <form @submit.prevent="joinClass">
                  <div class="mb-4">
                    <label class="form-label">班级邀请码</label>
                    <input type="text" class="form-control" placeholder="请输入6位班级邀请码" v-model="joinClassCode"
                      maxlength="6">
                  </div>
                  <button class="btn bg-gradient-success w-100" type="submit" :disabled="isLoading">
                    {{ isLoading ? '加入中...' : '立即加入' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 0 2.5rem 0 rgba(136, 152, 170, 0.25);
}

.btn {
  font-weight: 600;
  letter-spacing: 0.025em;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.alert {
  transition: all 0.3s ease;
}
</style>