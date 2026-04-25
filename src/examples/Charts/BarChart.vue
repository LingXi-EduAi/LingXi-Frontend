<script setup>
import { onMounted } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    default: "300",
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  chart: {
    type: Object,
    required: true,
    labels: Array,
    datasets: {
      type: Array,
      label: String,
      data: Array,
      backgroundColor: String // 添加颜色属性支持
    },
  },
});

onMounted(() => {
  const barChart = document.getElementById(props.id).getContext("2d");

  // 创建渐变背景
  const gradientBg = barChart.createLinearGradient(0, 230, 0, 50);
  gradientBg.addColorStop(1, "rgba(75, 181, 67, 0.2)"); // 绿色渐变
  gradientBg.addColorStop(0.2, "rgba(75, 181, 67, 0.0)");
  gradientBg.addColorStop(0, "rgba(75, 181, 67, 0)");

  let chartStatus = Chart.getChart(props.id);
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }

  new Chart(barChart, {
    type: "bar", // 修改为柱状图类型
    data: {
      labels: props.chart.labels,
      datasets: props.chart.datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.backgroundColor || gradientBg, // 支持自定义颜色或使用渐变
        borderColor: dataset.backgroundColor || "#4BB543",
        borderWidth: 1,
        borderRadius: 6, // 柱子圆角
        maxBarThickness: 40,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true, // 显示图例
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#666",
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            display: true,
            color: "#666",
            padding: 10,
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  });
});
</script>

<template>
  <div class="card z-index-2">
    <div class="pb-0 card-header mb-0">
      <h6>{{ props.title }}</h6>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p v-if="props.description" class="text-sm" v-html="props.description" />
    </div>
    <div class="p-3 card-body">
      <div class="chart">
        <canvas
          :id="props.id"
          class="chart-canvas"
          :height="props.height"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-canvas {
  width: 100% !important;
}
</style>