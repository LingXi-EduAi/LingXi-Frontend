<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import ReportsDoughnutChart from "@/examples/Charts/ReportsDoughnutChart.vue";
import BarChart from "@/examples/Charts/BarChart.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import { ref, onMounted } from 'vue';
import { baseRequest } from "@/utils/api";

// 响应式数据
const loading = ref(true);
const completionRate = ref(0);
const averageScore = ref(0);
const totalSubmissions = ref(0);
const gradedCount = ref(0);
const gradeDistribution = ref({
  labels: ['优秀(90-100)', '良好(80-89)', '及格(60-79)', '不及格(<60)'],
  data: [0, 0, 0, 0]
});
const topStudents = ref([]);
const studentsNeedAttention = ref([]);
const weakPointsCount = ref(0);
const weakPoints = ref([]);
const showWeakPointsModal = ref(false);

// 固定数据（暂时保留）
const progressStats = {
  labels: ['第一单元', '第二单元', '第三单元', '第四单元'],
  data: [85, 78, 92, 65]
};

const learningTrend = {
  labels: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周'],
  data: [65, 70, 68, 75, 82, 88]
};

const engagement = {
  labels: ['课堂提问', '小组讨论', '课后作业', '在线互动'],
  data: [65, 80, 75, 60]
};

const questionAnalysis = [
  {
    topic: "数学基础",
    correctRate: "85%",
    avgTime: "2分30秒",
    difficulty: "中等",
    recommendation: "可适当增加难度"
  },
  {
    topic: "应用题",
    correctRate: "62%",
    avgTime: "4分15秒",
    difficulty: "较难",
    recommendation: "需要加强训练"
  },
  {
    topic: "几何理解",
    correctRate: "78%",
    avgTime: "3分10秒",
    difficulty: "中等",
    recommendation: "巩固基础概念"
  },
  {
    topic: "代数运算",
    correctRate: "72%",
    avgTime: "3分45秒",
    difficulty: "中等",
    recommendation: "注重计算能力"
  }
];

// 时间筛选功能
const timeFilters = ref([
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '本学期', value: 'semester' }
]);
const selectedTimeFilter = ref('semester');

// 打开薄弱知识点详情模态框
const openWeakPointsModal = () => {
  showWeakPointsModal.value = true;
};

// 关闭薄弱知识点详情模态框
const closeWeakPointsModal = () => {
  showWeakPointsModal.value = false;
};

// 加载学情分析数据
const loadAnalyticsData = async () => {
  loading.value = true;
  try {
    console.log('========== 前端：开始请求学情分析数据 ==========');
    const response = await baseRequest.post('/analytics/stats');
    console.log('前端：收到响应', response);
    console.log('前端：response.status =', response.status);
    console.log('前端：response.data =', response.data);
    
    if (response.status === 200 && response.data) {
      const data = response.data;
      console.log('前端：解析数据', data);
      
      // 更新基础统计数据
      completionRate.value = data.completionRate || 0;
      averageScore.value = data.averageScore || 0;
      totalSubmissions.value = data.totalSubmissions || 0;
      gradedCount.value = data.gradedCount || 0;
      
      console.log('前端：更新后的值');
      console.log('  - completionRate:', completionRate.value);
      console.log('  - averageScore:', averageScore.value);
      console.log('  - totalSubmissions:', totalSubmissions.value);
      console.log('  - gradedCount:', gradedCount.value);
      
      // 更新成绩分布
      if (data.gradeDistribution) {
        gradeDistribution.value = data.gradeDistribution;
        console.log('  - gradeDistribution:', gradeDistribution.value);
      }
      
      // 更新学生列表
      topStudents.value = data.topStudents || [];
      studentsNeedAttention.value = data.studentsNeedAttention || [];
      console.log('  - topStudents数量:', topStudents.value.length);
      console.log('  - studentsNeedAttention数量:', studentsNeedAttention.value.length);
      
      // 更新薄弱知识点
      weakPointsCount.value = data.weakPointsCount || 0;
      weakPoints.value = data.weakPoints || [];
      console.log('========== 前端：薄弱知识点数据 ==========');
      console.log('  - weakPointsCount:', weakPointsCount.value);
      console.log('  - weakPoints数量:', weakPoints.value.length);
      if (weakPoints.value.length > 0) {
        console.log('  - weakPoints详情:');
        weakPoints.value.forEach((point, index) => {
          console.log(`    ${index + 1}. ${point.subject} - ${point.title} (平均分: ${point.avgScore})`);
        });
      } else {
        console.warn('  ⚠️ 没有薄弱知识点数据！');
      }
      console.log('=========================================');
      
      console.log('========== 前端：数据更新完成 ==========');
    } else {
      console.error('获取学情分析数据失败 - status:', response.status);
      console.error('获取学情分析数据失败 - msg:', response.msg);
      console.error('获取学情分析数据失败 - 完整响应:', response);
    }
  } catch (error) {
    console.error('加载学情分析数据失败 - 异常:', error);
    console.error('异常详情:', error.message);
    console.error('异常堆栈:', error.stack);
  } finally {
    loading.value = false;
  }
};

// 切换时间筛选的方法
const changeTimeFilter = (filter) => {
  selectedTimeFilter.value = filter;
  // TODO: 根据时间筛选重新加载数据
  loadAnalyticsData();
};

// 页面加载时获取数据
onMounted(() => {
  loadAnalyticsData();
});
</script>

<template>
  <div class="py-2 container-fluid">
    <!-- 加载提示 -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
      <p class="mt-3 text-muted">正在加载学情分析数据...</p>
    </div>

    <!-- 主要内容 -->
    <div v-else>
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
        <mini-statistics-card 
          title="总体完成率" 
          :value="`${completionRate}%`" 
          description="作业完成情况"
          :icon="{
            component: 'ni ni-check-bold',
            background: 'bg-gradient-success',
            shape: 'rounded-circle'
          }" />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card 
          title="平均分" 
          :value="averageScore.toString()" 
          description="班级平均成绩" 
          :icon="{
            component: 'ni ni-trophy',
            background: 'bg-gradient-primary',
            shape: 'rounded-circle'
          }" />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <div @click="openWeakPointsModal" style="cursor: pointer;" title="点击查看详情">
          <mini-statistics-card 
            title="薄弱知识点" 
            :value="weakPointsCount.toString()" 
            description="需重点关注（点击查看详情）" 
            :icon="{
              component: 'ni ni-alert-circle',
              background: 'bg-gradient-warning',
              shape: 'rounded-circle'
            }" />
        </div>
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card 
          title="已批改作业" 
          :value="`${gradedCount}/${totalSubmissions}`" 
          description="作业批改进度" 
          :icon="{
            component: 'ni ni-chart-bar-32',
            background: 'bg-gradient-info',
            shape: 'rounded-circle'
          }" />
      </div>
    </div>

    <!-- 第一行：完成率饼图和成绩分布柱状图 -->
    <div class="row mt-2">
      <div class="col-lg-4">
        <ReportsDoughnutChart 
          id="completion-chart" 
          title="作业完成率" 
          height="300" 
          :chart="{
            labels: ['已完成', '未完成'],
            datasets: [{
              data: [completionRate, 100 - completionRate],
              backgroundColor: ['#7eb7e0', '#FF6B6B']
            }]
          }" />
      </div>
      <div class="col-lg-8">
        <BarChart 
          id="grade-distribution" 
          title="成绩分布" 
          height="300" 
          :chart="{
            labels: gradeDistribution.labels,
            datasets: [{
              label: '人数',
              data: gradeDistribution.data,
              backgroundColor: '#7eb7e0'
            }]
          }" />
      </div>
    </div>

    <!-- 第二行：学习进度柱状图和问题分析表格 -->
    <div class="row mt-2">
      <div class="col-lg-6 mb-lg-0 mb-4">
        <BarChart 
          id="progress-chart" 
          title="单元学习进度" 
          height="250" 
          :chart="{
            labels: progressStats.labels,
            datasets: [{
              label: '优秀率(%)',
              data: progressStats.data,
              backgroundColor: '#7eb7e0'
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
        <GradientLineChart 
          id="learning-trend" 
          title="学习趋势分析" 
          height="300" 
          :chart="{
            labels: learningTrend.labels,
            datasets: [{
              label: '平均成绩',
              data: learningTrend.data
            }]
          }" />
      </div>
      <div class="col-lg-4 mb-lg-0 mb-4">
        <ReportsDoughnutChart 
          id="engagement-chart" 
          title="学生参与度" 
          height="300" 
          :chart="{
            labels: engagement.labels,
            datasets: [{
              data: engagement.data,
              backgroundColor: ['#4CAF50', '#7eb7e0', '#FFC107', '#9C27B0']
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
    </div><!-- 关闭 v-else -->
    
    <!-- 薄弱知识点详情模态框 -->
    <div v-if="showWeakPointsModal" class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5);" @click.self="closeWeakPointsModal">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="ni ni-alert-circle text-warning me-2"></i>
              薄弱知识点详情
            </h5>
            <button type="button" class="btn-close" @click="closeWeakPointsModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="weakPoints.length === 0" class="text-center py-5">
              <i class="ni ni-check-bold text-success" style="font-size: 3rem;"></i>
              <p class="mt-3 text-muted">太棒了！目前没有薄弱知识点</p>
              <p class="text-sm text-muted">所有作业的平均分都在80分以上</p>
            </div>
            <div v-else>
              <div class="alert alert-warning mb-3">
                <i class="ni ni-bell-55 me-2"></i>
                共发现 <strong>{{ weakPoints.length }}</strong> 个薄弱知识点（平均分低于80分），建议重点关注！
              </div>
              
              <div v-for="(point, index) in weakPoints" :key="index" class="card mb-3">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 class="mb-1">
                        <span class="badge bg-gradient-secondary me-2">{{ point.subject }}</span>
                        {{ point.title }}
                      </h6>
                    </div>
                    <span class="badge" :class="point.avgScore < 50 ? 'bg-gradient-danger' : point.avgScore < 60 ? 'bg-gradient-warning' : 'bg-gradient-info'">
                      {{ point.avgScore }}分
                    </span>
                  </div>
                  
                  <div class="row mt-3">
                    <div class="col-md-6">
                      <p class="text-sm mb-1 text-muted">平均分</p>
                      <p class="text-lg font-weight-bold mb-0" :class="point.avgScore < 50 ? 'text-danger' : point.avgScore < 60 ? 'text-warning' : 'text-info'">
                        {{ point.avgScore }} 分
                      </p>
                    </div>
                    <div class="col-md-6">
                      <p class="text-sm mb-1 text-muted">提交人数</p>
                      <p class="text-lg font-weight-bold mb-0">{{ point.submissionCount }} 人</p>
                    </div>
                  </div>
                  
                  <div class="mt-3 p-2 bg-light rounded">
                    <p class="text-sm mb-1 text-dark"><strong>改进建议：</strong></p>
                    <p class="text-sm mb-0 text-muted">{{ point.suggestion }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeWeakPointsModal">关闭</button>
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