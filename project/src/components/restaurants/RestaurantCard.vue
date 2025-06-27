<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useFavoritesStore } from '../../stores/fav'
import { useUserStore } from '../../stores/user'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {  faHeart, faLocationDot, faStar, faShare, faPhone } from '@fortawesome/free-solid-svg-icons'
library.add(faHeart,faStar,faLocationDot,faShare, faPhone)

const props = defineProps<{
  restaurant: {
    id: number
    name: string
    photo: string
    country: string
    address: string
    city: string
    rating: number
    phoneNumber: string
    type: 'restaurant'
    categRestau: {
    id: string
    name: string
  }[]
  }
}>()

const store = useUserStore()
const favoritesStore = useFavoritesStore()

const isFavorite = computed(() =>
  store.isFavorite(props.restaurant.id, props.restaurant.type)
)

function toggleFavorite() {
  favoritesStore.toggleFavorite(props.restaurant)
}

onMounted(async () => {
  await store.fetchCurrentUser()
  await Promise.all([
    store.fetchFavoriteRestaurants()
  ])
})
</script>

<template>
  <div class="restaurant-card">
    <div class="restaurant-image-container">
      <router-link :to="`/restaurants/${restaurant.id}`">
        <img :src="restaurant.photo" :alt="restaurant.name" class="restaurant-image" />
      </router-link>

      <button
        :class="['favorite-btn', { 'favorite-active': isFavorite }]"
        @click="toggleFavorite"
        :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      >
        <span class="heart-icon"><font-awesome-icon :icon="['fas', 'heart']" class="fa-plus-icon" /></span>
      </button>

      <div class="restaurant-overlay">
        <h3 class="restaurant-title">{{ restaurant.name }}</h3>
        <p class="restaurant-location">{{ restaurant.address }}</p>
        <div class="restaurant-rating">
          <span class="star-icon"><font-awesome-icon :icon="['fas', 'star']" class="fa-plus-icon" /></span>
          <span>{{ restaurant.rating }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.restaurant-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform var(--transition-normal);
  height: 100%;
}

.restaurant-card:hover {
  transform: translateY(-8px);
}

.restaurant-image-container {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.restaurant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.restaurant-card:hover .restaurant-image {
  transform: scale(1.05);
}

.favorite-btn {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: background-color var(--transition-fast);
}

.favorite-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.heart-icon {
  color: white;
  font-size: 1.25rem;
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.favorite-active .heart-icon {
  color: var(--color-error);
  transform: scale(1.2);
}

.restaurant-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
  padding: var(--space-3);
  color: var(--color-secondary);
  transition: opacity var(--transition-fast);
}

.restaurant-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.restaurant-location {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.restaurant-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
}

.star-icon {
  color: var(--color-accent);
}
</style>
