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
/* 
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
*/

.container-message {
  display: flex;
  height:  85vh;
} 
</style>  