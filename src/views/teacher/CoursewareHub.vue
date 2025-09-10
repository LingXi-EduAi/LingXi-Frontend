<script setup>
import { DocmeeUI } from "@docmee/sdk-ui";
import { onMounted } from "vue";
import '@/styles/single-card-common.css';

onMounted(() => {
  // 初始化UI
  new DocmeeUI({
    container: document.querySelector("#single-card-container"),
    page: "creator-v2",
    token: "ak_uKnjc256r36rr2G1Yp",
    mode: "light",
    lang: "zh",
    padding: "20px",
    themeColor: "#7eb7e0",
    hidePdfWatermark: "true",
    // 从外部传入主题
    creatorData: {
      type: 1,
      // subject: "Ai行业未来10年的发展预测",
    },
    css: `
      /* 修改进度条颜色为浅绿色 */
      .hdd-progress-bg.hdd-progress-bg-outer {
        --progress-line-stroke-color: #E0F5E9 !important;
      }
      /* 添加白色字体样式 - 仅适用于特定按钮状态 */
      .text-primary-content,
      #generatorFormSubmit.btn-primary,
      #generatorFormSubmit.btn-primary svg,
      .absolute.bg-base-100.text-info.rounded-full.px-2.flex.justify-center.items-center.w-max.bg-primary.text-primary-content,
      .\\!text-primary-content,
      .btn-primary {
        color: white !important;
        fill: white !important;
        stroke: white !important;
      }
    `,
    // 事件回调
    onMessage: (message) => {
      console.log(message);
      if (message.type === "mounted") {
        console.log("iframe挂载");
      } else if (message === "") {
        // 自己补
      }
    },
  });
});
</script>

<template>
  <div class="container-fluid">
    <div class="row mt-2">
      <div class="col-lg-12 mb-lg">
        <div class="card z-index-2">
          <div class="single-card-container" id="single-card-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>