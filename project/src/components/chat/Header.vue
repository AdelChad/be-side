<script setup>
  import { computed, ref, watch } from 'vue'
  import { io } from 'socket.io-client'
  import { jwtDecode } from 'jwt-decode'
  import { selectedGroupId } from '../../stores/chat'
  import { selectedPlanningId } from '../../stores/planning'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faCalendarDays, faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
  import AddActivityModal from '../AddActivityModal.vue'
  import AddRestaurantModal from '../AddRestaurantModal.vue'
  library.add(faCalendarDays, faPlus, faTimesCircle)

  const token = localStorage.getItem('access_token')
  const planning = ref([])
  const groupName = ref('')
  const newMember = ref('')
  const errorMessage = ref('')
  const successMessage = ref('')
  const showInput = ref(false)
  const showAddActivityModal = ref(false)
  const showAddRestaurantModal = ref(false)
  const showPlanning = ref(false)
  const selectedTime = ref(null)
  const selectedDayId = ref(null)
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
      joinChannel(newGroupId)
      groupName.value = ''
      errorMessage.value = ''
      successMessage.value = ''
    }
  })
  
  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  socket.on('channelMessages', (fetchedMessages) => {
    if (fetchedMessages.length > 0) {
      groupName.value = fetchedMessages[0].channel.name
    }
  })
  
  socket.on('channelPlanning', (fetchedPlanning) => {
    planning.value = fetchedPlanning
  })

  function joinChannel(channelId) {
    socket.emit('joinChannel', { channelId })
    socket.emit('getMessages', { channelId })
    socket.emit('getPlanning', { channelId })
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function toggleInput() {
    showInput.value = !showInput.value
    if (showInput.value) {
      setTimeout(() => {
        const input = document.querySelector('.search-input')
        if (input) input.focus()
      }, 100)
    } else {
      newMember.value = ''
      errorMessage.value = ''
      successMessage.value = ''
    }
  }

  async function addMember() {
    errorMessage.value = ''
    successMessage.value = ''

    if (newMember.value.trim() === '') {
      errorMessage.value = 'Veuillez saisir un email'
      return
    }

    if (!isValidEmail(newMember.value.trim())) {
      errorMessage.value = 'Veuillez saisir un email valide'
      return
    }

    try {
      const groupId = Number(selectedGroupId.value)

      if (!groupId) {
        errorMessage.value = 'Aucun groupe sélectionné'
        return
      }

      const response = await fetch('http://localhost:3000/groupe/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          groupeId: groupId,
          users: [{ email: newMember.value.trim() }]
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erreur ${response.status}`)
      }

      successMessage.value = 'Membre ajouté avec succès'
      newMember.value = ''
      showInput.value = false

      setTimeout(() => {
        successMessage.value = ''
      }, 3000)

    } catch (error) {
      console.error("Erreur lors de l'ajout du membre dans ce groupe :", error)
      errorMessage.value = error.message || "Erreur lors de l'ajout du membre"
    }
  }

  async function deleteActivity(activityDayId, activityId, time) {
    try {
      const response = await fetch(`http://localhost:3000/plannings/delete_activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          activityDayId,
          activityId,
          time
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erreur ${response.status}`)
      }

      const dayToUpdate = planning.value.find(day => day.id === activityDayId)
      if (dayToUpdate) {
        dayToUpdate[time] = null
      }
      
      refreshPlanning()
    } catch (error) {
      console.error("Erreur lors de la suppression de l'activité :", error)
    }
  }

  function clearMessages() {
    if (errorMessage.value || successMessage.value) {
      errorMessage.value = ''
      successMessage.value = ''
    }
  }

  function openAddActivityModal(dayId, timeSlot) {
    selectedDayId.value = dayId
    selectedTime.value = timeSlot
    selectedPlanningId.value = dayId
    showAddActivityModal.value = true
  }

  function closeActivityModal() {
    showAddActivityModal.value = false
    selectedDayId.value = null
    selectedTime.value = null
  }

  function refreshPlanning() {
    if (selectedGroupId.value) {
      socket.emit('getPlanning', { channelId: selectedGroupId.value })
    }
  }

  function onActivityAdded() {
    refreshPlanning()
    closeActivityModal()
  }

  function onActivityAddedWithData(data) {
    const dayToUpdate = planning.value.find(day => day.id === data.planningId)
    if (dayToUpdate && data.activity) {
      dayToUpdate[data.time] = data.activity
    }
    
    refreshPlanning()
    closeActivityModal()
  }

  function openAddRestaurantModal(dayId, timeSlot) {
    selectedDayId.value = dayId
    selectedTime.value = timeSlot
    selectedPlanningId.value = dayId
    showAddRestaurantModal.value = true
  }

  function closeRestaurantModal() {
    showAddRestaurantModal.value = false
    selectedDayId.value = null
    selectedTime.value = null
  }

  function onRestaurantAdded() {
    refreshPlanning()
    closeRestaurantModal()
  }

  function toggleOpenPlanning() {
    showPlanning.value = !showPlanning.value
  }
</script>
<template>
  <div class="header">
    <img src="https://media.gqmagazine.fr/photos/5ef0aedfcaa5a09c5304aed1/4:3/w_2119,h_1589,c_limit/friends.jpg"
      class="avatar" />
    <div class="group-info">
      <div class="name">{{ groupName }}</div>
    </div>
    <div class="button-group">
    <div class="add-member-section">
      <button v-if="!showInput" @click="toggleInput" class="add-btn">
        Ajouter un membre
      </button>
      <div v-if="showInput" class="add-member-form">
        <input type="email" v-model="newMember" @keyup.enter="addMember" @input="clearMessages"
          placeholder="Email du nouveau membre" class="search-input"
          :class="{ 'error': errorMessage, 'success': successMessage }" />
        <button @click="addMember" class="add-btn">
          Confirmer
        </button>
        <button @click="toggleInput" class="cancel-btn">
          Annuler
        </button>
      </div>
       <button class="add-btn" @click="toggleOpenPlanning">
       <font-awesome-icon :icon="['fas', 'calendar-days']" />
      </button>
      </div>
        <!-- Menu Planning flottant -->
        <div v-if="showPlanning" class="overlay-planning" @click.self="toggleOpenPlanning">
          <div class="planning-panel">
            <h2>Planning du groupe</h2>
           <div v-if="planning.length">
        <div v-for="day in planning" class="day-card" :key="day.id">
          <h3>{{ formatDate(day.date) }}</h3>

          <ul class="planning-list">
            <!-- Étapes de la journée -->
            <li class="planning-step" v-for="step in [
              { key: 'breakfastRestaurant', label: 'Petit déjeuner', type: 'restaurant' },
              { key: 'morningActivity', label: 'Activité du matin', type: 'activity' },
              { key: 'noondayActivity', label: 'Activité de midi', type: 'activity' },
              { key: 'lunchRestaurant', label: 'Déjeuner', type: 'restaurant' },
              { key: 'afternoonActivity', label: 'Après-midi', type: 'activity' },
              { key: 'eveningActivity', label: 'Soirée', type: 'activity' },
              { key: 'dinnerRestaurant', label: 'Dîner', type: 'restaurant' },
              { key: 'nightActivity', label: 'Nuit', type: 'activity' }
            ]" :key="step.key">
              <div class="step-marker"></div>
              <div class="step-content">
                <h4>{{ step.label }}</h4>
                <div class="image-wrapper">
                  <template v-if="day[step.key]">
                    <font-awesome-icon
                      :icon="['fas', 'times-circle']"
                      class="delete-icon"
                      @click="deleteActivity(day.id, day[step.key].id, step.key)"
                    />
                    <router-link
                      :to="`/${step.type === 'restaurant' ? 'restaurants' : 'activities'}/${day[step.key].id}`"
                      class="planning-link"
                    >
                      <img :src="day[step.key].photo" :alt="step.label" class="planning-photo" />
                      <div class="overlay-text">
                        {{ day[step.key].name }}<br />
                        <span class="city">{{ day[step.key].city }}</span>
                      </div>
                    </router-link>
                  </template>
                  <template v-else>
                    <div
                      @click="step.type === 'restaurant' ? openAddRestaurantModal(day.id, step.key) : openAddActivityModal(day.id, step.key)"
                      style="cursor: pointer"
                      class="planning-placeholder-button"
                    >
                      <font-awesome-icon :icon="['fas', 'plus']" class="fa-plus-icon" />
                    </div>
                  </template>
                </div>
              </div>
            </li>
          </ul>

        </div>
      </div>
      <div v-else>
        <p>Aucun planning disponible.</p>
      </div>
            <button class="close-btn" @click="toggleOpenPlanning">Fermer</button>
          </div>
        </div>
      <AddActivityModal
        v-if="showAddActivityModal && selectedDayId"
        :selected-time="selectedTime"
        @close="closeActivityModal"
        @updated="onActivityAdded"
        @activity-added="onActivityAddedWithData"
      />
      <AddRestaurantModal
        v-if="showAddRestaurantModal && selectedDayId"
        :selected-time="selectedTime"
        @close="closeRestaurantModal"
        @updated="onRestaurantAdded"
        @restaurant-added="onActivityAddedWithData"
      />
      <div class="messages-inline">
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.group-info {
  flex: 1;
}

.name {
  font-weight: bold;
  color: black;
}

.status {
  font-size: 12px;
  color: gray;
}

.add-member-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.add-member-form {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-input {
  padding: 12px 16px;
  font-size: 14px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
  width: 250px;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-input.error {
  border-color: #dc3545;
}

.search-input.success {
  border-color: #28a745;
}

.add-btn {
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

.add-btn:hover {
  background-color: #333333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.add-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.cancel-btn {
  padding: 12px 20px;
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

.cancel-btn:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cancel-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.messages {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  z-index: 10;
}

.messages-inline {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 4px;
  gap: 4px;
}

.messages-inline .error-message,
.messages-inline .success-message {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.success-message {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}

.overlay-planning {
  position: fixed;
  color:black;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.planning-panel {
  width: 20rem;
  height: 100vh; /* <- FIX: pleine hauteur */
  background: #fff;
  padding: 30px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  animation: slideInPlanning 0.3s ease-out;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* <- Ajoute le scroll ici */
}


.planning-panel h2 {
  margin-bottom:1rem;
  text-align: center;
}


.planning-panel h3 {
  margin-bottom:1rem;
  font-weight: 500;
  text-align: center;
}

.planning-panel ul {
 list-style: none;
}

@keyframes slideInPlanning {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.close-btn {
  margin-top: auto;
  padding: 10px 20px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.image-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 12px;
}

.delete-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 18px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px;
  border-radius: 50%;
  z-index: 2;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.delete-icon:hover {
  background-color: rgba(255, 0, 0, 0.7);
}


.planning-photo {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.overlay-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-weight: 500;
  font-size: 14px;
  border-radius: 0 0 8px 8px;
}

.planning-link {
  display: block;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.planning-link:hover .planning-photo {
  filter: brightness(0.85);
  transition: 0.2s;
}

.planning-link:hover .overlay-text {
  background: rgba(0, 0, 0, 0.7);
}


.planning-placeholder-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100%;
  background-color: #f0f0f0;
  color: #1a1a1a;
  font-size: 32px;
  font-weight: bold;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.planning-placeholder-button:hover {
  background-color: #e0e0e0;
}

.fa-plus-icon {
  font-size: 20px;
  color: #1a1a1a;
}

.planning-list h4 {
  font-weight:400;
}

.city {
  font-size: small;
  font-weight: 300;
}

@media (max-width: 600px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .add-member-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .add-btn,
  .cancel-btn {
    width: 100%;
  }

  .messages-inline {
    align-items: stretch;
  }

  .messages-inline .error-message,
  .messages-inline .success-message {
    width: 100%;
    text-align: center;
  }

  .avatar {
    align-self: center;
  }

  .group-info {
    width: 100%;
    text-align: center;
  }
}
</style>