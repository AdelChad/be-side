<script setup lang="ts">
import { ref, computed } from 'vue'
import { selectedPlanningId } from '../../stores/planning'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Props
const props = defineProps<{
  planning: any
}>()

// UI states
const groups = ref([])
const groupeName = ref(null)
const searchQuery = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const showGroups = ref(false)

// Utils
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Toggle UI
function toggleOpenGroups() {
  showGroups.value = !showGroups.value
}

// Fetch groups (only on mount)
const token = localStorage.getItem('access_token')
if (token) {
  fetch(`http://localhost:3000/groupe`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      groups.value = data.map(groupe => ({
        id: groupe.id,
        name: groupe.groupeName,
      }))
    })
    .catch(err => console.error('Erreur groupes :', err))
}

// Filtered list
const filteredGroups = computed(() =>
  groups.value.filter(group =>
    group.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

// Share planning
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
      body: JSON.stringify({ planningId, groupId })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Erreur ${response.status}`)
    }

    successMessage.value = 'Planning partagé avec succès'
    showGroups.value = false
    groupeName.value = null

    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Erreur lors du partage du planning'
  }
}
</script>

<template>
  <div class="header">
    <div class="group-info">
      <h3 class="name" v-if="props.planning?.activitiesDay?.length">
        {{ (props.planning.name) }}
      </h3>
    </div>

    <div class="add-member-section">
      <button class="add-btn" @click="toggleOpenGroups">
        Partager le planning
      </button>

      <div v-if="showGroups" class="overlay-planning" @click.self="toggleOpenGroups">
        <div class="planning-panel">
          <h2>À qui partager le planning</h2>

          <div v-if="groups.length">
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

      <div class="messages-inline">
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
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
  position: relative;
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

.messages-inline {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 4px;
  gap: 4px;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.success-message {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}

.overlay-planning {
  position: fixed;
  color: black;
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
  height: 100vh;
  background: #fff;
  padding: 30px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  animation: slideInPlanning 0.3s ease-out;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.selectable {
  cursor: pointer;
  padding: 1rem;
  transition: background-color 0.2s ease;
}

.selectable:hover {
  background-color: #f0f0f0;
}

.selected {
  background-color: #d6f5d6;
  font-weight: bold;
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
</style>
