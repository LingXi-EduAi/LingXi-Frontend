<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import {computed, ref, onMounted} from "vue";
import { useRouter } from 'vue-router';
import { baseRequest } from '@/utils/api';

const router = useRouter();

// 选项卡状态管理
const activeTab = ref('all');
const tabs = [
  {id: 'all', label: '全部'},
  {id: 'progress', label: '进行中'},
  {id: 'pending', label: '未开始'},
  {id: 'ended', label: '已结束'}
];

// 作业数据
const assignments = ref([]);
const loading = ref(false);

// 过滤作业列表
const filteredAssignments = computed(() => {
  if (activeTab.value === 'all') return assignments.value;
  return assignments.value.filter(a => a.status === activeTab.value);
});

// 状态样式配置
const statusStyles = {
  progress: {class: 'bg-success', text: '进行中'},
  pending: {class: 'bg-secondary', text: '未开始'},
  ended: {class: 'bg-danger', text: '已结束'}
};

// 格式化时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  
  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return dateTimeStr;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  } catch (error) {
    return dateTimeStr;
  }
};

// 加载作业列表
const loadAssignments = async () => {
  loading.value = true;
  try {
    const response = await baseRequest.post('/homework/assignment/list', {
      currentPage: 1,
      pageSize: 100
    });
    
    if (response.status === 200 && response.data && response.data.list) {
      assignments.value = response.data.list.map(item => ({
        ...item,
        class: `${item.subject || ''}`,
        time: `${formatDateTime(item.startTime)} ~ ${formatDateTime(item.endTime)}`
      }));
    }
  } catch (error) {
    console.error('加载作业列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 跳转到布置作业页面
const goToAssignHomework = () => {
  router.push('/teacher/assign-homework');
};

// 跳转到批改作业页面
const goToGradeHomework = () => {
  router.push('/teacher/grade-homework');
};

// 跳转到AI出题页面
const goToAIQuiz = () => {
  router.push('/teacher/ai-quiz');
};

// 更改作业状态
const changeStatus = async (assignment, newStatus) => {
  // 如果状态没有变化，不做处理
  if (assignment.status === newStatus) {
    return;
  }
  
  const statusText = {
    'pending': '未开始',
    'progress': '进行中',
    'ended': '已结束'
  };
  
  // 确认提示
  const confirmMsg = `确定要将作业"${assignment.title}"的状态改为"${statusText[newStatus]}"吗？`;
  if (!confirm(confirmMsg)) {
    // 用户取消，需要手动重置select的值
    // 通过重新加载列表来恢复原值
    await loadAssignments();
    return;
  }
  
  try {
    const response = await baseRequest.post('/homework/assignment/updateStatus', {
      id: assignment.id,
      status: newStatus,
      version: assignment.version
    });
    
    if (response.status === 200) {
      alert(`作业状态已更新为"${statusText[newStatus]}"`);
      // 重新加载列表
      await loadAssignments();
    } else {
      alert(response.msg || '更新状态失败');
      // 恢复原状态
      await loadAssignments();
    }
  } catch (error) {
    console.error('更新状态失败:', error);
    alert('更新状态失败，请稍后重试');
    // 恢复原状态
    await loadAssignments();
  }
};

onMounted(() => {
  loadAssignments();
});
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <!-- 统计卡片 -->
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="布置作业"
                value=""
                description="关联班级，布置作业"
                :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
                @click="goToAssignHomework"
                style="cursor: pointer;"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="批改作业"
                value=""
                description="筛选作业，批改作业"
                :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
                @click="goToGradeHomework"
                style="cursor: pointer;"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="AI出题"
                value=""
                description="输入知识点，智能出题"
                :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
                @click="goToAIQuiz"
                style="cursor: pointer;"
            />
          </div>
        </div>

        <!-- 作业列表 -->
        <div class="row mt-2">
          <div class="col-lg-12 mb-lg-0 mb-4">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <h4 class="mb-0" style="padding-bottom: 15px">作业</h4>
                  <div class="d-flex gap-2">
                    <button
                        v-for="tab in tabs"
                        :key="tab.id"
                        @click="activeTab = tab.id"
                        class="btn btn-sm"
                        :class="activeTab === tab.id ? 'btn-primary' : 'btn-light'"
                    >
                      {{ tab.label }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table table-hover align-items-center">
                  <tbody>
                  <tr v-for="assignment in filteredAssignments" :key="assignment.id">
                    <td class="w-40">
                      <div class="ps-3 py-2">
                        <h6 class="mb-1 text-dark">{{ assignment.title }}</h6>
                        <p class="text-sm text-muted mb-0">{{ assignment.class }}</p>
                      </div>
                    </td>
                    <td class="w-30">
                      <p class="text-sm text-muted mb-0">
                        起止时间：{{ assignment.time }}
                      </p>
                    </td>
                    <td class="w-20 text-center">
                        <span
                            class="badge badge-pill"
                            :class="statusStyles[assignment.status].class"
                        >
                          {{ statusStyles[assignment.status].text }}
                        </span>
                    </td>
                    <td class="w-10 text-end pe-4">
                      <select 
                        class="form-select form-select-sm status-select" 
                        :value="assignment.status"
                        @change="changeStatus(assignment, $event.target.value)"
                        style="min-width: 100px;"
                      >
                        <option value="pending">未开始</option>
                        <option value="progress">进行中</option>
                        <option value="ended">已结束</option>
                      </select>
                    </td>
                  </tr>
                  <tr v-if="loading">
                    <td colspan="4" class="text-center py-4">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">加载中...</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!loading && filteredAssignments.length === 0">
                    <td colspan="4" class="text-center py-4">
                      <p class="text-muted mb-0">暂无作业</p>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-light {
  border: 1px solid #dee2e6;
  color: #495057;
}

.btn-primary {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.badge-pill {
  padding: 0.5em 1em;
  border-radius: 20px;
  font-size: 0.875rem;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.text-muted {
  color: #6c757d !important;
  font-size: 0.875rem;
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.status-select {
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid #d2d6da;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.status-select:hover {
  border-color: #5e72e4;
}

.status-select:focus {
  border-color: #5e72e4;
  box-shadow: 0 0 0 0.2rem rgba(94, 114, 228, 0.25);
}
</style>