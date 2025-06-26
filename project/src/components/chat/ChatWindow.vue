<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { io } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode'
import { selectedGroupId } from '../../stores/chat'
import Header from './Header.vue'

const token = localStorage.getItem('access_token')
let userId = null

if (token) {
  try {
    const decoded = jwtDecode(token)
    userId = decoded.sub
  } catch (e) {
    console.error('Token invalide', e)
  }
}

const socket = io('http://localhost:3000', { auth: { token } })

const newMessage = ref('')
const messages = ref([])
const planning = ref([])
const clashes = ref([])
const activities = ref([])
const restaurants = ref([])

const showClashModal = ref(false)
const clashType = ref('activity')
const selectedOptionA = ref(null)
const selectedOptionB = ref(null)
const searchQuery = ref('')

const votingClash = ref(null)

const filteredOptions = computed(() => {
  const options = clashType.value === 'activity' ? activities.value : restaurants.value
  return options.filter(option => option.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const activeClashes = computed(() => clashes.value.filter(c => !c.isFinished))

function joinChannel(channelId) {
  socket.emit('joinChannel', { channelId })
  socket.emit('getMessages', { channelId })
  socket.emit('getPlanning', { channelId })
  socket.emit('getClashes', { channelId: selectedGroupId.value, userId })
  socket.emit('get_all_activities', { channelId })
  socket.emit('get_all_restaurants', { channelId })

  messages.value = []
  clashes.value = []
}

watch(selectedGroupId, (newId) => {
  if (newId) joinChannel(newId)
})

onMounted(() => {
  socket.on('channelMessages', (fetchedMessages) => {
    messages.value = fetchedMessages.map(msg => ({
      author: msg.author.firstName,
      content: msg.content,
      sent: msg.author.id === userId,
      timestamp: new Date(msg.createdAt).toLocaleTimeString()
    }))
  })

  socket.on('newMessage', (message) => {
    messages.value.push({
      content: message.content,
      sent: message.author.id === userId,
      timestamp: new Date(message.createdAt).toLocaleTimeString()
    })
  })

  socket.on('channelClashes', (fetchedClashes) => {
    clashes.value = fetchedClashes.map(formatClash)
  })

  socket.on('newClash', (clash) => {
    clashes.value.push(formatClash(clash))
  })

  socket.on('clashUpdate', (updatedClash) => {
    const index = clashes.value.findIndex(c => c.id === updatedClash.id)
    if (index !== -1) {
      clashes.value[index] = formatClash(updatedClash)
      clashes.value = [...clashes.value]
    }
  })

  socket.on('all_activities', (data) => (activities.value = data))
  socket.on('all_restaurants', (data) => (restaurants.value = data))
  socket.on('channelPlanning', (data) => (planning.value = data))
})

onBeforeUnmount(() => {
  socket.disconnect()
})

function formatClash(clash) {
  return {
    id: clash.id,
    creator: clash.creator?.firstName || 'Inconnu',
    activityOptionA: clash.activityOptionA,
    activityOptionB: clash.activityOptionB,
    restaurantOptionA: clash.restaurantOptionA,
    restaurantOptionB: clash.restaurantOptionB,
    votesA: clash.votesA || 0,
    votesB: clash.votesB || 0,
    totalVotes: (clash.votesA || 0) + (clash.votesB || 0),
    userVote: clash.userVote || null,
    isFinished: clash.isFinished || false,
    timestamp: new Date(clash.createdAt).toLocaleTimeString(),
    type: clash.activityOptionA ? 'activity' : 'restaurant'
  }
}

function openClashModal() {
  showClashModal.value = true
  selectedOptionA.value = null
  selectedOptionB.value = null
  searchQuery.value = ''
}

function closeClashModal() {
  showClashModal.value = false
  selectedOptionA.value = null
  selectedOptionB.value = null
  searchQuery.value = ''
}

function selectOption(option, slot) {
  if (slot === 'A') {
    selectedOptionA.value = option
  } else {
    selectedOptionB.value = option
  }
}

function createClash() {
  if (!selectedOptionA.value || !selectedOptionB.value || !selectedGroupId.value) return

  const payload = {
    channelId: selectedGroupId.value,
    optionAId: selectedOptionA.value.id,
    optionBId: selectedOptionB.value.id,
    type: clashType.value
  }

  socket.emit('createClash', { createClashDto: payload })
  closeClashModal()
}

function vote(clashId, option) {
  const clash = clashes.value.find(c => c.id === clashId)
  if (!clash || clash.userVote) return
  socket.emit('submitVote', { voteDto: { clashId, option } })
}

function sendMessage() {
  if (!newMessage.value.trim() || !selectedGroupId.value) return

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

function getProgressPercentage(clash, option) {
  if (clash.totalVotes === 0) return 0
  return option === 'A'
    ? (clash.votesA / clash.totalVotes) * 100
    : (clash.votesB / clash.totalVotes) * 100
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}
</script>

<template>
  <div class="chat-window">
    <Header />

    <div class="chat-content">
      <div class="chat-messages">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.sent ? 'sent' : 'received']">
          <div class="author" v-if="!message.sent">{{ message.author }}</div>
          <span>{{ message.content }}</span>
          <div class="timestamp">{{ message.timestamp }}</div>
        </div>
      </div>

      <div v-if="activeClashes.length" class="clashes-section">
        <div v-for="clash in activeClashes" :key="clash.id" class="clash-card">
          <div class="clash-header">
            <span class="clash-creator">Créé par {{ clash.creator }}</span>
            <span class="clash-type">{{ clash.type === 'activity' ? '🎯 Activité' : '🍽️ Restaurant' }}</span>
          </div>

          <div class="clash-options">
            <div class="option-container">
              <div class="option"
                :class="{ 'voted': clash.userVote === 'A', 'winning': clash.votesA > clash.votesB && clash.totalVotes > 0 }"
                :aria-disabled="clash.userVote ? 'true' : 'false'" :tabindex="clash.userVote ? -1 : 0"
                @click="vote(clash.id, 'A')">
                <h4>{{ clash.type === 'activity' ? clash.activityOptionA?.name : clash.restaurantOptionA?.name }}</h4>
                <div class="vote-info">
                  <span class="vote-count">{{ clash.votesA }} votes</span>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: getProgressPercentage(clash, 'A') + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="vs-divider">VS</div>

            <div class="option-container">
              <div class="option"
                :class="{ 'voted': clash.userVote === 'B', 'winning': clash.votesB > clash.votesA && clash.totalVotes > 0 }"
                @click="vote(clash.id, 'B')">
                <h4>{{ clash.type === 'activity' ? clash.activityOptionB?.name : clash.restaurantOptionB?.name }}</h4>
                <div class="vote-info">
                  <span class="vote-count">{{ clash.votesB }} votes</span>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: getProgressPercentage(clash, 'B') + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="clash-footer">
            <span class="total-votes">{{ clash.totalVotes }} votes au total</span>
            <span class="clash-time">{{ clash.timestamp }}</span>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Écrivez votre message..." />
        <button @click="sendMessage" class="btn-primary">Envoyer</button>
        <button @click="openClashModal" class="btn-secondary">⚔️ Créer un Clash</button>
      </div>
    </div>

    <div v-if="showClashModal" class="modal-overlay" @click="closeClashModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>⚔️ Créer un nouveau Clash</h2>
          <button @click="closeClashModal" class="close-btn">×</button>
        </div>

        <div class="modal-body">
          <!-- Sélection du type -->
          <div class="type-selector">
            <button @click="clashType = 'activity'" :class="['type-btn', { active: clashType === 'activity' }]">
              🎯 Activités
            </button>
            <button @click="clashType = 'restaurant'" :class="['type-btn', { active: clashType === 'restaurant' }]">
              🍽️ Restaurants
            </button>
          </div>

          <div class="search-bar">
            <input type="text" v-model="searchQuery"
              :placeholder="`Rechercher ${clashType === 'activity' ? 'une activité' : 'un restaurant'}...`" />
          </div>
          <div class="selection-area">
            <div class="selection-column">
              <h3>Option A</h3>
              <select v-model="selectedOptionA" :disabled="!filteredOptions.length">
                <option disabled :value="null">-- Sélectionnez --</option>
                <option v-for="option in filteredOptions" :key="option.id" :value="option"
                  :disabled="selectedOptionB?.id === option.id">
                  {{ option.name }}
                </option>
              </select>
            </div>

            <div class="vs-column">VS</div>

            <div class="selection-column">
              <h3>Option B</h3>
              <select v-model="selectedOptionB" :disabled="!filteredOptions.length">
                <option disabled :value="null">-- Sélectionnez --</option>
                <option v-for="option in filteredOptions" :key="option.id" :value="option"
                  :disabled="selectedOptionA?.id === option.id">
                  {{ option.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeClashModal" class="btn-secondary">Annuler</button>
          <button @click="createClash" :disabled="!selectedOptionA || !selectedOptionB" class="btn-primary">
            Créer le Clash
          </button>
        </div>
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.planning-section {
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.9);
  margin: 0 24px 16px 24px;
  border-radius: 12px;
}

.day-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.day-card h3 {
  margin: 0 0 12px 0;
  color: #e99415;
}

.day-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.day-card li {
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}

.clashes-section {
  padding: 20px;
  border-radius: 12px;
}

.clashes-section h2 {
  color: white;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.5em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.clash-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clash-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.clash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.clash-creator {
  font-size: 14px;
  color: #666;
}

.clash-type {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.clash-options {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.option-container {
  flex: 1;
}

.option {
  background: linear-gradient(272deg, #f8f9ff 0%, #e8eeff 100%);
  border: 2px solid #e0e6ff;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.option.voted {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #5a67d8;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.option.winning:not(.voted) {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border-color: #38a169;
  animation: pulse-win 2s infinite;
}

@keyframes pulse-win {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }
}

.option h4 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
  font-weight: 600;
}

.option.voted h4 {
  color: white;
}

.vote-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.vote-count {
  font-size: 0.9em;
  font-weight: 500;
  min-width: 70px;
}

.option.voted .vote-count {
  color: rgba(255, 255, 255, 0.9);
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-left: 10px;
}

.option.voted .progress-bar {
  background: rgba(255, 255, 255, 0.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.5s ease;
  position: relative;
}

.option.voted .progress-fill {
  background: linear-gradient(90deg, #fff, #f0f0f0);
}

.option.winning .progress-fill {
  background: linear-gradient(90deg, #48bb78, #38a169);
  animation: progress-glow 2s infinite;
}

@keyframes progress-glow {

  0%,
  100% {
    box-shadow: 0 0 5px rgba(72, 187, 120, 0.5);
  }

  50% {
    box-shadow: 0 0 15px rgba(72, 187, 120, 0.8);
  }
}

.vs-divider {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: white;
  padding: 10px 15px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.9em;
  box-shadow: 0 4px 10px rgba(238, 90, 36, 0.3);
  min-width: 40px;
  text-align: center;
  animation: rotate 3s infinite linear;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.clash-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85em;
  color: #666;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.total-votes {
  font-weight: 600;
  color: #FFD700;

}

.clash-time {
  opacity: 0.7;
}

.option.voted {
  cursor: default;
}

.option:not(.voted):not(.winning):active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .clash-options {
    flex-direction: column;
    gap: 10px;
  }

  .vs-divider {
    transform: rotate(90deg);
    margin: 5px 0;
  }

  .clash-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .clash-footer {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
}

.clash-card {
  animation: slideInUp 0.5s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.option.voted::after {
  content: '✓';
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.no-clashes {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.8);
}

.no-clashes h3 {
  margin-bottom: 10px;
  font-size: 1.2em;
}

.no-clashes p {
  opacity: 0.8;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 12px;
  border-top: 1px solid #ccc;
  background-color: #fff;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 25px;
  outline: none;
  font-size: 14px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #e99415, #d4882a);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #d4882a, #bf771f);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
  border: 2px solid #dee2e6;
}

.btn-secondary:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.type-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.type-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid #dee2e6;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-btn:hover {
  border-color: #e99415;
}

.type-btn.active {
  background: #e99415;
  color: white;
  border-color: #e99415;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.selection-area {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.selection-column {
  flex: 1;
  text-align: center;
}

.selection-column h3 {
  margin: 0 0 12px 0;
  color: #333;
}

.selected-option {
  background: #e99415;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
}

.placeholder-option {
  background: #dee2e6;
  color: #6c757d;
  padding: 12px;
  border-radius: 8px;
  border: 2px dashed #adb5bd;
}

.vs-column {
  font-size: 20px;
  font-weight: bold;
  color: #e99415;
}

.options-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  transition: background 0.2s ease;
}

.option-item:hover {
  background: #f8f9fa;
}

.option-item.selected-a {
  background: #fff3cd;
  border-left: 4px solid #e99415;
}

.option-item.selected-b {
  background: #d4edda;
  border-left: 4px solid #28a745;
}

.option-actions {
  display: flex;
  gap: 8px;
}

.select-btn {
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-btn:hover:not(:disabled) {
  background: #e99415;
  color: white;
}

.select-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>