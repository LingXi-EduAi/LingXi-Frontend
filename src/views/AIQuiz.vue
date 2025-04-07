<script setup>
import '@/styles/iframe-common.css';
// 从环境变量中获取 AI API 地址
const aiApiUrl = process.env.VUE_APP_AI_API;
</script>

<template>
  <div class="container-fluid">
    <div class="row mt-2">
      <div class="col-lg-12 mb-lg">
        <div class="card z-index-2">
          <div class="iframe-container">
            <iframe
                :src="`${aiApiUrl}/completion/WIutJ7kcbxO3B9Ov`"
                frameborder="0"
                allow="microphone"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>