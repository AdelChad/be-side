<script setup>
  import { computed, ref, watch } from 'vue'
  import { io } from 'socket.io-client'
  import { jwtDecode } from 'jwt-decode'
  import { selectedGroupId } from '../../stores/chat'
  import { selectedPlanningId } from '../../stores/planning'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faCalendarDays, faPlus } from '@fortawesome/free-solid-svg-icons'
  import AddActivityModal from '../AddActivityModal.vue'
  import AddRestaurantModal from '../AddRestaurantModal.vue'
  library.add(faCalendarDays, faPlus)

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

  function clearMessages() {
    if (errorMessage.value || successMessage.value) {
      errorMessage.value = ''
      successMessage.value = ''
    }
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
        <div v-for="day in planning" class="day-card">
          <h3>{{ formatDate(day.date) }}</h3>

             <ul class="planning-list">
              <!-- Petit déjeuner -->
              <li class="planning-step" v-if="day.breakfastRestaurant">
                <div class="step-marker"></div>
                <div class="step-content">
                  <h4>Petit déjeuner</h4>
                  <div class="image-wrapper">
                    <router-link :to="`/restaurants/${day.breakfastRestaurant.id}`" class="planning-link">
                      <img :src="day.breakfastRestaurant.photo" alt="Petit déjeuner" class="planning-photo" />
                      <div class="overlay-text">{{ day.breakfastRestaurant.name }}<br><span class="city">{{ day.breakfastRestaurant.city }}</span></div>
                    </router-link>
                  </div>
                </div>
              </li>
            <li v-else class="planning-step">
              <div class="step-marker"></div>
              <div class="step-content">
                <h4>Petit déjeuner</h4>
                <div class="image-wrapper">
                  <div @click="showAddRestaurantModal = true; selectedTime = 'breakfastRestaurant'; selectedPlanningId = day.id" style="cursor: pointer" class="planning-placeholder-button">
                    <font-awesome-icon :icon="['fas', 'plus']" class="fa-plus-icon" />
                    <AddRestaurantModal
                      v-if="showAddRestaurantModal && day.id"
                      :selected-time="selectedTime"
                      @close="showAddRestaurantModal = false"
                    />
                  </div>
                </div>
              </div>
            </li>


              <!-- Activité du matin -->
              <li class="planning-step" v-if="day.morningActivity">
                <div class="step-marker"></div>
                <div class="step-content">
                  <h4>Activité du matin</h4>
                  <div class="image-wrapper">
                    <router-link :to="`/activities/${day.morningActivity.id}`" class="planning-link">
                      <img :src="day.morningActivity.photo" alt="Activité du matin" class="planning-photo" />
                      <div class="overlay-text">{{ day.morningActivity.name }} <br> <span class="city">{{ day.morningActivity.city }}</span></div>
                    </router-link>
                  </div>
                </div>
              </li>
               <li v-else class="planning-step">
              <div class="step-marker"></div>
              <div class="step-content">
                <h4>Activité du matin</h4>
                <div class="image-wrapper">
                  <div @click="showAddActivityModal = true; selectedTime = 'morningActivity'; selectedPlanningId = day.id" style="cursor: pointer" class="planning-placeholder-button">
                    <font-awesome-icon :icon="['fas', 'plus']" class="fa-plus-icon" />
                     <AddActivityModal
                        v-if="showAddActivityModal && day.id"
                        :selected-time="selectedTime"
                        @close="showAddActivityModal = false"
                      />
                  </div>
                </div>
              </div>
            </li>

              <!-- Activité de midi -->
              <li class="planning-step" v-if="day.noondayActivity">
                <div class="step-marker"></div>
                <div class="step-content">
                  <h4>Activité de midi</h4>
                  <div class="image-wrapper">
                    <router-link :to="`/activities/${day.noondayActivity.id}`" class="planning-link">
                      <img :src="day.noondayActivity.photo" alt="Activité de midi" class="planning-photo" />
                      <div class="overlay-text">{{ day.noondayActivity.name }}<br> <span class="city">{{ day.noondayActivity.city }}</span></div>
                    </router-link>
                  </div>
                </div>
              </li>
                 <li v-else class="planning-step">
              <div class="step-marker"></div>
              <div class="step-content">
                <h4>Activité du midi</h4>
                <div class="image-wrapper">
                  <div @click="showAddActivityModal = true; selectedTime = 'noondayActivity'; selectedPlanningId = day.id" style="cursor: pointer" class="planning-placeholder-button">
                    <font-awesome-icon :icon="['fas', 'plus']" class="fa-plus-icon" />
                     <AddActivityModal
                        v-if="showAddActivityModal && day.id"
                        :selected-time="selectedTime"
                        @close="showAddActivityModal = false"
                      />
                  </div>
                </div>
              </div>
            </li>

              <!-- Déjeuner -->
              <li class="planning-step" v-if="day.lunchRestaurant">
                <div class="step-marker"></div>
                <div class="step-content">
                  <h4>Déjeuner</h4>
                  <div class="image-wrapper">
                    <router-link :to="`/restaurants/${day.lunchRestaurant.id}`" class="planning-link">
                      <img :src="day.lunchRestaurant.photo" alt="Déjeuner" class="planning-photo" />
                      <div class="overlay-text">{{ day.lunchRestaurant.name }}<br> <span class="city">{{ day.lunchRestaurant.city }}</span></div>
                    </router-link>
                  </div>
                </div>
              </li>
                 <li v-else class="planning-step">
              <div class="step-marker"></div>
              <div class="step-content">
                <h4>Déjeuner</h4>
                <div class="image-wrapper">
                  <div @click="showAddRestaurantModal = true; selectedTime = 'lunchRestaurant'; selectedPlanningId = day.id" style="cursor: pointer" class="planning-placeholder-button">
                    <font-awesome-icon :icon="['fas', 'plus']" class="fa-plus-icon" />
                    <AddRestaurantModal
                      v-if="showAddRestaurantModal && day.id"
                      :selected-time="selectedTime"
                      @close="showAddRestaurantModal = false"
                    />
                  </div>
                </div>
              </div>
            </li>

              <!-- Après-midi -->
              <li class="planning-step" v-if="day.afternoonActivity">
                <div class="step-marker"></div>
                <div class="step-content">
                  <h4>Après-midi</h4>
                  <div class="image-wrapper">
                    <router-link :to="`/activities/${day.afternoonActivity.id}`" class="planning-link">
                      <img :src="day.afternoonActivity.photo" alt="Après-midi" class="planning-photo" />
                      <div class="overlay-text">{{ day.afternoonActivity.name }}<br> <span class="city">{{ day.afternoonActivity.city }}</span></div>
                    </router-link>
                  </div>
                </div>
              </li>
                 <li v-else class="planning-step">
              <div class="step-marker"></div>
              <div class="step-content">
                <h4>Après-midi</h4>
                <div class="image-wrapper">
                  <div @click="showAddActivityModal = true; selectedTime = 'afternoonActivity'; selectedPlanningId = day.id" style="cursor: pointer" class="planning-placeholder-button">
                    <font-awesome-icon :icon="['fas', 'plus']" class="fa-plus-icon" />
                     <AddActivityModal
                        v-if="showAddActivityModal && day.id"
                        :selected-time="selectedTime"
                        @close="showAddActivityModal = false"
                      />
                  </div>
                </div>
              </div>
            </li>

              <!-- Soirée -->
              <li class="planning-step" v-if="day.eveningActivity">
                <div class="step-marker"></div>
                <div class="step-content">
                  <h4>Soirée</h4>
                  <div class="image-wrapper">
                    <router-link :to="`/activities/${day.eveningActivity.id}`" class="planning-link">
                      <img :src="day.eveningActivity.photo" alt="Soirée" class="planning-photo" />
                      <div class="overlay-text">{{ day.eveningActivity.name }}<br> <span class="city">{{ day.eveningActivity.city }}</span></div>
                    </router-link>
                  </div>
                </div>
              </li>
                 <li v-else class="planning-step">
              <div class="step-marker"></div>
              <div class="step-content">
                <h4>Soirée</h4>
                <div class="image-wrapper">
                  <div @click="showAddActivityModal = true; selectedTime = 'eveningActivity'; selectedPlanningId = day.id" style="cursor: pointer" class="planning-placeholder-button">
                    <font-awesome-icon :icon="['fas', 'plus']" class="fa-plus-icon" />
                     <AddActivityModal
                        v-if="showAddActivityModal && day.id"
                        :selected-time="selectedTime"
                        @close="showAddActivityModal = false"
                      />
                  </div>
                </div>
              </div>
            </li>

              <!-- Dîner -->
              <li class="planning-step" v-if="day.dinnerRestaurant">
                <div class="step-marker"></div>
                <div class="step-content">
                  <h4>Dîner</h4>
                  <div class="image-wrapper">
                    <router-link :to="`/restaurants/${day.dinnerRestaurant.id}`" class="planning-link">
                      <img :src="day.dinnerRestaurant.photo" alt="Dîner" class="planning-photo" />
                      <div class="overlay-text">{{ day.dinnerRestaurant.name }}<br> <span class="city">{{ day.dinnerRestaurant.city }}</span></div>
                    </router-link>
                  </div>
                </div>
              </li>
                <li v-else class="planning-step">
              <div class="step-marker"></div>
              <div class="step-content">
                <h4>Dîner</h4>
                <div class="image-wrapper">
                  <div @click="showAddRestaurantModal = true; selectedTime = 'dinnerRestaurant'; selectedPlanningId = day.id" style="cursor: pointer" class="planning-placeholder-button">
                    <font-awesome-icon :icon="['fas', 'plus']" class="fa-plus-icon" />
                    <AddRestaurantModal
                      v-if="showAddRestaurantModal && day.id"
                      :selected-time="selectedTime"
                      @close="showAddRestaurantModal = false"
                    />
                  </div>
                </div>
              </div>
            </li>

              <!-- Nuit -->
              <li class="planning-step" v-if="day.nightActivity">
                <div class="step-marker"></div>
                <div class="step-content">
                  <h4>Nuit</h4>
                  <div class="image-wrapper">
                    <router-link :to="`/activities/${day.nightActivity.id}`" class="planning-link">
                      <img :src="day.nightActivity.photo" alt="Nuit" class="planning-photo" />
                      <div class="overlay-text">{{ day.nightActivity.name }}<br> <span class="city">{{ day.nightActivity
                      .city }}</span></div>
                    </router-link>
                  </div>
                </div>
              </li>
                <li v-else class="planning-step">
              <div class="step-marker"></div>
              <div class="step-content">
                <h4>Nuit</h4>
                <div class="image-wrapper">
                  <div @click="showAddActivityModal = true; selectedTime = 'nightActivity'; selectedPlanningId = day.id" style="cursor: pointer" class="planning-placeholder-button">
                    <font-awesome-icon :icon="['fas', 'plus']" class="fa-plus-icon" />
                     <AddActivityModal
                        v-if="showAddActivityModal && day.id"
                        :selected-time="selectedTime"
                        @close="showAddActivityModal = false"
                      />
                  </div>
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