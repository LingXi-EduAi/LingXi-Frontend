<script setup>
import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import CategoriesList from "./components/CategoriesList.vue";
import ReportsDoughnutChart from "@/examples/Charts/ReportsDoughnutChart.vue";
import US from "@/assets/img/icons/flags/US.png";
import DE from "@/assets/img/icons/flags/DE.png";
import GB from "@/assets/img/icons/flags/GB.png";
import BR from "@/assets/img/icons/flags/BR.png";

const sales = {
  us: {
    country: "United States",
    sales: 2500,
    value: "$230,900",
    bounce: "29.9%",
    flag: US,
  },
  germany: {
    country: "Germany",
    sales: "3.900",
    value: "$440,000",
    bounce: "40.22%",
    flag: DE,
  },
  britain: {
    country: "Great Britain",
    sales: "1.400",
    value: "$190,700",
    bounce: "23.44%",
    flag: GB,
  },
  brasil: {
    country: "Brasil",
    sales: "562",
    value: "$143,960",
    bounce: "32.14%",
    flag: BR,
  },
};
</script>

<template>
  <div class="py-2 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="新建/加入班级"
                value=""
                description="遇见学习新伙伴"
                :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
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
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
                title="学情分析"
                value=""
                description="智能分析学生学情"
                :icon="{
                component: 'ni ni-cart',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
            />
          </div>
        </div>
        <!-- 学情分析饼图部分 -->
        <div class="row">
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
                        backgroundColor: ['#4BB543', '#FF6B6B']
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
                        backgroundColor: ['#4BB543', '#FF6B6B']
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
                        backgroundColor: ['#4BB543', '#FF6B6B']
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
                  <h4 class="mb-2">作业</h4>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table align-items-center">
                  <tbody>
                  <tr v-for="(sale, index) in sales" :key="index">
                    <td class="w-30">
                      <div class="px-2 py-1 d-flex align-items-center">
                        <div>
                          <img :src="sale.flag" alt="Country flag"/>
                        </div>
                        <div class="ms-4">
                          <p class="mb-0 text-xs font-weight-bold">Country:</p>
                          <h6 class="mb-0 text-sm">{{ sale.country }}</h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="text-center">
                        <p class="mb-0 text-xs font-weight-bold">Sales:</p>
                        <h6 class="mb-0 text-sm">{{ sale.sales }}</h6>
                      </div>
                    </td>
                    <td>
                      <div class="text-center">
                        <p class="mb-0 text-xs font-weight-bold">Value:</p>
                        <h6 class="mb-0 text-sm">{{ sale.value }}</h6>
                      </div>
                    </td>
                    <td class="text-sm align-middle">
                      <div class="text-center col">
                        <p class="mb-0 text-xs font-weight-bold">Bounce:</p>
                        <h6 class="mb-0 text-sm">{{ sale.bounce }}</h6>
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
                  icon: { component: 'ni ni-mobile-button', background: 'dark' },
                  label: 'Devices',
                  description: '250 in stock <strong>346+ sold</strong>',
                },
                {
                  icon: { component: 'ni ni-tag', background: 'dark' },
                  label: 'Tickets',
                  description: '123 closed <strong>15 open</strong>',
                },
                {
                  icon: { component: 'ni ni-box-2', background: 'dark' },
                  label: 'Error logs',
                  description: '1 is active <strong>40 closed</strong>',
                },
                {
                  icon: { component: 'ni ni-satisfied', background: 'dark' },
                  label: 'Happy Users',
                  description: '+ 430',
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