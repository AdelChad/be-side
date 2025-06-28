<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { selectedPlanningId } from '../stores/planning'

    const emits = defineEmits(['close', 'updated', 'add', 'activity-added'])

    const token = localStorage.getItem('access_token')
    const activities = ref([])

    const searchQuery = ref('')
    const selectedActivity = ref(null)

    const props = defineProps({
        selectedTime: {
            type: [String, null],
            required: true
        }
    })

    const filteredActivities = computed(() =>
        activities.value.filter(a =>
            a.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    )

    onMounted(async () => {
        if (!token) return

        try {
            const activitiesRes = await fetch(`http://localhost:3000/activities`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            if (!activitiesRes.ok) {
                throw new Error('Erreur de récupération des données')
            }

            const activitiesData = await activitiesRes.json()

            activities.value = activitiesData.map(a => ({
                id: a.id,
                name: a.name,
                city: a.city,
            }))
        } catch (error) {
            console.error('Erreur lors de la récupération des activités :', error)
        }
    })

    async function submitToPlanning() {
        if (!selectedActivity.value) {
            console.error("Activité ou créneau horaire manquant");
            return
        }

        try {
            const payload = {
                id: selectedPlanningId.value,
                activities: [
                    {
                    id: selectedActivity.value.id,
                    time: props.selectedTime
                    }
                ],
                restaurants: [],
            }

            const response = await fetch('http://localhost:3000/plannings/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || `Erreur ${response.status}`)
            }

            const updatedPlanning = await response.json()
            
            emits('activity-added', {
                activity: selectedActivity.value,
                time: props.selectedTime,
                planningId: selectedPlanningId.value
            });
            
            emits('updated');
            emits('close');
        } catch (err) {
            console.error("Erreur lors de la mise à jour du planning :", err)
        }
    }

</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Ajouter une activité au planning</h2>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>

      <div class="modal-body">
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher une activité..."
          />
        </div>

        <div class="selection-area">
          <div class="selection-column full-width">
            <h3>Choisissez une activité</h3>
            <select v-model="selectedActivity" :disabled="filteredActivities.length === 0">
              <option disabled :value="null">-- Sélectionnez --</option>
              <option
                v-for="activity in filteredActivities"
                :key="activity.id"
                :value="activity"
              >
                {{ activity.name }} -  {{ activity.city }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">Annuler</button>
        <button
          @click="submitToPlanning"
          :disabled="!selectedActivity"
          class="btn-primary"
        >
          Ajouter au planning
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color:black;
}

.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  min-width: 400px;
  max-width: 90%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}



.modal-header,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 16px;
}

.search-bar input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
}

.selection-area {
  display: flex;
  flex-direction: column;
}

.selection-column {
  width: 100%;
  margin: 1rem 0 1rem 0;
}

.modal-overlay h3 {
  margin-bottom: 0.5rem;
}

.full-width {
  width: 100%;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary {
  background-color: black;
  color: white;
}

.btn-secondary {
  background-color: #e5e7eb;
}
</style>