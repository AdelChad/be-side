<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { jwtDecode } from 'jwt-decode'
  import { selectedGroupId } from '../../stores/chat'

  const newGroupe = ref('')
  const chats = ref([])
  const searchQuery = ref('')
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

  async function createGroupe() {
    if (newGroupe.value.trim() === '') return

    try {
      const response = await fetch('http://localhost:3000/groupe/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          groupeName: newGroupe.value,
          users: []
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`)
      }

      const created = await response.json()

      chats.value.push({
        id: created.id,
        name: created.groupeName
      })

      newGroupe.value = ''
    } catch (error) {
      console.error('Erreur lors de la création du groupe :', error)
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
        v-model="newGroupe"
        @keyup.enter="createGroupe"
        placeholder="Nom du nouveau groupe"
        class="search-input"
      />
      <button @click="createGroupe">Créer</button>
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
