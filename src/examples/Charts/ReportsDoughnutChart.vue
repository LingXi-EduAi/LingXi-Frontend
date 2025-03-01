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
      data: Array,
      backgroundColor: Array,
      extraText: Array,
    },
  },
});

onMounted(() => {
  const chartCanvas = document.getElementById(props.id).getContext("2d");

  // 销毁现有图表实例
  let existingChart = Chart.getChart(props.id);
  if (existingChart) {
    existingChart.destroy();
  }

  new Chart(chartCanvas, {
    type: 'doughnut',
    data: {
      labels: props.chart.labels,
      datasets: props.chart.datasets.map(dataset => ({
        data: dataset.data,
        backgroundColor: dataset.backgroundColor,
        borderWidth: 0,
        hoverOffset: 8,
        extraText: dataset.extraText
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom', // 修改为底部位置
          labels: {
            color: '#fbfbfb',
            font: {
              size: 12,
              family: 'Open Sans'
            },
            padding: 20,
            generateLabels: (chart) => {
              const datasets = chart.data.datasets;
              return chart.data.labels.map((label, index) => {
                const dataset = datasets[0];
                const extra = dataset.extraText && dataset.extraText[index] ? ` - ${dataset.extraText[index]}` : '';
                return {
                  text: `${label}${extra}`,
                  fillStyle: dataset.backgroundColor[index],
                  strokeStyle: dataset.backgroundColor[index],
                  lineWidth: 0,
                  hidden: isNaN(dataset.data[index]) || dataset.data[index] === null,
                  index: index
                };
              });
            }
          }
        },
        tooltip: {
          bodyFont: {
            size: 14,
            family: 'Open Sans'
          }
        }
      },
      // 添加布局调整以确保图例有足够空间
      layout: {
        padding: {
          bottom: 20 // 为底部图例留出空间
        }
      }
    }
  });
});
</script>

<template>
  <div class="card z-index-2">
    <div class="pb-0 card-header mb-0">
      <h6>{{ props.title }}</h6>
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