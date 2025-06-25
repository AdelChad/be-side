<script setup>
import { ref, watch } from 'vue'
import { io } from 'socket.io-client'
import { jwtDecode } from 'jwt-decode'
import { selectedPlanningId } from '../../stores/planning'

const token = localStorage.getItem('access_token')
const planning = ref(null)
const groupeName = ref('')
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

    if (groupeName.value.trim() === '') {
      errorMessage.value = "Veuillez saisir le nom d'un groue"
      return
    }

    try {
      const planningId = Number(selectedPlanningId.value)

      if (!planningId) {
        errorMessage.value = 'Aucun planning sélectionné'
        return
      }

      const response = await fetch('http://localhost:3000/planning/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          planningId: planningId,
          groupe: groupeName.value
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erreur ${response.status}`)
      }

      successMessage.value = 'Planning partager avec succès'
      groupeName.value = ''
      showInput.value = false

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

  function clearMessages() {
    if (errorMessage.value || successMessage.value) {
      errorMessage.value = ''
      successMessage.value = ''
    }
  }

  function toggleInput() {
    showInput.value = !showInput.value
    if (showInput.value) {
      setTimeout(() => {
        const input = document.querySelector('.search-input')
        if (input) input.focus()
      }, 100)
    } else {
      groupeName.value = ''
      errorMessage.value = ''
      successMessage.value = ''
    }
  }
</script>

<template>
  <div class="header">
    <img src="https://media.gqmagazine.fr/photos/5ef0aedfcaa5a09c5304aed1/4:3/w_2119,h_1589,c_limit/friends.jpg"
      class="avatar" />
    <div class="group-info">
      <div v-if="planning && planning.activitiesDay?.length">
        <div v-for="day in planning.activitiesDay" :key="day.id" class="day-card">
          <h3 class="name">{{ formatDate(day.date) }}</h3>
        </div>
      </div>
    </div>

    <div class="add-member-section">
      <button v-if="!showInput" @click="toggleInput" class="add-btn">
        Partager le planning
      </button>
      <div v-if="showInput" class="add-member-form">
        <input type="texte" v-model="groupeName" @keyup.enter="sharePlanning" @input="clearMessages"
          placeholder="Nom du groupe" class="search-input"
          :class="{ 'error': errorMessage, 'success': successMessage }" />
        <button @click="sharePlanning" class="add-btn">
          Confirmer
        </button>
        <button @click="toggleInput" class="cancel-btn">
          Annuler
        </button>
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