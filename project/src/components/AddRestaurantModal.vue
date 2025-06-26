<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { selectedPlanningId } from '../stores/planning'

    const emits = defineEmits(['close', 'add'])

    const token = localStorage.getItem('access_token')
    const restaurants = ref([])

    const searchQuery = ref('')
    const selectedRestaurant = ref(null)

    const props = defineProps({
        selectedTime: {
            type: [String, null],
            required: true
        }
    })

    const filteredRestaurants = computed(() =>
        restaurants.value.filter(a =>
            a.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    )

    onMounted(async () => {
        if (!token) return

        try {
            const restaurantsRes = await fetch(`http://localhost:3000/restaurants`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            if (!restaurantsRes.ok) {
                throw new Error('Erreur de récupération des données')
            }

            const restaurantsData = await restaurantsRes.json()

            restaurants.value = restaurantsData.map(r => ({
                id: r.id,
                name: r.name,
            }))

        } catch (error) {
            console.error('Erreur lors de la récupération des restaurants :', error)
        }
    })

    async function submitToPlanning() {
        if (!selectedRestaurant.value) {
            console.error("Restaurant ou créneau horaire manquant");
            return;
        }

        if (!selectedPlanningId.value) {
            console.error("L'id du planning est manquant !");
            return;
        }
        
        try {
            const payload = {
                id: selectedPlanningId.value,
                activities: [],
                restaurants: [
                    {
                    id: selectedRestaurant.value.id,
                    time: props.selectedTime,
                    },
                ],
            };

            const response = await fetch('http://localhost:3000/plannings/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || `Erreur ${response.status}`);
            }

            const updatedPlanning = await response.json();
            emits('close');
        } catch (err) {
            console.error("Erreur lors de la mise à jour du planning :", err);
        }
    }
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>➕ Ajouter un restaurant au planning</h2>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>

      <div class="modal-body">
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher un restaurant..."
          />
        </div>

        <div class="selection-area">
          <div class="selection-column full-width">
            <h3>Choisissez un retaurant</h3>
            <select v-model="selectedRestaurant" :disabled="filteredRestaurants.length === 0">
              <option disabled :value="null">-- Sélectionnez --</option>
              <option
                v-for="restaurant in filteredRestaurants"
                :key="restaurant.id"
                :value="restaurant"
              >
                {{ restaurant.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">Annuler</button>
        <button
          @click="submitToPlanning"
          :disabled="!selectedRestaurant"
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
  background-color: #3b82f6;
  color: white;
}

.btn-secondary {
  background-color: #e5e7eb;
}
</style>