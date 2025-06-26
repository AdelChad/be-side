<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import { io } from 'socket.io-client'
  import { jwtDecode } from 'jwt-decode'
  import { selectedPlanningId } from '../../stores/planning'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  const token = localStorage.getItem('access_token')
  const planning = ref(null)
  const groups = ref([])
  const groupeName = ref(null)
  const searchQuery = ref('')
  const errorMessage = ref('')
  const successMessage = ref('')
  const showInput = ref(false)
  let userId = null

  if (token) {
    try {
      const decoded = jwtDecode(token)
      userId = decoded.sub
    } catch (e) {
      console.error('Token invalide ou corrompu', e)
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
      groups.value = data.map(groupe => ({
        id: groupe.id,
        name: groupe.groupeName,
      }))
      console.log(groups);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes :', error)
    }
  })

  async function getPlanning(newPlanningId) {
    try {
      const response = await fetch(`http://localhost:3000/plannings/${newPlanningId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();
      planning.value = data;
    } catch (error) {
      console.error('Erreur lors de la récupération du planning :', error);
    }
  }

  watch(selectedPlanningId, (newPlanningId) => {
    if (newPlanningId) {
      getPlanning(newPlanningId)
    }
  })

  async function sharePlanning() {
    errorMessage.value = ''
    successMessage.value = ''

    const planningId = Number(selectedPlanningId.value)
    const groupId = groupeName.value

    if (!planningId) {
      errorMessage.value = 'Aucun planning sélectionné'
      return
    }

    if (!groupId) {
      errorMessage.value = 'Aucun groupe sélectionné'
      return
    }

    try {
      const response = await fetch('http://localhost:3000/plannings/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          planningId,
          groupId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erreur ${response.status}`)
      }

      successMessage.value = 'Planning partagé avec succès'
      showInput.value = false
      groupeName.value = null
      toggleOpenGroups()

      setTimeout(() => {
        successMessage.value = ''
      }, 3000)

    } catch (error) {
      console.error("Erreur lors du partage de planning :", error)
      errorMessage.value = error.message || "Erreur lors du partage de planning"
    }
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const showGroups = ref(false)

  function toggleOpenGroups() {
    showGroups.value = !showGroups.value
  }

  const filteredGroups = computed(() =>
    groups.value.filter(group =>
      group.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )
  
</script>

<template>
  <div class="header">
    <div class="group-info">
      <div v-if="planning && planning.activitiesDay?.length">
        <div v-for="day in planning.activitiesDay" :key="day.id" class="day-card">
          <h3 class="name">{{ formatDate(day.date) }}</h3>
        </div>
      </div>
    </div>

    <div class="add-member-section">
      <button class="add-btn" @click="toggleOpenGroups">
        Partager le planning
      </button>
      <div v-if="showGroups" class="overlay-planning" @click.self="toggleOpenGroups">
        <div class="planning-panel">
          <h2>À qui patager le planning</h2>
          <div v-if="planning">
            <div
              v-for="group in filteredGroups"
              :key="group.id"
              class="day-card selectable"
              :class="{ selected: groupeName === group.id }"
              @click="groupeName = group.id"
            >
              <div>{{ group.name }}</div>
            </div>
          <button class="add-btn" @click="sharePlanning">Partager</button>
          </div>
        </div>
        <button class="close-btn" @click="toggleOpenGroups">Fermer</button>
      </div>
      <div v-else>
        <p>Aucun planning disponible.</p>
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

.group-info {
  flex: 1;
}

.name {
  font-weight: bold;
  color: black;
}

.add-member-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
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

.selectable {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.selectable:hover {
  background-color: #f0f0f0;
}

.selected {
  background-color: #d6f5d6;
  font-weight: bold;
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

.close-btn {
  margin-top: auto;
  padding: 10px 20px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 600px) {
  .header {
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
}
</style>