<script setup></script>

<template>
  <div class="container-fluid">
    <div class="row mt-2">
      <div class="col-lg-12 mb-lg">
        <div class="card z-index-2">
          <div class="iframe-container" id="iframe-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DocmeeUI } from "@docmee/sdk-ui";
import { onMounted } from "vue";

onMounted(() => {
  // 初始化UI
  new DocmeeUI({
    container: document.querySelector("#iframe-container"),
    page: "creator-v2",
    token: "ak_uKnjc256r36rr2G1Yp",
    mode: "light",
    lang: "zh",
    padding: "20px",
    // 从外部传入主题
    creatorData: {
      type: 1,
      // subject: "Ai行业未来10年的发展预测",
    },
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

<style scoped>
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

.card {
  border-radius: 1rem; /* 添加一致的圆角 */
  overflow: auto; /* 确保内容不会超出圆角 */
}

.iframe-container {
  width: 100%;
  height: calc(100vh - 140px); /* 动态计算高度，减去顶部和底部的大约空间 */
  position: relative;
}

iframe {
  width: 100%;
  height: calc(100% - 10px) !important;
  border: none;
  display: block;
}
</style>
