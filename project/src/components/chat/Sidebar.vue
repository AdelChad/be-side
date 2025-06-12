<script setup>
import { ref, computed, onMounted } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { selectedGroupId } from '../../stores/chat'

const searchQuery = ref('')
const chats = ref([])

const token = localStorage.getItem('access_token')
let userId = null

if (token) {
  try {
    const decoded = jwtDecode(token)
    userId = decoded.sub
  } catch (e) {
    console.error('Token invalide ou corrompu', e)
  }
}

onMounted(async () => {
  if (!token) return

  try {
    const response = await fetch(`http://localhost:3000/groupe`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`)
    }

    const data = await response.json()
    chats.value = data.map(groupe => ({
      id: groupe.id,
      name: groupe.groupeName,
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes :', error)
  }
})

const filteredChats = computed(() =>
  chats.value.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)
</script>

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
    <div
      v-for="chat in filteredChats"
      :key="chat.id"
      class="chat-item"
      @click="selectedGroupId = chat.id"
    >
      <div class="chat-name">{{ chat.name }}</div>
    </div>
  </div>
</template>

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
