<template>
  <div class="app-container">
    <div class="content">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Footer from '@/components/Footer.vue';

const router = useRouter();
</script>

<style>

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}

.footer {
  background-color: #181818;
  color: white;
  padding: 40px 20px;
  width: 100%;
}
</style>
