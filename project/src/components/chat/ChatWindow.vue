<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { io } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode'
import { selectedGroupId } from '../../stores/chat'
import Header from './Header.vue'

const token = localStorage.getItem('access_token')
const userId = ref(null)

onMounted(() => {
  const token = localStorage.getItem('access_token')
  if (token) {
    try {
      const decoded = jwtDecode(token)
      userId.value = decoded.id
    } catch (e) {
      console.error('Token invalide', e)
    }
  }
})

const socket = io('http://localhost:3000', { auth: { token } })

const newMessage = ref('')
const messages = ref([])
const clashes = ref([])
const planning = ref([])
const activities = ref([])
const restaurants = ref([])

const showClashModal = ref(false)
const clashType = ref('activity')
const selectedOptionA = ref(null)
const selectedOptionB = ref(null)
const searchQuery = ref('')

const votingClash = ref(null)

const conversationFlow = computed(() => {
  const allItems = [
    ...messages.value.map(msg => ({
      ...msg,
      type: 'message'
    })),
    ...clashes.value.map(clash => ({
      ...clash,
      type: 'clash'
    }))
  ];

  return allItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
});

const filteredOptions = computed(() => {
  const options = clashType.value === 'activity' ? activities.value : restaurants.value
  return options.filter(option => option.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const activeClashes = computed(() => clashes.value.filter(c => !c.isFinished))

function joinChannel(channelId) {
  socket.emit('joinChannel', { channelId })
  socket.emit('getMessages', { channelId })
  socket.emit('getPlanning', { channelId })
  socket.emit('getClashes', { channelId: selectedGroupId.value, userId: userId.value })
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
      sent: String(msg.author.id) === String(userId.value),
      timestamp: new Date(msg.createdAt).toLocaleTimeString(),
      createdAt: msg.createdAt
    }))
  })

socket.on('newMessage', (message) => {
  messages.value.push({
    author: message.author.firstName,
    content: message.content,
    sent: String(message.author.id) === String(userId.value),
    timestamp: new Date(message.createdAt).toLocaleTimeString(),
    createdAt: message.createdAt
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
  const creatorId = clash.creator?.id || clash.creatorId
  const isCreator = String(creatorId) === String(userId.value)
  const clashType = clash.activityOptionA ? 'activity' : 'restaurant'

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
    createdAt: clash.createdAt,
    sent: isCreator,
    clashType,
    type: 'clash'
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
      <div class="conversation-flow">
        <div v-for="(item, index) in conversationFlow" :key="`${item.type}-${item.id || index}`">
          <!-- Messages -->
          <div v-if="item.type === 'message'" :class="['message', item.sent ? 'sent' : 'received']">
            <div class="author" v-if="!item.sent">{{ item.author }}</div>
            <span>{{ item.content }}</span>
            <div class="timestamp">{{ item.timestamp }}</div>
          </div>

          <div v-else-if="item.type === 'clash'" :class="['clash-message', item.sent ? 'sent' : 'received']">
            <div class="clash-card compact">
              <div class="clash-header">
                <span class="clash-creator">{{ item.sent ? 'Vous avez créé' : `${item.creator} a créé` }}</span>
                <span class="clash-type">{{ item.clashType === 'activity' ? 'Activité 🎯' : 'Restaurant 🍽️' }}</span>
              </div>
              <div class="clash-options">
                <div class="option-container">
                  <div class="option compact"
                    :class="{ 'voted': item.userVote === 'A', 'winning': item.votesA > item.votesB && item.totalVotes > 0 }"
                    @click="vote(item.id, 'A')">
                    <h5>{{ item.clashType === 'activity' ? item.activityOptionA?.name : item.restaurantOptionA?.name }}</h5>
                    <div class="vote-info">
                      <span class="vote-count">{{ item.votesA > 1 ? item.votesA + ' votes' : item.votesA + ' vote' }}</span>
                      <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: getProgressPercentage(item, 'A') + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="vs-divider compact">VS</div>

                <div class="option-container">
                  <div class="option compact"
                    :class="{ 'voted': item.userVote === 'B', 'winning': item.votesB > item.votesA && item.totalVotes > 0 }"
                    @click="vote(item.id, 'B')">
                    <h5>{{ item.clashType === 'activity' ? item.activityOptionB?.name : item.restaurantOptionB?.name }}</h5>
                    <div class="vote-info">
                      <span class="vote-count">{{ item.votesB > 1 ? item.votesB + ' votes' : item.votesB + ' vote' }}</span>
                      <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: getProgressPercentage(item, 'B') + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="clash-footer">
                <span class="total-votes">{{ item.totalVotes > 1 ? item.totalVotes + ' votes' : item.totalVotes + ' vote' }} au total</span>
                <span class="clash-time">{{ item.timestamp }}</span>
              </div>
            </div>
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
  background-image: url('../../assets/background beside 2.png');
  background-size: cover;
  background-position: center;
  height: 100%;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

/* Flux unifié de conversation */
.conversation-flow {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.conversation-flow > div {
  display: flex;
  flex-direction: column;
}

/* Messages standards */
.message {
  max-width: fit-content;
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

.message .author {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 2px;
  color: #3a3a3a;
}

.message .timestamp {
  font-size: 12px;
  text-align: right;
  margin-top: 4px;
  color: gray;
}

/* Messages de clash */
.clash-message {
  display: flex;
  max-width: 75%;
  width: 100%;
   align-items: flex-start;
}

.clash-message.sent {
  align-self: flex-end;
  justify-content: flex-end;
}

.clash-message.received {
  align-self: flex-start;
  justify-content: flex-start;
}

.clash-card.compact {
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: slideInUp 0.5s ease-out;
}

.clash-card.compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.clash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.clash-creator {
  font-size: 13px;
  color: #666;
}

.clash-type {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: white;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.75em;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.clash-options {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.option-container {
  flex: 1;
}

.option.compact {
  background: linear-gradient(272deg, #f0f4f8 0%, #d9e2ec 100%);
  border: 2px solid #bcccdc;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: #102a43;
}

.option.compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.option.compact.voted {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: #ffffff;
  border-color: #1d4ed8;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
  cursor: default;
}

.option.compact.winning:not(.voted) {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border-color: #38a169;
  animation: pulse-win 2s infinite;
}

.option.compact.voted::after {
  content: '✓';
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
}

.option.compact h5 {
  margin: 0 0 8px 0;
  font-size: 0.95em;
  font-weight: 600;
}

.option.compact.voted h5 {
  color: white;
}

.vote-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.vote-count {
  font-size: 0.8em;
  font-weight: 500;
  min-width: 50px;
}

.option.compact.voted .vote-count {
  color: rgba(255, 255, 255, 0.9);
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-left: 8px;
}

.option.compact.voted .progress-bar {
  background: rgba(255, 255, 255, 0.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  border-radius: 3px;
  transition: width 0.5s ease;
  position: relative;
}

.option.compact.voted .progress-fill {
  background: linear-gradient(90deg, #fff, #f0f0f0);
}

.option.compact.winning .progress-fill {
  background: linear-gradient(90deg, #48bb78, #38a169);
  animation: progress-glow 2s infinite;
}

.vs-divider.compact {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: white;
  padding: 8px 12px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.75em;
  box-shadow: 0 4px 10px rgba(238, 90, 36, 0.3);
  min-width: 35px;
  text-align: center;
  animation: rotate 3s infinite linear;
}

.clash-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8em;
  color: #666;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
}

.total-votes {
  font-weight: 600;
  color: #FFD700;
}

.clash-time {
  opacity: 0.7;
}

/* Animations */
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

@keyframes pulse-win {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes progress-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(72, 187, 120, 0.5);
  }
  50% {
    box-shadow: 0 0 15px rgba(72, 187, 120, 0.8);
  }
}

/* Input de chat */
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

/* Modal styles */
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
  align-items: flex-end;
  gap: 15px;
}

.selection-column {
  flex: 1;
}

.selection-column h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.selection-column select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.vs-column {
  font-size: 20px;
  font-weight: bold;
  color: #e99415;
  margin-bottom: 10px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-footer button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .clash-options {
    flex-direction: column;
    gap: 8px;
  }

  .vs-divider.compact {
    transform: rotate(90deg);
    margin: 4px 0;
  }

  .clash-header {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .clash-footer {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }
}
</style>