<script setup>
import { useRouter } from 'vue-router';
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import CategoriesList from "../components/CategoriesList.vue";
import ReportsDoughnutChart from "@/examples/Charts/ReportsDoughnutChart.vue";

const router = useRouter();
import { ref, computed } from "vue";

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
    title: "古诗词阅读",
    class: "三年一班语文",
    time: "2024/03/10 08:00 ~ 2024/03/15 20:00",
    status: 'progress'
  },
  {
    id: 2,
    title: "解方程",
    class: "三年一班数学",
    time: "2024/03/18 09:00 ~ 2024/03/25 17:00",
    status: 'pending'
  },
  {
    id: 3,
    title: "第三章单词检测",
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
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="班级管理"
                value=""
                description="遇见学习新伙伴"
                :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
                }"
                @click="router.push('/teacher/class/management')"
                style="cursor: pointer;"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="新建笔记"
                value=""
                description="整理课堂新知识"
                :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
                @click="router.push('/teacher/new-note')"
                style="cursor: pointer;"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="课件中心"
                value=""
                description="支持AI智能生成课件"
                :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
                @click="router.push('/teacher/courseware-hub')"
                style="cursor: pointer;"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="教学方案"
                value=""
                description="教学方案制定"
                :icon="{
                component: 'ni ni-cart',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
                @click="router.push('/teacher/teaching-plan')"
                style="cursor: pointer;"
            />
          </div>
        </div>
        <!-- 学情分析饼图部分 -->
        <div class="row mt-2">
          <div class="col-lg-12 mb-lg">
            <div class="card z-index-2">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h4 class="mb-2">学情分析</h4>
                </div>
              </div>
              <!-- 添加水平滚动容器 -->
              <div class="chart-container">
                <!-- 第一个饼图 -->
                <div class="chart-item">
                  <ReportsDoughnutChart
                      id="sales-distribution-1"
                      title="三年一班作业完成率"
                      :chart="{
                      labels: ['已完成', '未完成'],
                      datasets: [{
                        data: [35, 28],
                        backgroundColor: ['#1e537f','#86b9e3']
                      }]
                    }"
                  />
                </div>
                <!-- 第二个饼图 -->
                <div class="chart-item">
                  <ReportsDoughnutChart
                      id="sales-distribution-2"
                      title="三年二班作业完成率"
                      :chart="{
                      labels: ['已完成', '未完成'],
                      datasets: [{
                        data: [34, 38],
                        backgroundColor: ['#1e537f','#86b9e3']
                      }]
                    }"
                  />
                </div>
                <!-- 可以继续添加更多饼图 -->
                <div class="chart-item">
                  <ReportsDoughnutChart
                      id="sales-distribution-3"
                      title="三年三班作业完成率"
                      :chart="{
                      labels: ['已完成', '未完成'],
                      datasets: [{
                        data: [12, 23],
                        backgroundColor: ['#1e537f','#86b9e3']
                      }]
                    }"
                  />
                </div>
                <div class="chart-item">
                  <ReportsDoughnutChart
                      id="sales-distribution-4"
                      title="三年四班作业完成率"
                      :chart="{
                      labels: ['已完成', '未完成'],
                      datasets: [{
                        data: [31, 24],
                        backgroundColor: ['#1e537f','#86b9e3']
                      }]
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 作业部分 -->
        <div class="row mt-4">
          <div class="col-lg-7 mb-lg-0 mb-4">
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
          <div class="col-lg-5">
            <categories-list
                :title="'学习小组'"
                :categories="[
                {
                  icon: { component: 'ni ni-hat-3', background: 'info' },
                  label: '三年一班英语学习小组',
                  description: '5个小组 <strong>25名学生</strong>',
                },
                {
                  icon: { component: 'ni ni-books', background: 'success' },
                  label: '三年二班代数学习小组',
                  description: '4个小组 <strong>20名学生</strong>',
                },
                {
                  icon: { component: 'ni ni-ruler-pencil', background: 'warning' },
                  label: '三年三班文言文学习小组',
                  description: '6个小组 <strong>30名学生</strong>',
                },
                {
                  icon: { component: 'ni ni-atom', background: 'primary' },
                  label: '三年四班数学学习小组',
                  description: '4个小组 <strong>22名学生</strong>',
                },
                {
                  icon: { component: 'ni ni-atom', background: 'primary' },
                  label: '三年五班历史学习小组',
                  description: '4个小组 <strong>22名学生</strong>',
                },
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  overflow-x: auto;
  padding: 10px;
}

.chart-item {
  width: 300px;
  margin-right: 20px;
}

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