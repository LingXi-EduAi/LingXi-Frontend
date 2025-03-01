<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import {computed, ref} from "vue";

// 选项卡状态管理
const activeTab = ref('all');
const tabs = [
  {id: 'all', label: '全部'},
  {id: 'progress', label: '进行中'},
  {id: 'pending', label: '未开始'},
  {id: 'ended', label: '已结束'}
];

// 作业数据示例
const assignments = ref([
  {
    id: 1,
    title: "文言文阅读理解练习",
    class: "三年一班语文",
    time: "2024/03/10 08:00 ~ 2024/03/15 20:00",
    status: 'progress'
  },
  {
    id: 2,
    title: "立体几何专题训练",
    class: "三年一班数学",
    time: "2024/03/18 09:00 ~ 2024/03/25 17:00",
    status: 'pending'
  },
  {
    id: 3,
    title: "英语语法小测验",
    class: "三年一班英语",
    time: "2024/03/05 10:00 ~ 2024/03/08 18:00",
    status: 'ended'
  },
  {
    id: 4,
    title: "100以内乘除口算练习",
    class: "三年一班数学",
    time: "2024/03/15 08:00 ~ 2024/03/19 20:00",
    status: 'progress'
  },
]);

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
            />
          </div>
        </div>

        <!-- 作业列表 -->
        <div class="row mt-2">
          <div class="col-lg-12 mb-lg-0 mb-4">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <h4 class="mb-0">作业</h4>
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
                    <td class="w-50">
                      <div class="ps-3 py-2">
                        <h6 class="mb-1 text-dark">{{ assignment.title }}</h6>
                        <p class="text-sm text-muted mb-0">{{ assignment.class }}</p>
                      </div>
                    </td>
                    <td class="w-40">
                      <p class="text-sm text-muted mb-0">
                        起止时间：{{ assignment.time }}
                      </p>
                    </td>
                    <td class="text-end pe-4">
                        <span
                            class="badge badge-pill"
                            :class="statusStyles[assignment.status].class"
                        >
                          {{ statusStyles[assignment.status].text }}
                        </span>
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
  cursor: pointer;
}

.text-muted {
  color: #6c757d !important;
  font-size: 0.875rem;
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>