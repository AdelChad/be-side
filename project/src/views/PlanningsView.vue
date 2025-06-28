<script setup>
import Sidebar from '../components/planning/Sidebar.vue'
import PlanningWindow from '../components/planning/PlanningWindow.vue';
</script>
<template>
  <div class="layout">
    <div class="container-message">
      <Sidebar />
      <PlanningWindow />
    </div>
  </div>
</template>

<style>
.container-message {
  display: flex;
  height:  85vh;
} 
</style>  