<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import ActivityCard from '../components/activities/ActivityCard.vue'
    import RestaurantCard from '../components/restaurants/RestaurantCard.vue'

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

    interface Restaurant {
        id: string
        name: string
        photo: string
        country: string
        address: string
        city: string
        rating: number
        phoneNumber: string 
        type: 'restaurant'
    }

    const activities = ref<Activity[]>([])
    const restaurants = ref<Restaurant[]>([])

    onMounted(async () => {
        try {
            const activitiesAPI = await fetch('http://localhost:3000/activities/carrousel', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const restaurantAPI = await fetch('http://localhost:3000/restaurants/carrousel', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!activitiesAPI.ok || !restaurantAPI.ok) {
                throw new Error('Failed to fetch activities')
            }

            const activitie = await activitiesAPI.json()
            activities.value = activitie.map((item: Omit<Activity, 'type'>) => ({
                ...item,
                type: 'activity'
            }))

            const restaurant = await restaurantAPI.json()
            restaurants.value = restaurant.map((item: Omit<Restaurant, 'type'>) => ({
                ...item,
                type: 'restaurant'
            }))
        } catch (error) {
            console.log('Error fetching activities:', error)
        }
    })

    const currentSlide = ref(0)
    const autoplayInterval = ref<number | null>(null)

    function startAutoplay() {
        if (autoplayInterval.value) clearInterval(autoplayInterval.value)
        autoplayInterval.value = setInterval(() => {
            nextSlide()
        }, 5000) as unknown as number
    }

    function stopAutoplay() {
        if (autoplayInterval.value) {
            clearInterval(autoplayInterval.value)
            autoplayInterval.value = null
        }
    }

    function nextSlide() {
        currentSlide.value = (currentSlide.value + 1) % 3
    }

    function prevSlide() {
        currentSlide.value = (currentSlide.value - 1 + 3) % 3
    }

    function goToSlide(index: number) {
        currentSlide.value = index
    }
</script>

<template>
    <div class="home">
        <section class="hero">
            <div class="hero-slider" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
                <div class="hero-slide" :class="{ active: currentSlide === 0 }">
                    <img src="https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg" alt="BeSide Hero" class="hero-image">
                    <div class="hero-content container">
                    <h1 class="hero-title">Trouvez votre prochaine expérience en un clin d'oeil</h1>
                    <p class="hero-subtitle"> Explorez les meilleures sorties, sans perdre de temps.</p>
                    <router-link to="/search" class="btn btn-primary hero-cta">Commencer maintenant</router-link>
                    </div>
                </div>
                <div class="hero-slide" :class="{ active: currentSlide === 1 }">
                    <img src="https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg" alt="BeSide Activities" class="hero-image">
                    <div class="hero-content container">
                    <h1 class="hero-title">Des activités pour tous les goûts</h1>
                    <p class="hero-subtitle">Découvrez de nouvelles aventures et partagez-les avec vos amis.</p>
                    <router-link to="/search" class="btn btn-primary hero-cta">Explorer les activités</router-link>
                    </div>
                </div>
                <div class="hero-slide" :class="{ active: currentSlide === 2 }">
                    <img src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg" alt="BeSide Restaurants" class="hero-image">
                    <div class="hero-content container">
                    <h1 class="hero-title">Découvrez les meilleurs restaurants</h1>
                    <p class="hero-subtitle">Des expériences culinaires à partager et à immortaliser.</p>
                    <router-link to="/search" class="btn btn-primary hero-cta">Trouver un restaurant</router-link>
                    </div>
                </div>
                <button class="hero-nav hero-nav-prev" @click="prevSlide" aria-label="Previous slide">
                    &lt;
                </button>
                <button class="hero-nav hero-nav-next" @click="nextSlide" aria-label="Next slide">
                    &gt;
                </button>
                <div class="hero-dots">
                    <button 
                    v-for="n in 3" 
                    :key="n" 
                    @click="goToSlide(n-1)"
                    :class="['hero-dot', { active: currentSlide === n-1 }]"
                    :aria-label="`Go to slide ${n}`"
                    ></button>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="search-banner">
            <div class="container">
                <div class="search-card">
                    <h2 class="search-title">Marre des listes interminables ? Trouvez enfin ce qui vous correspond !</h2>
                    <p class="search-description">Une recherche interactive pour des expériences sur-mesure.</p>
                    <router-link to="/search" class="btn btn-primary search-btn">Personnaliser ma recherche</router-link>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <h2 class="section-title">Vos sorties, à votre image</h2>
                <div class="grid grid-cols-2 grid-cols-3 grid-cols-4">
                    <ActivityCard 
                    v-for="activity in activities" 
                    :key="activity.id" 
                    :activity="activity" 
                    />
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <h2 class="section-title">Ne cherchez plus, dégustez !</h2>
                <div class="grid grid-cols-2 grid-cols-3 grid-cols-4">
                    <RestaurantCard 
                    v-for="restaurant in restaurants" 
                    :key="restaurant.id" 
                    :restaurant="restaurant" 
                    />
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
    .home {
        overflow-x: hidden;
    }

    .hero {
        height: 100vh;
        position: relative;
        overflow: hidden;
    }

    .hero-slider {
        position: relative;
        height: 100%;
    }

    .hero-slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity var(--transition-slow);
        z-index: 1;
    }

    .hero-slide.active {
        opacity: 1;
        z-index: 2;
    }

    .hero-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: brightness(0.7);
    }

    .hero-content {
        position: absolute;
        bottom: 30%;
        left: 0;
        right: 0;
        z-index: 3;
        color: var(--color-secondary);
        max-width: 800px;
        margin: 0 auto;
    }

    .hero-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: var(--space-3);
        line-height: 1.2;
    }

    .hero-subtitle {
        font-size: 1.2rem;
        margin-bottom: var(--space-4);
        max-width: 600px;
    }

    .hero-cta {
        font-size: 1.1rem;
        padding: var(--space-2) var(--space-4);
    }

    .hero-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.3);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 1.5rem;
        z-index: 4;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background var(--transition-fast);
    }

    .hero-nav:hover {
        background: rgba(0, 0, 0, 0.6);
    }

    .hero-nav-prev {
        left: var(--space-4);
    }

    .hero-nav-next {
        right: var(--space-4);
    }

    .hero-dots {
        position: absolute;
        bottom: var(--space-4);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: var(--space-2);
        z-index: 4;
    }

    .hero-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        border: none;
        cursor: pointer;
        transition: background var(--transition-fast);
    }

    .hero-dot.active {
        background: var(--color-secondary);
    }

    .search-banner {
        padding: var(--space-6) 0;
        background-color: var(--color-neutral-900);
    }

    .search-card {
        background-color: var(--color-neutral-800);
        padding: var(--space-5);
        border-radius: var(--radius-lg);
        text-align: center;
    }

    .search-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: var(--space-3);
        color: var(--color-secondary);
        line-height: 1.3;
    }

    .search-description {
        color: var(--color-neutral-300);
        margin-bottom: var(--space-4);
        font-size: 1.1rem;
    }

    .search-btn {
        padding: var(--space-2) var(--space-5);
        font-size: 1.1rem;
    }

    .section {
        padding: var(--space-6) 0;
    }

    .section-title {
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: var(--space-4);
        color: var(--color-secondary);
    }

    @media (min-width: 768px) {
        .hero-title {
            font-size: 3.5rem;
        }
        
        .hero-subtitle {
            font-size: 1.4rem;
        }
    }

    @media (min-width: 1024px) {
        .hero-title {
            font-size: 4rem;
        }
    }
</style>