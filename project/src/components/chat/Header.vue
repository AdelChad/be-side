<script setup>
  import { ref, watch } from 'vue'
  import { io } from 'socket.io-client'
  import { jwtDecode } from 'jwt-decode'
  import { selectedGroupId } from '../../stores/chat'

  const token = localStorage.getItem('access_token')
  const groupName = ref('')
  const newMember = ref('')
  let userId = null

  if (token) {
    try {
      const decoded = jwtDecode(token)
      userId = decoded.sub
    } catch (e) {
      console.error('Token invalide ou corrompu', e)
    }
  }

  const socket = io('http://localhost:3000', {
    auth: { token }
  })

  watch(selectedGroupId, (newGroupId) => {
    if (newGroupId) {
      socket.emit('joinChannel', { channelId: newGroupId })
      groupName.value = ''
    }
  })

  socket.on('channelMessages', (fetchedMessages) => {
    if (fetchedMessages.length > 0) {
      groupName.value = fetchedMessages[0].channel.name
    }
  })

  async function addMember() {
    if (newMember.value.trim() === '') return

    try {
      const response = await fetch('http://localhost:3000/groupe/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          groupeId: selectedGroupId.value,
          users: [{ email: newMember.value }]
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`)
      }

      newMember.value = ''
    } catch (error) {
      console.error("Erreur lors de l'ajout du membre dans ce groupe :", error)
    }
  }
</script>

<template>
  <div class="header">
    <img
      src="https://media.gqmagazine.fr/photos/5ef0aedfcaa5a09c5304aed1/4:3/w_2119,h_1589,c_limit/friends.jpg"
      class="avatar"
    />
    <div>
      <div class="name">{{ groupName }}</div>
    </div>
    <input
      type="text"
      v-model="newMember"
      @keyup.enter="addMember"
      placeholder="Email du nouveau membre"
      class="search-input"
    />
    <button @click="addMember">Ajouter</button>
  </div>
</template>

<style scoped>
.header {
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.name {
  font-weight: bold;
  color:black;
}

.status {
  font-size: 12px;
  color: gray;
}
</style>