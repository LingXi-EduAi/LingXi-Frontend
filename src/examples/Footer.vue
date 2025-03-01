<script setup>
import { useStore } from "vuex";
const store = useStore();
</script>
<template>
  <footer class="py-3 footer">
    <div class="container-fluid">
      <div class="row align-items-center justify-content-lg-between">
        <div class="mb-4 col-lg-6 mb-lg-0">
          <div
            class="text-sm text-center copyright text-muted"
            :class="store.state.isRTL ? 'text-lg-end' : 'text-lg-start'"
          >
            ©
            {{ new Date().getFullYear() }}, made with
            <i class="fa fa-heart"></i> by
            <a
              href="https://www.creative-tim.com"
              class="font-weight-bold"
              target="_blank"
              >LingXi EduAI</a
            >
          </div>
        </div>
        <div class="col-lg-6">
          <ul
            class="nav nav-footer justify-content-center justify-content-lg-end"
          >
            <li class="nav-item">
              <a
                href="https://gitee.com/HexWarrior6/ling-xi-edu-ai-ui"
                class="nav-link text-muted"
                target="_blank"
                >LingXi EduAI</a
              >
            </li>
            <li class="nav-item">
              <a
                href="https://gitee.com/HexWarrior6/ling-xi-edu-ai-ui"
                class="nav-link text-muted"
                target="_blank"
                >About Us</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
