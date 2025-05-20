<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <input
        type="text"
        placeholder="Rechercher un chat..."
        class="search-input"
        v-model="searchQuery"
      />
    </div>
    <div v-for="chat in  filteredChats" :key="chat.name" class="chat-item">
      <div class="chat-name">{{ chat.name }}</div>
      <div class="chat-message">{{ chat.lastMessage }}</div>
    </div>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue'

const searchQuery = ref('')

const chats = [
  { name: 'Jessica Drew', lastMessage: 'Ok, see you later' },
  { name: 'David Moore', lastMessage: 'i don\'t remember anything 😅' },
  { name: 'Greg James', lastMessage: 'I got a job at SpaceX 🎉🚀' },
  { name: 'Emily Dorson', lastMessage: 'Table for four, 5PM. Be there.' },
  { name: 'Office Chat', lastMessage: 'Lewis: All done mate 😅' },
  { name: 'Announcements', lastMessage: 'Channel created' },
  { name: 'Little Sister', lastMessage: 'Tell mom I will be home for tea 💜' },
  { name: 'Art Class', lastMessage: 'Emily: 🎨Editorial' }
]

const filteredChats = computed(() =>
  chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

</script>

<style scoped>
.sidebar {
  width: 25%;
  background-color: white;
  border-right: 1px solid #ccc;
  overflow-y: auto;
}

.sidebar-header {
  padding: 16px;
  font-weight: bold;
  font-size: 18px;
  color: gray;
  border-bottom: 1px solid #ccc;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

.chat-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.chat-item:hover {
  background-color: #f9f9f9;
}

.chat-name {
  font-weight: 600;
  color:black;
}

.chat-message {
  font-size: 14px;
  color: gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
