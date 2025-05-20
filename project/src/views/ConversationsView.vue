<script setup>
import Sidebar from '../components/chat/Sidebar.vue'
import ChatWindow from '../components/chat/ChatWindow.vue'
import Header from '../components/chat/Header.vue'
</script>
<template>
  <div class="layout">
    <div class="container-message">
      <Sidebar />
      <ChatWindow />
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