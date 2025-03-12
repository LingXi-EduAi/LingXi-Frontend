<script setup>
</script>

<template>
  <div class="container-fluid">
    <div class="row mt-2">
      <div class="col-lg-12 mb-lg">
        <div class="card z-index-2">
          <div class="iframe-container">
            <iframe
                src="http://123.207.27.32/chatbot/9PyjHnFCDnNeJThp"
                frameborder="0"
                allow="microphone"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
  height: 100%;
  border: none;
  display: block;
}
</style>