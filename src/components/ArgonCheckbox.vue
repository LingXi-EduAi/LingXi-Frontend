<template>
  <div class="custom-checkbox-container" @click="toggleCheckbox">
    <span class="custom-checkbox" :class="{ 'checked': isChecked }">
      <svg
        v-if="isChecked"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="checkmark-icon"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
    <label class="custom-checkbox-label">
      <slot />
    </label>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isChecked = ref(false);

function toggleCheckbox() {
  isChecked.value = !isChecked.value;
}
</script>

<style scoped>
.custom-checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  background: white;
  border: 2px solid #5e72e4;
  border-radius: 4px;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
}

.checked {
  background: #5e72e4;
}

.checkmark-icon {
  width: 14px;
  height: 14px;
  color: white;
}

.custom-checkbox-label {
  user-select: none;
}
</style>
