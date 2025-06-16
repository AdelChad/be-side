<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { jwtDecode } from 'jwt-decode'
  import { selectedGroupId } from '../../stores/chat'

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
          groupeId: selectedGroupId,
          users: []
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`)
      }

      const created = await response.json()

      newMember.value = ''
    } catch (error) {
      console.error("Erreur lors de l'ajout du membre dans ce groupe :", error)
    }
  }
</script>

<template>
  <div class="header">
    <img src="https://images.unsplash.com/photo-1707912079134-becf5a3598e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D" class="avatar" />
    <div>
      <div class="name">David Moore</div>
      <div class="status">last seen 5 mins ago</div>
    </div>
    <input
        type="text"
        v-model="newMember"
        @keyup.enter="addMember"
        placeholder="Nom du nouveau membre"
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