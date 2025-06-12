<script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
  import { io } from 'socket.io-client'
  import { jwtDecode } from 'jwt-decode'
  import { selectedGroupId } from '../../stores/chat'
  import Header from './Header.vue'

  const newMessage = ref('')
  const messages = ref([])
  const planning = ref([])
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

  const socket = io('http://localhost:3000', {
    auth: { token }
  })

  function joinChannel(channelId) {
    socket.emit('joinChannel', { channelId })
    socket.emit('getMessages', { channelId })
    socket.emit('getPlanning', { channelId })
    messages.value = []
  }

  watch(selectedGroupId, (newGroupId) => {
    if (newGroupId) {
      joinChannel(newGroupId)
    }
  })

  socket.on('newMessage', (message) => {
    messages.value.push({
      content: message.content,
      sent: message.author.id === userId,
      timestamp: new Date(message.createdAt).toLocaleTimeString()
    })
  })

  socket.on('channelMessages', (fetchedMessages) => {
    messages.value = fetchedMessages.map(msg => ({
      author : msg.author.firstName,
      content: msg.content,
      sent: msg.author.id === userId,
      timestamp: new Date(msg.createdAt).toLocaleTimeString()
    }))
  })

  socket.on('channelPlanning', (fetchedPlanning) => {
    planning.value = fetchedPlanning
  })

  onBeforeUnmount(() => {
    socket.disconnect()
  })

  function sendMessage() {
    if (newMessage.value.trim() === '' || !selectedGroupId.value) return

    messages.value.push({
      content: newMessage.value,
      sent: true,
      timestamp: new Date().toLocaleTimeString()
    })

    socket.emit('sendMessage', {
      channelId: selectedGroupId.value,
      content: newMessage.value
    })

    newMessage.value = ''
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
</script>

<template>
  <div class="chat-window">
    <Header />
    <div class="chat-content">
      <div class="chat-messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.sent ? 'sent' : 'received']"
        >
          <div class="author" v-if="!message.sent">{{ message.author }}</div>
          <span>{{ message.content }}</span>
          <div class="timestamp">{{ message.timestamp }}</div>
        </div>
      </div>

      <div v-if="planning.length">
        <div v-for="day in planning" class="day-card">
          <h3>{{ formatDate(day.date) }}</h3>

          <ul>
            <li>Petit déjeuner : {{ day.breakfastRestaurant?.name || 'Non défini' }}</li>
            <li>Activité du matin : {{ day.morningActivity?.name || 'Non défini' }}</li>
            <li>Activité de midi : {{ day.noondayActivity?.name || 'Non défini' }}</li>
            <li>Déjeuner : {{ day.lunchRestaurant?.name || 'Non défini' }}</li>
            <li>Après-midi : {{ day.afternoonActivity?.name || 'Non défini' }}</li>
            <li>Soirée : {{ day.eveningActivity?.name || 'Non défini' }}</li>
            <li>Dîner : {{ day.dinnerRestaurant?.name || 'Non défini' }}</li>
            <li>Nuit : {{ day.nightActivity?.name || 'Non défini' }}</li>
          </ul>
        </div>
      </div>
      <div v-else>
        <p>Aucun planning disponible.</p>
      </div>

      <div class="chat-input">
        <input
          type="text"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Écrivez votre message..."
        />
        <button @click="sendMessage">Envoyer</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-image: url('../../assets/background beside jaune.png');
  background-size: cover;
  background-position: center;
}
/* Nouvelle structure pour isoler messages + input */
.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  max-width: 60%;
  padding: 12px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.message.received { 
  background-color: white;
  color: black;
  align-self: flex-start;
}

.message.sent {
  background-color: #e99415;
  align-self: flex-end;
}

.author {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 2px;
  color: #3a3a3a;
}

.timestamp {
  font-size: 12px;
  text-align: right;
  margin-top: 4px;
  color: gray;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 12px;
  border-top: 1px solid #ccc;
  background-color: #fff;
}

.chat-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.send-button {
  margin-left: 8px;
  padding: 8px 12px;
  background-color: #e99415;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
}

.send-button:hover {
  background-color: #a27f4a;
}

</style>
