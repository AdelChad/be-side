<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { jwtDecode } from 'jwt-decode'
  import { selectedGroupId } from '../../stores/chat'

  const newGroupe = ref('')
  const chats = ref([])
  const searchQuery = ref('')
  const errorMessage = ref('')
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
    errorMessage.value = ''
    
    if (newGroupe.value.trim() === '') {
      errorMessage.value = 'Veuillez saisir un nom de groupe'
      return
    }

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
      errorMessage.value = 'Erreur lors de la création du groupe'
    }
  }

  function clearError() {
    if (errorMessage.value) {
      errorMessage.value = ''
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
      <div class="create-group-form">
        <input
          type="text"
          v-model="newGroupe"
          @keyup.enter="createGroupe"
          @input="clearError"
          placeholder="Nom du nouveau groupe"
          class="search-input"
          :class="{ 'error': errorMessage }"
        />
        <button @click="createGroupe" class="create-btn">
          Créer
        </button>
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
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

.create-group-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 14px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-input.error {
  border-color: #dc3545;
}

.create-btn {
  padding: 12px 24px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.create-btn:hover {
  background-color: #333333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.create-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  font-weight: normal;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
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
  color: black;
}

.chat-message {
  font-size: 14px;
  color: gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 600px) {
  .create-group-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .create-btn {
    width: 100%;
  }
}
</style>