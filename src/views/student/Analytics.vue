<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import ReportsDoughnutChart from "@/examples/Charts/ReportsDoughnutChart.vue";
import BarChart from "@/examples/Charts/BarChart.vue";

// 学生个人学情分析数据
const personalStats = {
  completionRate: {
    completed: 85,
    incomplete: 15
  },
  scoreDistribution: {
    labels: ['优秀(90-100)', '良好(80-89)', '及格(60-79)', '不及格(<60)'],
    data: [3, 5, 2, 0] // 个人各分数段的作业/测验次数
  },
  progressStats: {
    labels: ['第一单元', '第二单元', '第三单元', '第四单元'],
    data: [95, 82, 88, 75] // 个人各单元的掌握程度
  },
  classAvgProgress: {
    labels: ['第一单元', '第二单元', '第三单元', '第四单元'],
    data: [85, 78, 82, 70] // 班级平均各单元的掌握程度
  }
};

// 班级对比数据
const classComparison = {
  personalAvg: 85, // 个人平均分
  classAvg: 78.5,  // 班级平均分
  ranking: 5,      // 班级排名
  totalStudents: 32 // 班级总人数
};

// 知识点掌握情况
const knowledgePoints = [
  {
    topic: "数学基础",
    personalRate: "92%",
    classAvgRate: "85%",
    status: "优秀"
  },
  {
    topic: "应用题",
    personalRate: "78%",
    classAvgRate: "62%",
    status: "良好"
  },
  {
    topic: "几何理解",
    personalRate: "65%",
    classAvgRate: "78%",
    status: "需加强"
  }
];

// 计算排名百分比
const rankingPercentage = Math.round((classComparison.ranking / classComparison.totalStudents) * 100);
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h4>我的学习概览</h4>
          </div>
          <div class="card-body pt-0">
            <p class="text-sm mb-0">
              你当前的学习情况良好，在班级中排名第 <span class="text-success font-weight-bold">{{ classComparison.ranking }}</span> 名，
              超过了班级 <span class="text-success font-weight-bold">{{ 100 - rankingPercentage }}%</span> 的同学。
              继续保持！
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 概览统计卡片 -->
    <div class="row mt-4">
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card
            title="作业完成率"
            :value="`${personalStats.completionRate.completed}%`"
            description="你的作业完成情况"
            :icon="{
            component: 'ni ni-check-bold',
            background: 'bg-gradient-success',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card
            title="个人平均分"
            :value="classComparison.personalAvg"
            :description="`班级平均: ${classComparison.classAvg}`"
            :icon="{
            component: 'ni ni-trophy',
            background: 'bg-gradient-primary',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card
            title="班级排名"
            :value="`${classComparison.ranking}/${classComparison.totalStudents}`"
            :description="`超过${100 - rankingPercentage}%同学`"
            :icon="{
            component: 'ni ni-user-run',
            background: 'bg-gradient-info',
            shape: 'rounded-circle'
          }"
        />
      </div>
      <div class="col-lg-3 col-md-6 col-12">
        <mini-statistics-card
            title="需加强知识点"
            value="1"
            description="几何理解需要提升"
            :icon="{
            component: 'ni ni-bulb-61',
            background: 'bg-gradient-warning',
            shape: 'rounded-circle'
          }"
        />
      </div>
    </div>

    <!-- 第一行：完成率饼图和成绩分布柱状图 -->
    <div class="row mt-3">
      <div class="col-lg-4">
        <ReportsDoughnutChart
            id="personal-completion-chart"
            title="个人作业完成率"
            :height="300"
            :chart="{
            labels: ['已完成', '未完成'],
            datasets: [{
              data: [personalStats.completionRate.completed, personalStats.completionRate.incomplete],
              backgroundColor: ['#4BB543', '#FF6B6B']
            }]
          }"
        />
      </div>
      <div class="col-lg-8">
        <BarChart
            id="personal-score-distribution"
            title="个人成绩分布"
            :height="300"
            :chart="{
            labels: personalStats.scoreDistribution.labels,
            datasets: [{
              label: '次数',
              data: personalStats.scoreDistribution.data,
              backgroundColor: '#4BB543'
            }]
          }"
        />
      </div>
    </div>

    <!-- 第二行：学习进度对比柱状图和知识点掌握表格 -->
    <div class="row mt-4">
      <div class="col-lg-6 mb-lg-0 mb-4">
        <BarChart
            id="progress-comparison-chart"
            title="单元学习进度对比"
            :height="300"
            :chart="{
            labels: personalStats.progressStats.labels,
            datasets: [
              {
                label: '个人掌握率(%)',
                data: personalStats.progressStats.data,
                backgroundColor: '#2196F3'
              },
              {
                label: '班级平均(%)',
                data: personalStats.classAvgProgress.data,
                backgroundColor: '#FF9800'
              }
            ]
          }"
        />
      </div>
      <div class="col-lg-6 mb-lg-0 mb-4">
        <div class="card h-100">
          <div class="p-3 pb-0 card-header">
            <div class="d-flex justify-content-between">
              <h6 class="mb-0">知识点掌握情况</h6>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table align-items-center">
              <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2">知识点</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2 text-center">个人掌握</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2 text-center">班级平均</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-2 text-center">状态</th>
                </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in knowledgePoints" :key="index">
                <td class="px-2">
                  <div class="py-1 d-flex align-items-center">
                    <div>
                      <h6 class="mb-0 text-sm">{{ item.topic }}</h6>
                    </div>
                  </div>
                </td>
                <td class="px-2 text-center">
                  <h6 class="mb-0 text-sm">{{ item.personalRate }}</h6>
                </td>
                <td class="px-2 text-center">
                  <h6 class="mb-0 text-sm">{{ item.classAvgRate }}</h6>
                </td>
                <td class="px-2 text-center">
                  <span class="badge" :class="{
                    'bg-gradient-success': item.status === '优秀',
                    'bg-gradient-info': item.status === '良好',
                    'bg-gradient-warning': item.status === '需加强'
                  }">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习建议 -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="p-3 pb-0 card-header">
            <h6 class="mb-0">学习建议</h6>
          </div>
          <div class="card-body p-3">
            <div class="alert alert-info text-white" role="alert">
              <strong>几何理解</strong> 是你需要加强的知识点，建议多做相关练习题，提高解题能力。
            </div>
            <div class="alert alert-success text-white" role="alert">
              <strong>数学基础</strong> 掌握得非常好，继续保持！
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
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}

.text-success {
  color: #4BB543 !important;
}

.alert {
  font-size: 0.875rem;
}
</style>