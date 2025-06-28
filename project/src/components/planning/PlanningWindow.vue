<script setup>
  import { ref, watch, onMounted } from 'vue'
  import { jwtDecode } from 'jwt-decode'
  import { selectedPlanningId } from '../../stores/planning'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
  import Header from './Header.vue'
  import AddActivityModal from '../AddActivityModal.vue'
  import AddRestaurantModal from '../AddRestaurantModal.vue'

  library.add(faPlus, faTimesCircle)

  const planning = ref(null)
  const token = localStorage.getItem('access_token')
  const planningsList = ref([])
  const showAddActivityModal = ref(false)
  const showAddRestaurantModal = ref(false)
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

  async function fetchPlannings() {
    try {
      const response = await fetch('http://localhost:3000/plannings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Erreur lors du chargement des plannings')
      planningsList.value = await response.json()

      if (!selectedPlanningId.value && planningsList.value.length > 0) {
        selectedPlanningId.value = planningsList.value[0].id
      }
    } catch (err) {
      console.error(err)
    }
  }

  const isLoading = ref(true)

  async function getPlanning(newPlanningId) {
    try {
      isLoading.value = true
      const response = await fetch(`http://localhost:3000/plannings/${newPlanningId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      planning.value = await response.json()
    } catch (error) {
      console.error('Erreur lors de la récupération du planning :', error)
    } finally {
      isLoading.value = false
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

      // Mettre à jour le planning localement
      if (planning.value?.activitiesDay) {
        const dayToUpdate = planning.value.activitiesDay.find(day => day.id === activityDayId)
        if (dayToUpdate) {
          dayToUpdate[time] = null
        }
      }
      
      // Recharger le planning
      refreshPlanning()
    } catch (error) {
      console.error("Erreur lors de la suppression de l'activité :", error)
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

  function refreshPlanning() {
    if (selectedPlanningId.value) {
      getPlanning(selectedPlanningId.value)
    }
  }

  function onActivityAdded() {
    refreshPlanning()
    closeActivityModal()
  }

  function onActivityAddedWithData(data) {
    if (planning.value?.activitiesDay) {
      const dayToUpdate = planning.value.activitiesDay.find(day => day.id === data.planningId)
      if (dayToUpdate && data.activity) {
        dayToUpdate[data.time] = data.activity
      }
    }
    
    refreshPlanning()
    closeActivityModal()
  }

  function onRestaurantAdded() {
    refreshPlanning()
    closeRestaurantModal()
  }

  function onRestaurantAddedWithData(data) {
    if (planning.value?.activitiesDay) {
      const dayToUpdate = planning.value.activitiesDay.find(day => day.id === data.planningId)
      if (dayToUpdate && data.restaurant) {
        dayToUpdate[data.time] = data.restaurant
      }
    }
    
    refreshPlanning()
    closeRestaurantModal()
  }

  watch(selectedPlanningId, (newId) => {
    if (newId) getPlanning(newId)
  })

  onMounted(async () => {
    await fetchPlannings()

    if (selectedPlanningId.value) {
      getPlanning(selectedPlanningId.value)
    }
  })

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
    <Header :planning="planning" />
    <div class="chat-content planning-panel">
      <h4>{{ formatDate(planning.activitiesDay[0].date) }}</h4>
      <div v-if="planning?.activitiesDay?.length">
        <div v-for="day in planning.activitiesDay" :key="day.id" class="day-card">
          <ul class="planning-list">
            <li
              v-for="step in [
                { key: 'breakfastRestaurant', label: 'Petit déjeuner', type: 'restaurant' },
                { key: 'morningActivity', label: 'Activité du matin', type: 'activity' },
                { key: 'noondayActivity', label: 'Activité de midi', type: 'activity' },
                { key: 'lunchRestaurant', label: 'Déjeuner', type: 'restaurant' },
                { key: 'afternoonActivity', label: 'Après-midi', type: 'activity' },
                { key: 'eveningActivity', label: 'Soirée', type: 'activity' },
                { key: 'dinnerRestaurant', label: 'Dîner', type: 'restaurant' },
                { key: 'nightActivity', label: 'Nuit', type: 'activity' }
              ]"
              :key="step.key"
              class="planning-step"
            >
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
        <div v-if="isLoading" class="spinner-container">
          <div class="spinner"></div>
        </div>
        <p v-else>Aucun planning disponible.</p>
      </div>
    </div>

    <!-- Modales pour ajouter des activités/restaurants -->
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
      @restaurant-added="onRestaurantAddedWithData"
    />
  </div>
</template>

<style scoped>
  .chat-window {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: white;
    background-size: cover;
    background-position: center;
  }

  .chat-content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
  }

  .planning-panel {
    color: black;
  }

  .planning-panel h2 {
    margin-bottom: 2rem;
  }

  .day-card {
    background: white;
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .day-card h3 {
    text-align: center;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .planning-list {
    list-style: none;
    padding: 0;
  }

  .planning-step {
    margin-bottom: 1.5rem;
  }

  .step-content h4 {
    margin-bottom: 0.5rem;
    font-weight: 400;
  }

  .image-wrapper {
    position: relative;
    width: 50%;
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
    height: 20rem;
    object-fit: cover;
    border-radius: 8px;
  }

  .overlay-text {
    width: 100%;
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

  .city {
    font-size: 12px;
    font-weight: 300;
  }

  .planning-placeholder-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    width: 50%;
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
  }

  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 5px solid #ccc;
    border-top-color: #1a1a1a;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .image-wrapper[data-v-3d190908] {
      position: relative;
      width: 100%
    }
  }
</style>