<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import ReportsDoughnutChart from "@/examples/Charts/ReportsDoughnutChart.vue";
import BarChart from "@/examples/Charts/BarChart.vue";

// 学情分析数据
const studentStats = {
  completionRate: {
    completed: 75,
    incomplete: 25
  },
  gradeDistribution: {
    labels: ['优秀(90-100)', '良好(80-89)', '及格(60-79)', '不及格(<60)'],
    data: [25, 35, 20, 10]
  },
  progressStats: {
    labels: ['第一单元', '第二单元', '第三单元', '第四单元'],
    data: [85, 78, 92, 65]
  }
};

// 问题分析数据
const questionAnalysis = [
  {
    topic: "数学基础",
    correctRate: "85%",
    avgTime: "2分30秒",
    difficulty: "中等"
  },
  {
    topic: "应用题",
    correctRate: "62%",
    avgTime: "4分15秒",
    difficulty: "较难"
  },
  {
    topic: "几何理解",
    correctRate: "78%",
    avgTime: "3分10秒",
    difficulty: "中等"
  }
];
</script>

<template>
  <div class="py-4 container-fluid">
    <!-- 概览统计卡片 -->
    <div class="row mb-4">
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card
            title="总体完成率"
            :value="`${studentStats.completionRate.completed}%`"
            description="作业完成情况"
            :icon="{
            component: 'ni ni-check-bold',
            background: 'bg-gradient-success',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card
            title="平均分"
            value="82.5"
            description="班级平均成绩"
            :icon="{
            component: 'ni ni-trophy',
            background: 'bg-gradient-primary',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card
            title="薄弱知识点"
            value="3"
            description="需重点关注"
            :icon="{
            component: 'ni ni-alert-circle',
            background: 'bg-gradient-warning',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card
            title="学习进度"
            value="75%"
            description="课程完成度"
            :icon="{
            component: 'ni ni-chart-bar-32',
            background: 'bg-gradient-info',
            shape: 'rounded-circle'
          }"
        />
      </div>
    </div>

    <!-- 第一行：完成率饼图和成绩分布柱状图 -->
    <div class="row mb-4">
      <div class="col-lg-4">
        <ReportsDoughnutChart
            id="completion-chart"
            title="作业完成率"
            :height="300"
            :chart="{
            labels: ['已完成', '未完成'],
            datasets: [{
              data: [studentStats.completionRate.completed, studentStats.completionRate.incomplete],
              backgroundColor: ['#4BB543', '#FF6B6B']
            }]
          }"
        />
      </div>
      <div class="col-lg-8">
        <BarChart
            id="grade-distribution"
            title="成绩分布"
            :height="300"
            :chart="{
            labels: studentStats.gradeDistribution.labels,
            datasets: [{
              label: '人数',
              data: studentStats.gradeDistribution.data,
              backgroundColor: '#4BB543'
            }]
          }"
        />
      </div>
    </div>

    <!-- 第二行：学习进度柱状图和问题分析表格 -->
    <div class="row mb-4">
      <div class="col-lg-6">
        <BarChart
            id="progress-chart"
            title="单元学习进度"
            :height="300"
            :chart="{
            labels: studentStats.progressStats.labels,
            datasets: [{
              label: '掌握率(%)',
              data: studentStats.progressStats.data,
              backgroundColor: '#2196F3'
            }]
          }"
        />
      </div>
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="p-3 pb-0 card-header">
            <div class="d-flex justify-content-between">
              <h6 class="mb-0">问题分析</h6>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table align-items-center">
              <tbody>
              <tr v-for="(item, index) in questionAnalysis" :key="index">
                <td class="w-30">
                  <div class="px-2 py-1 d-flex align-items-center">
                    <div class="ms-2">
                      <p class="mb-0 text-xs font-weight-bold">知识点</p>
                      <h6 class="mb-0 text-sm">{{ item.topic }}</h6>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    <p class="mb-0 text-xs font-weight-bold">正确率</p>
                    <h6 class="mb-0 text-sm">{{ item.correctRate }}</h6>
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    <p class="mb-0 text-xs font-weight-bold">平均用时</p>
                    <h6 class="mb-0 text-sm">{{ item.avgTime }}</h6>
                  </div>
                </td>
                <td class="text-sm align-middle">
                  <div class="text-center">
                    <p class="mb-0 text-xs font-weight-bold">难度</p>
                    <h6 class="mb-0 text-sm">{{ item.difficulty }}</h6>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table-responsive {
  max-height: 200px; /* 限制表格高度以适应卡片 */
}

.row {
  display: flex;
  align-items: stretch; /* 确保同一行的卡片高度一致 */
}

.col-lg-4,
.col-lg-6,
.col-lg-8 {
  display: flex; /* 使列内的卡片填满高度 */
}

.card {
  width: 100%; /* 确保卡片填满列宽 */
  margin-bottom: 0; /* 移除底部外边距 */
}
</style>