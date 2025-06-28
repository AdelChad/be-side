<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFavoritesStore } from '../../stores/fav';
import { useUserStore } from '../../stores/user';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {  faHeart, faLocationDot, faStar, faShare, faPhone } from '@fortawesome/free-solid-svg-icons'
library.add(faHeart,faStar,faLocationDot,faShare, faPhone)

const restaurant = ref<Restaurant>()
const route = useRoute()

    const favoritesStore = useFavoritesStore()
    const store = useUserStore()

    const isFavorite = computed(() => {
  if (!restaurant.value) return false
  return store.isFavorite(Number(restaurant.value.id), 'restaurant')
})

function toggleFavorite() {
  if (!restaurant.value) return
  favoritesStore.toggleFavorite({
    ...restaurant.value,
    type: 'restaurant'
  })
}

interface Restaurant {
  id: string
  name: string
  photo: string
  photos?: string[]
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

const token = localStorage.getItem('access_token')
const restaurantId = route.params.id as string

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3000/restaurants/${restaurantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch restaurant')
    }

    restaurant.value = await response.json()
    document.title = `${restaurant.value?.name} | BeSide`
  } catch (error) {
    console.error('Error fetching restaurant:', error)
  }
})

const currentImageIndex = ref(0)

function prevImage() {
  if (!restaurant.value?.photos?.length) return
  currentImageIndex.value =
    (currentImageIndex.value - 1 + restaurant.value.photos.length) %
    restaurant.value.photos.length
}

function nextImage() {
  if (!restaurant.value?.photos?.length) return
  currentImageIndex.value =
    (currentImageIndex.value + 1) % restaurant.value.photos.length
}
</script>

<template>
  <div class="restaurant-detail-view">
    <div class="restaurant-background" :style="{ backgroundImage: `url(${restaurant?.photo})` }"></div>

    <div class="container detail-container">
      <div class="detail-card layout-split">
        <!-- Colonne gauche -->
        <div class="left-info">
          <h1 class="restaurant-title">{{ restaurant?.name }}</h1>
          <p class="restaurant-location">{{ restaurant?.address }}</p>
          <div class="restaurant-rating">
            <span class="star-icon"><font-awesome-icon :icon="['fas', 'star']" class="fa-plus-icon" /></span>
            <span>{{ restaurant?.rating }}</span>
          </div>
          <div class="restaurant-tags">
          <span 
            class="restaurant-tag" 
            v-for="(categ) in restaurant?.categRestau" 
            :key="categ.id"
          >
            {{ categ.name }}
          </span>
          </div>
          <div class="description-title">Description</div>
          <div class="restaurant-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nulla enim, imperdiet at volutpat nec, rhoncus in lorem. Vestibulum luctus sit amet massa nec cursus.
          </div>

          <div class="restaurant-actions">
            <button :class="['action-btn favorite-btn', { 'favorite-active': isFavorite }]" @click="toggleFavorite">
              <span class="action-icon heart-icon"><font-awesome-icon :icon="['fas', 'heart']" class="fa-plus-icon" /></span>
            </button>
            <button class="action-btn share-btn">
              <span class="action-icon"><font-awesome-icon :icon="['fas', 'share']" class="fa-plus-icon" /></span>
            </button>
            <button class="action-btn call-btn">
              <span class="action-icon"><font-awesome-icon :icon="['fas', 'phone']" class="fa-plus-icon" /></span>
            </button>
            <button class="action-btn directions-btn">
              <span class="action-icon"><font-awesome-icon :icon="['fas', 'location-dot']" class="fa-plus-icon" /></span>
            </button>
          </div>
        </div>

        <!-- Colonne droite -->
        <div class="right-gallery">
          <div class="main-image-container">
            <img :src="restaurant?.photos?.[currentImageIndex] || restaurant?.photo" class="main-image" />
          </div>
          <div class="thumbnail-carousel">
            <img
              v-for="(img, index) in restaurant?.photos"
              :key="index"
              :src="img"
              :class="['thumbnail', { active: index === currentImageIndex }]"
              @click="currentImageIndex = index"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.restaurant-detail-view {
  position: relative;
  min-height: 100vh;
  padding-top: var(--space-6);
}

.restaurant-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: blur(8px) brightness(0.3);
  z-index: -1;
}

.detail-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-4);
}

.detail-card {
  background-color: var(--color-secondary);
  color: var(--color-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  width: 100%;
  max-width: 1000px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.restaurant-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.description-title {
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.restaurant-description {
  font-weight: 300;
  margin-bottom: var(--space-4);
}

.restaurant-location {
  color: var(--color-neutral-600);
  margin-bottom: var(--space-2);
}

.restaurant-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: var(--space-2);
}

.star-icon {
  color: var(--color-accent);
}

.restaurant-actions {
  display: flex;
  justify-content: space-around;
}

.action-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-neutral-100);
  color: var(--color-primary);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background-color: var(--color-neutral-200);
}

.favorite-btn.favorite-active {
  color: var(--color-error);
}

.action-icon {
  font-size: 1.25rem;
}

.main-image-container {
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.main-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: var(--radius-lg);
}

.thumbnail-carousel {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  cursor: pointer;
  opacity: 0.7;
  transition: transform 0.2s, opacity 0.2s;
}

.thumbnail:hover,
.thumbnail.active {
  transform: scale(1.05);
  opacity: 1;
}

.layout-split {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

   .restaurant-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-bottom: var(--space-2);
    }

    .restaurant-tag {
        padding: var(--space-1) var(--space-2);
        background-color: var(--color-neutral-100);
        border-radius: 20px;
        font-size: 0.875rem;
        color: var(--color-neutral-700);
        margin:0.1rem;
    }

@media (min-width: 768px) {
  .layout-split {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .left-info {
    flex: 1;
    padding-right: 1.5rem;
  }

  .right-gallery {
    flex: 1;
    max-width: 50%;
  }

  .main-image-container {
    height: 80vh;
    overflow: hidden;
    border-radius: var(--radius-lg);
  }

  .main-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: var(--radius-lg);
  }

  .thumbnail-carousel {
    display: flex;
    gap: 10px;
    margin-top: 1rem;
    overflow-x: auto;
  }

  .thumbnail {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    cursor: pointer;
    opacity: 0.7;
    transition: transform 0.2s, opacity 0.2s;
  }

  .thumbnail:hover,
  .thumbnail.active {
    transform: scale(1.05);
    opacity: 1;
  }
}
</style>
