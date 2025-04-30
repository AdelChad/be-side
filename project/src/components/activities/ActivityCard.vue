<script setup lang="ts">
    import { ref } from 'vue'

    const props = defineProps<{
        activity: {
            id: string
            name: string
            photo: string
            country: string
            address: string
            city: string
            rating: number
            phoneNumber: string 
            type: 'activity' | 'restaurant'
        }
    }>()

    const isFavorite = ref(false)

    function toggleFavorite() {
        isFavorite.value = !isFavorite.value
    }
</script>

<template>
    <div class="activity-card">
        <div class="activity-image-container">
            <router-link 
                :to="activity.type === 'activity' ? `/activities/${activity.id}` : `/restaurants/${activity.id}`"
            >
                <img :src="activity.photo" :alt="activity.name" class="activity-image">
            </router-link>

            <button 
                :class="['favorite-btn', { 'favorite-active': isFavorite }]" 
                @click="toggleFavorite"
                :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
            >
                <span class="heart-icon">♥</span>
            </button>

            <div class="activity-overlay">
                <h3 class="activity-title">{{ activity.name }}</h3>
                <p class="activity-location">{{ activity.address }}</p>
                <div class="activity-rating">
                    <span class="star-icon">★</span>
                    <span>{{ activity.rating }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .activity-card {
        border-radius: var(--radius-lg);
        overflow: hidden;
        transition: transform var(--transition-normal);
        height: 100%;
    }

    .activity-card:hover {
        transform: translateY(-8px);
    }

    .activity-image-container {
        position: relative;
        aspect-ratio: 3/4;
        overflow: hidden;
        border-radius: var(--radius-lg);
    }

    .activity-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-normal);
    }

    .activity-card:hover .activity-image {
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

    .activity-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
        padding: var(--space-3);
        color: var(--color-secondary);
        transition: opacity var(--transition-fast);
    }

    .activity-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .activity-location {
        font-size: 0.875rem;
        opacity: 0.9;
        margin-bottom: 0.5rem;
    }

    .activity-rating {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.875rem;
    }

    .star-icon {
        color: var(--color-accent);
    }
</style>