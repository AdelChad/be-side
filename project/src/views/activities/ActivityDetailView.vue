<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'

    const route = useRoute()

    interface Activity {
        id: string
        name: string
        photo: string
        country: string
        address: string
        city: string
        rating: number
        phoneNumber: string 
        type: 'activity'
    }

    const activity = ref<Activity>()
    const token = localStorage.getItem('access_token') 
    const activityId = route.params.id as string

    onMounted(async () => {
        console.log(activityId);
        
        try {
            const activitiesAPI = await fetch(`http://localhost:3000/activities/${activityId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!activitiesAPI.ok) {
                throw new Error('Failed to fetch activities')
            }

            activity.value = await activitiesAPI.json()
            document.title = `${activity.value?.name} | BeSide`
            
        } catch (error) {
            console.log('Error fetching activities:', error)
        }
    })
    
    const isFavorite = ref(false)
    
    function toggleFavorite() {
        isFavorite.value = !isFavorite.value
    }
    
    //const currentImageIndex = ref(0)
    // function prevImage() {
    //     if (currentImageIndex.value > 0) {
    //         currentImageIndex.value--
    //     } else {
    //         currentImageIndex.value = activity.value?.photo.length - 1
    //     }
    // }

    // function nextImage() {
    //     if (currentImageIndex.value < activity.value?.photo.length - 1) {
    //         currentImageIndex.value++
    //     } else {
    //         currentImageIndex.value = 0
    //     }
    // }
</script>

<template>
    <div class="activity-detail-view">
        <div class="activity-background" :style="{ backgroundImage: `url(${activity?.photo})` }"></div>
        
        <div class="container detail-container">
            <div class="detail-card">
                <div class="activity-header">
                    <div>
                        <h1 class="activity-title">{{ activity?.name }}</h1>
                        <p class="activity-location">{{ activity?.address }}</p>
                        <div class="activity-rating">
                            <span class="star-icon">✆</span>
                            <span>{{ activity?.phoneNumber }}</span>
                        </div>
                        <div class="activity-rating">
                            <span class="star-icon">★</span>
                            <span>{{ activity?.rating }}</span>
                        </div>
                    </div>
                </div>
                
                <!-- <div class="activity-tags">
                    <span 
                    v-for="(tag, index) in activity.tags" 
                    :key="index"
                    class="activity-tag"
                    >
                    {{ tag }}
                    </span>
                </div>
                
                <div class="activity-description">
                    <h3 class="section-title">Description</h3>
                    <p>{{ activity.description }}</p>
                </div>
                
                <div class="activity-gallery">
                    <button class="gallery-nav gallery-prev" @click="prevImage" aria-label="Previous image">
                    &lt;
                    </button>
                    <div class="gallery-images">
                        <img 
                            v-for="(image, index) in activity.images" 
                            :key="index"
                            :src="image"
                            :alt="`${activity.title} ${index + 1}`"
                            :class="['gallery-image', { active: index === currentImageIndex }]"
                        >
                    </div>
                    <button class="gallery-nav gallery-next" @click="nextImage" aria-label="Next image">
                        &gt;
                    </button>
                </div> -->
                
                <div class="activity-actions">
                    <button 
                    :class="['action-btn favorite-btn', { 'favorite-active': isFavorite }]" 
                    @click="toggleFavorite"
                    aria-label="Add to favorites"
                    >
                        <span class="action-icon heart-icon">♥</span>
                    </button>
                    <button class="action-btn share-btn" aria-label="Share">
                        <span class="action-icon">↗</span>
                    </button>
                    <button class="action-btn call-btn" aria-label="Call">
                        <span class="action-icon">📞</span>
                    </button>
                    <button class="action-btn directions-btn" aria-label="Get directions">
                        <span class="action-icon">⤧</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .activity-detail-view {
        position: relative;
        min-height: 100vh;
        padding-top: var(--space-6);
    }

    .activity-background {
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
        max-width: 700px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .activity-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-3);
    }

    .activity-title {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: var(--space-2);
    }

    .activity-location {
        color: var(--color-neutral-600);
        margin-bottom: var(--space-2);
    }

    .activity-rating {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: var(--space-2);
    }

    .star-icon {
        color: var(--color-accent);
    }

    .activity-price {
        font-weight: 600;
        color: var(--color-neutral-700);
    }

    .activity-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-bottom: var(--space-4);
    }

    .activity-tag {
        padding: var(--space-1) var(--space-2);
        background-color: var(--color-neutral-100);
        border-radius: 20px;
        font-size: 0.875rem;
        color: var(--color-neutral-700);
    }

    .activity-description {
        margin-bottom: var(--space-4);
    }

    .section-title {
        font-weight: 600;
        margin-bottom: var(--space-2);
    }

    .activity-gallery {
        position: relative;
        margin-bottom: var(--space-4);
        display: flex;
        align-items: center;
    }

    .gallery-images {
        display: flex;
        gap: var(--space-2);
        overflow-x: hidden;
        padding: var(--space-2) 0;
    }

    .gallery-image {
        width: 100px;
        height: 70px;
        object-fit: cover;
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
        opacity: 0.7;
    }

    .gallery-image.active {
        opacity: 1;
        transform: scale(1.05);
    }

    .gallery-nav {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-neutral-200);
        color: var(--color-primary);
        border: none;
        cursor: pointer;
        transition: background-color var(--transition-fast);
    }

    .gallery-nav:hover {
        background-color: var(--color-neutral-300);
    }

    .activity-actions {
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

    @media (min-width: 768px) {
        .detail-card {
            padding: var(--space-5);
        }
        
        .activity-title {
            font-size: 2.2rem;
        }
        
        .activity-gallery {
            margin: var(--space-4) 0;
        }
        
        .gallery-image {
            width: 120px;
            height: 80px;
        }
    }
</style>