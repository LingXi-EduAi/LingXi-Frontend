<script setup>
import { useRouter } from 'vue-router';
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import CategoriesList from "./components/CategoriesList.vue";
import ReportsDoughnutChart from "@/examples/Charts/ReportsDoughnutChart.vue";
import ArgonCheckbox from "@/components/ArgonCheckbox.vue";

const assignments = {
  math: {
    subject: "数学",
    deadline: "2023-10-15",
    completed: false,
    content: "第三章习题1-10，课后思考题",
  },
  chinese: {
    subject: "语文",
    deadline: "2023-10-14",
    completed: true,
    content: "古诗文背诵，阅读理解练习",
  },
  english: {
    subject: "英语",
    deadline: "2023-10-16",
    completed: false,
    content: "单元测试卷，听力练习",
  },
  science: {
    subject: "科学",
    deadline: "2023-10-13",
    completed: true,
    content: "实验报告，课后习题",
  },
};

const router = useRouter();
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="我的课程"
                value=""
                description="查看所有课程内容"
                :icon="{
                component: 'ni ni-books',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
                }"
                @click="router.push('/my-courses')"
                style="cursor: pointer;"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="我的作业"
                value=""
                description="查看和提交作业"
                :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
                @click="router.push('/my-homework')"
                style="cursor: pointer;"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="学习资料"
                value=""
                description="浏览课程学习资料"
                :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
                @click="router.push('/learning-materials')"
                style="cursor: pointer;"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="在线测验"
                value=""
                description="参与课程在线测验"
                :icon="{
                component: 'ni ni-hat-3',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
                @click="router.push('/online-quiz')"
                style="cursor: pointer;"
            />
          </div>
        </div>
        <!-- 学习进度部分 -->
        <div class="row mt-2">
          <div class="col-lg-12 mb-lg">
            <div class="card z-index-2">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h4 class="mb-2">我的学习进度</h4>
                </div>
              </div>
              <!-- 添加水平滚动容器 -->
              <div class="chart-container">
                <!-- 第一个饼图 -->
                <div class="chart-item">
                  <ReportsDoughnutChart
                      id="progress-math"
                      title="数学课程完成率"
                      :chart="{
                      labels: ['已完成', '未完成'],
                      datasets: [{
                        data: [75, 25],
                        backgroundColor: ['#4BB543', '#FF6B6B']
                      }]
                    }"
                  />
                </div>
                <!-- 第二个饼图 -->
                <div class="chart-item">
                  <ReportsDoughnutChart
                      id="progress-chinese"
                      title="语文课程完成率"
                      :chart="{
                      labels: ['已完成', '未完成'],
                      datasets: [{
                        data: [60, 40],
                        backgroundColor: ['#4BB543', '#FF6B6B']
                      }]
                    }"
                  />
                </div>
                <!-- 更多饼图 -->
                <div class="chart-item">
                  <ReportsDoughnutChart
                      id="progress-english"
                      title="英语课程完成率"
                      :chart="{
                      labels: ['已完成', '未完成'],
                      datasets: [{
                        data: [45, 55],
                        backgroundColor: ['#4BB543', '#FF6B6B']
                      }]
                    }"
                  />
                </div>
                <div class="chart-item">
                  <ReportsDoughnutChart
                      id="progress-science"
                      title="科学课程完成率"
                      :chart="{
                      labels: ['已完成', '未完成'],
                      datasets: [{
                        data: [80, 20],
                        backgroundColor: ['#4BB543', '#FF6B6B']
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
                <div class="d-flex justify-content-between">
                  <h4 class="mb-2">作业状态</h4>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table align-items-center">
                  <tbody>
                  <tr v-for="(assignment, index) in assignments" :key="index">
                    <td class="w-10">
                      <div class="px-2 py-1 d-flex align-items-center">
                        <div>
                          <argon-checkbox :id="'assignment-' + index" :checked="assignment.completed" />
                        </div>
                      </div>
                    </td>
                    <td class="w-30">
                      <div class="px-2 py-1 d-flex align-items-center">
                        <div>
                          <p class="mb-0 text-xs font-weight-bold">科目:</p>
                          <h6 class="mb-0 text-sm">{{ assignment.subject }}</h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="text-center">
                        <p class="mb-0 text-xs font-weight-bold">截止日期:</p>
                        <h6 class="mb-0 text-sm">{{ assignment.deadline }}</h6>
                      </div>
                    </td>
                    <td class="text-sm align-middle">
                      <div class="text-center col">
                        <p class="mb-0 text-xs font-weight-bold">作业内容:</p>
                        <h6 class="mb-0 text-sm">{{ assignment.content }}</h6>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <categories-list
                :categories="[
                {
                  icon: { component: 'ni ni-notification-70', background: 'dark' },
                  label: '课程通知',
                  description: '3条新通知 <strong>查看全部</strong>',
                },
                {
                  icon: { component: 'ni ni-calendar-grid-58', background: 'dark' },
                  label: '近期考试',
                  description: '数学期中考试 <strong>10月20日</strong>',
                },
                {
                  icon: { component: 'ni ni-badge', background: 'dark' },
                  label: '我的成绩',
                  description: '最近测验: <strong>90分</strong>',
                },
                {
                  icon: { component: 'ni ni-satisfied', background: 'dark' },
                  label: '学习成就',
                  description: '已获得 <strong>5个</strong> 徽章',
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
</style>