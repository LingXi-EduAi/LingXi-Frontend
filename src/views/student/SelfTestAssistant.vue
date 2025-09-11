<script setup>
import '@/styles/single-card-common.css';
const aiApiUrl = process.env.VUE_APP_AI_API || 'http://68.183.234.61';
const appPath = '/chatbot/pO2LCKEFZiiBm6eA';
</script>

<template>
  <div class="container-fluid">
    <div class="row mt-2">
      <div class="col-lg-12 mb-lg">
        <div class="card z-index-2">
          <div class="single-card-container">
            <iframe
              :src="`${aiApiUrl}${appPath}`"
              style="width: 100%; height: 100%; min-height: 700px"
              frameborder="0"
              allow="microphone">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
