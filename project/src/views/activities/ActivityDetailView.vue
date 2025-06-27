<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { library } from '@fortawesome/fontawesome-svg-core'
    import {  faHeart, faLocationDot, faStar, faShare, faPhone } from '@fortawesome/free-solid-svg-icons'
    library.add(faHeart,faStar,faLocationDot,faShare, faPhone)

    const route = useRoute()

  interface Activity {
  id: string
  name: string
  photo: string
  photos?: string[]
  country: string
  address: string
  city: string
  rating: number
  phoneNumber: string 
  type: 'activity'
  categActiv: {
    id: string
    name: string
  }[] 
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
    
    const currentImageIndex = ref(0)

    function prevImage() {
        if (!activity.value?.photos?.length) return;
        currentImageIndex.value = (currentImageIndex.value - 1 + activity.value.photos.length) % activity.value.photos.length
    }

    function nextImage() {
        if (!activity.value?.photos?.length) return;
        currentImageIndex.value = (currentImageIndex.value + 1) % activity.value.photos.length
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
      <div class="detail-card layout-split">
        <!-- COLONNE GAUCHE -->
        <div class="left-info">
          <h1 class="activity-title">{{ activity?.name }}</h1>
          <p class="activity-location">{{ activity?.address }}</p>

          <div class="activity-rating">
            <span class="star-icon"><font-awesome-icon :icon="['fas', 'star']" class="fa-plus-icon" /></span>
            <span>{{ activity?.rating }}</span>
          </div>
        <div class="activity-tags">
          <span 
            class="activity-tag" 
            v-for="(categ) in activity?.categActiv" 
            :key="categ.id"
          >
            {{ categ.name }}
          </span>
        </div>
          <div class="description-title">Description</div>
          <div class="activity-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nulla enim, imperdiet at volutpat nec, rhoncus in lorem. Vestibulum luctus sit amet massa nec cursus. Ut ut nunc leo. Mauris egestas laoreet sem ac pellentesque. Proin ultrices leo ut laoreet pretium. Integer lacinia euismod magna, nec posuere ex accumsan vel. Etiam vulputate nisi eget libero tristique, a maximus arcu efficitur. Nunc ac leo malesuada dolor ultricies malesuada.
          </div>

          <div class="activity-actions">
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

        <!-- COLONNE DROITE -->
        <div class="right-gallery">
          <div class="main-image-container">
            <img :src="activity?.photos?.[currentImageIndex] || activity?.photo" class="main-image" />
          </div>
          <div class="thumbnail-carousel">
            <img
              v-for="(img, index) in activity?.photos"
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
        max-width: 1000px;
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

    .description-title {
        font-weight: 600;
        margin-bottom: var(--space-2);
    }

    .activity-description { 
        font-weight:300;
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
        margin-bottom: var(--space-2);
    }

    .activity-tag {
        padding: var(--space-1) var(--space-2);
        background-color: var(--color-neutral-100);
        border-radius: 20px;
        font-size: 0.875rem;
        color: var(--color-neutral-700);
        margin:0.1rem;
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

    .layout-split {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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