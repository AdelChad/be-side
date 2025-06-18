<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import ActivityCard from '../../components/activities/ActivityCard.vue'
import { useSearchStore } from '../../stores/searchStore'


const route = useRoute()
const searchStore = useSearchStore()

const type = computed(() => (route.query.type as 'activity' | 'restaurant') || 'activity')
const distance = computed(() => (route.query.distance as string) || '')
const tags = computed(() => (route.query.tags ? (route.query.tags as string).split(',') : []) as string[])

watchEffect(() => {
    const search = route.query.search as string || ''
    const city = route.query.city as string || ''
    const tags = route.query.tags as string[] || ''
    const type = route.query.type as 'activity' | 'restaurant'

    if (!search && !city && !type) return

    searchStore.fetchSearchResults(search, city, tags, type)
})

const resultsList = computed(() => {
    return useSearchStore().results
})

const resultsCount = computed(() => resultsList.value.length)
</script>

<template>
  <div class="search-results-view">
    <div class="container">
      
      <div v-if="searchStore.loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Chargement des résultats...</p>
      </div>

      <div v-else>
        <div class="results-header">
          <h1 class="results-title">{{ resultsCount }} résultat(s) trouvée(s)</h1>
          <div class="filters">
            <div class="filter-item" v-if="type">
              <span class="filter-label">Type:</span>
              <span class="filter-value">{{ type === 'restaurant' ? 'Restaurant' : 'Activité' }}</span>
            </div>
            <div class="filter-item" v-if="distance">
              <span class="filter-label">Distance:</span>
              <span class="filter-value">{{ distance }}km</span>
            </div>
            <div class="filter-item" v-if="tags.length">
              <span class="filter-label">Tags:</span>
              <div class="filter-tags">
                <span v-for="(tag, index) in tags" :key="index" class="filter-tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!searchStore.loading && resultsList.length === 0">
          <p>Aucun résultat trouvé.</p>
        </div>

        <div v-else class="results-grid">
          <ActivityCard
            v-for="item in resultsList"
            :key="`${item.type}-${item.id}`"
            :activity="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.search-results-view {
    padding: var(--space-6) 0;
    min-height: calc(100vh - 140px);
}

.results-header {
    margin-bottom: var(--space-5);
}

.results-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: var(--space-3);
    color: var(--color-secondary);
}

.filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
}

.filter-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
}

.filter-label {
    font-weight: 600;
    color: var(--color-neutral-400);
}

.filter-value {
    color: var(--color-secondary);
}

.filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
}

.filter-tag {
    padding: var(--space-1) var(--space-2);
    background-color: var(--color-neutral-800);
    border-radius: 20px;
    font-size: 0.75rem;
    color: var(--color-secondary);
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-6) 0;
    color: var(--color-secondary);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-neutral-700);
    border-top: 3px solid var(--color-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: var(--space-3);
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-4);
}

@media (min-width: 768px) {
    .results-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1024px) {
    .results-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>