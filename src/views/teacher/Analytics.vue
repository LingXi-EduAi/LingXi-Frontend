<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import ReportsDoughnutChart from "@/examples/Charts/ReportsDoughnutChart.vue";
import BarChart from "@/examples/Charts/BarChart.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue"; // 修改为GradientLineChart
import { ref } from 'vue'; // 引入ref用于响应式数据

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
  },
  // 新增学习趋势数据
  learningTrend: {
    labels: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周'],
    data: [65, 70, 68, 75, 82, 88]
  },
  // 新增学生参与度数据
  engagement: {
    labels: ['课堂提问', '小组讨论', '课后作业', '在线互动'],
    data: [65, 80, 75, 60]
  }
};

// 问题分析数据
const questionAnalysis = [
  {
    topic: "数学基础",
    correctRate: "85%",
    avgTime: "2分30秒",
    difficulty: "中等",
    recommendation: "可适当增加难度" // 新增推荐字段
  },
  {
    topic: "应用题",
    correctRate: "62%",
    avgTime: "4分15秒",
    difficulty: "较难",
    recommendation: "需要加强训练" // 新增推荐字段
  },
  {
    topic: "几何理解",
    correctRate: "78%",
    avgTime: "3分10秒",
    difficulty: "中等",
    recommendation: "巩固基础概念" // 新增推荐字段
  },
  {
    topic: "代数运算",
    correctRate: "72%",
    avgTime: "3分45秒",
    difficulty: "中等",
    recommendation: "注重计算能力" // 新增问题分析项
  }
];

// 新增学生个体分析数据
const topStudents = [
  { name: "张三", score: 95, improvement: "+5%", strengths: "应用题解析" },
  { name: "李四", score: 92, improvement: "+3%", strengths: "几何证明" },
  { name: "王五", score: 90, improvement: "+7%", strengths: "计算速度" }
];

// 新增需要关注的学生
const studentsNeedAttention = [
  { name: "赵六", score: 58, weakness: "几何理解", suggestion: "一对一辅导" },
  { name: "钱七", score: 62, weakness: "应用题", suggestion: "提供额外练习" },
  { name: "孙八", score: 65, weakness: "代数运算", suggestion: "基础知识巩固" },
  { name: "周九", score: 70, weakness: "数学基础", suggestion: "提高数学基础" },
  { name: "吴十", score: 75, weakness: "应用题", suggestion: "提供额外练习" },
  { name: "郑十一", score: 80, weakness: "几何理解", suggestion: "巩固基础概念" },
];

// 新增时间筛选功能
const timeFilters = ref([
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本学期', value: 'semester' }
]);
const selectedTimeFilter = ref('semester');

// 切换时间筛选的方法
const changeTimeFilter = (filter) => {
  selectedTimeFilter.value = filter;
  // 这里可以添加实际的数据筛选逻辑
};
</script>

<template>
  <div class="py-2 container-fluid">
    <!-- 时间筛选器 -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body d-flex justify-content-between align-items-center">
            <h5 class="mb-0">学情分析报告</h5>
            <div class="btn-group">
              <button v-for="filter in timeFilters" :key="filter.value" class="btn btn-sm"
                :class="selectedTimeFilter === filter.value ? 'btn-primary' : 'btn-outline-primary'"
                @click="changeTimeFilter(filter.value)">
                {{ filter.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 概览统计卡片 -->
    <div class="row mt-1">
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card title="总体完成率" :value="`${studentStats.completionRate.completed}%`" description="作业完成情况"
          :icon="{
            component: 'ni ni-check-bold',
            background: 'bg-gradient-success',
            shape: 'rounded-circle'
          }" />
      </div>
      <!-- 其他统计卡片保持不变 -->
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card title="平均分" value="82.5" description="班级平均成绩" :icon="{
          component: 'ni ni-trophy',
          background: 'bg-gradient-primary',
          shape: 'rounded-circle'
        }" />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card title="薄弱知识点" value="3" description="需重点关注" :icon="{
          component: 'ni ni-alert-circle',
          background: 'bg-gradient-warning',
          shape: 'rounded-circle'
        }" />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card title="学习进度" value="75%" description="课程完成度" :icon="{
          component: 'ni ni-chart-bar-32',
          background: 'bg-gradient-info',
          shape: 'rounded-circle'
        }" />
      </div>
    </div>

    <!-- 第一行：完成率饼图和成绩分布柱状图 -->
    <div class="row mt-2">
      <!-- 现有图表保持不变 -->
      <div class="col-lg-4">
        <ReportsDoughnutChart id="completion-chart" title="作业完成率" :height="300" :chart="{
          labels: ['已完成', '未完成'],
          datasets: [{
            data: [studentStats.completionRate.completed, studentStats.completionRate.incomplete],
            backgroundColor: ['#4BB543', '#FF6B6B']
          }]
        }" />
      </div>
      <div class="col-lg-8">
        <BarChart id="grade-distribution" title="成绩分布" :height="300" :chart="{
          labels: studentStats.gradeDistribution.labels,
          datasets: [{
            label: '人数',
            data: studentStats.gradeDistribution.data,
            backgroundColor: '#4BB543'
          }]
        }" />
      </div>
    </div>

    <!-- 第二行：学习进度柱状图和问题分析表格 -->
    <div class="row mt-2">
      <div class="col-lg-6 mb-lg-0 mb-4">
        <BarChart id="progress-chart" title="单元学习进度" :height="250" :chart="{
          labels: studentStats.progressStats.labels,
          datasets: [{
            label: '掌握率(%)',
            data: studentStats.progressStats.data,
            backgroundColor: '#2196F3'
          }]
        }" />
      </div>
      <div class="col-lg-6 mb-lg-0 mb-4">
        <div class="card" style="height: 340px;">
          <div class="p-3 pb-0 card-header">
            <div class="d-flex justify-content-between">
              <h6 class="mb-0">问题分析</h6>
            </div>
          </div>
          <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
            <table class="table align-items-center">
              <thead class="sticky-top bg-white">
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">知识点</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">正确率</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">平均用时</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">难度</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">建议</th>
                </tr>
              </thead>
              <tbody>
                <!-- 表格内容保持不变 -->
                <tr v-for="(item, index) in questionAnalysis" :key="index">
                  <td>
                    <div class="px-2 py-1 d-flex align-items-center">
                      <div class="ms-2">
                        <h6 class="mb-0 text-sm">{{ item.topic }}</h6>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle text-center">
                    <span class="text-sm font-weight-bold"
                      :class="{ 'text-success': parseInt(item.correctRate) > 80, 'text-warning': parseInt(item.correctRate) > 60 && parseInt(item.correctRate) <= 80, 'text-danger': parseInt(item.correctRate) <= 60 }">
                      {{ item.correctRate }}
                    </span>
                  </td>
                  <td class="align-middle text-center">
                    <span class="text-sm font-weight-bold">{{ item.avgTime }}</span>
                  </td>
                  <td class="align-middle text-center">
                    <span class="badge badge-sm"
                      :class="item.difficulty === '较难' ? 'bg-gradient-danger' : 'bg-gradient-info'">
                      {{ item.difficulty }}
                    </span>
                  </td>
                  <td class="align-middle text-center">
                    <span class="text-sm font-weight-bold">{{ item.recommendation }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增：第三行 - 学习趋势和参与度 -->
    <div class="row mt-2">
      <div class="col-lg-8 mb-lg-0 mb-4">
        <GradientLineChart id="learning-trend" title="学习趋势分析" :height="300" :chart="{
          labels: studentStats.learningTrend.labels,
          datasets: [{
            label: '平均成绩',
            data: studentStats.learningTrend.data
          }]
        }" />
      </div>
      <div class="col-lg-4 mb-lg-0 mb-4">
        <ReportsDoughnutChart id="engagement-chart" title="学生参与度" :height="300" :chart="{
          labels: studentStats.engagement.labels,
          datasets: [{
            data: studentStats.engagement.data,
            backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0']
          }]
        }" />
      </div>
    </div>

    <!-- 新增：第四行 - 优秀学生和需要关注的学生 -->
    <div class="row mt-2">
      <div class="col-lg-6 mb-lg-0 mb-4">
        <div class="card h-100">
          <div class="p-3 pb-0 card-header">
            <div class="d-flex justify-content-between">
              <h6 class="mb-0">优秀学生表现</h6>
            </div>
          </div>
          <div class="table-responsive" style="max-height: 180px; overflow-y: auto;">
            <table class="table align-items-center">
              <thead class="sticky-top bg-white">
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">学生</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">成绩</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">进步</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">优势</th>
                </tr>
              </thead>
              <tbody>
                <!-- 表格内容保持不变 -->
                <tr v-for="(student, index) in topStudents" :key="index">
                  <td>
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ student.name }}</h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold mb-0">{{ student.score }}</p>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <span class="badge badge-sm bg-gradient-success">{{ student.improvement }}</span>
                  </td>
                  <td class="align-middle text-center">
                    <p class="text-sm font-weight-bold mb-0">{{ student.strengths }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-lg-0 mb-4">
        <div class="card h-100">
          <div class="p-3 pb-0 card-header">
            <div class="d-flex justify-content-between">
              <h6 class="mb-0">需要关注的学生</h6>
            </div>
          </div>
          <div class="table-responsive" style="max-height: 180px; overflow-y: auto;">
            <table class="table align-items-center">
              <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">学生</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">成绩</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">薄弱环节</th>
                  <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">建议</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(student, index) in studentsNeedAttention" :key="index">
                  <td>
                    <div class="d-flex px-2 py-1">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">{{ student.name }}</h6>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-sm font-weight-bold mb-0">{{ student.score }}</p>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <span class="badge badge-sm bg-gradient-warning">{{ student.weakness }}</span>
                  </td>
                  <td class="align-middle text-center">
                    <p class="text-sm font-weight-bold mb-0">{{ student.suggestion }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增：教学建议卡片 -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="p-3 pb-0 card-header">
            <h6 class="mb-0">教学建议</h6>
          </div>
          <div class="card-body">
            <div class="alert alert-info">
              <strong>整体表现：</strong> 班级整体掌握情况良好，但应用题和几何理解需要加强。
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="card bg-gradient-light">
                  <div class="card-body">
                    <h6 class="text-dark">重点关注</h6>
                    <p class="text-sm">应用题解题能力训练，提高学生实际问题分析能力</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-gradient-light">
                  <div class="card-body">
                    <h6 class="text-dark">教学调整</h6>
                    <p class="text-sm">增加小组讨论环节，促进学生间的知识交流与合作</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card bg-gradient-light">
                  <div class="card-body">
                    <h6 class="text-dark">资源推荐</h6>
                    <p class="text-sm">为学习困难学生提供针对性的辅导材料和练习</p>
                  </div>
                </div>
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}

.bg-gradient-light {
  background: linear-gradient(310deg, #f8f9fa 0%, #e9ecef 100%);
}

.alert-info {
  background-color: rgba(33, 150, 243, 0.1);
  color: #0c63e4;
  border: none;
  border-radius: 0.5rem;
}

.table {
  margin-bottom: 0 !important;
}

/* 新增样式 */
.table-responsive {
  scrollbar-width: thin;
}

.table-responsive::-webkit-scrollbar {
  width: 6px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.sticky-top {
  position: sticky;
  top: 0;
  z-index: 1;
}

.sticky-top th {
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>