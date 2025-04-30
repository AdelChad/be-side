<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import { useRoute } from 'vue-router'
    import ActivityCard from '../../components/activities/ActivityCard.vue'

    const route = useRoute()
    const searchType = route.query.type as 'restaurant' | 'activity' | undefined
    const distance = route.query.distance as string | undefined
    const tags = computed(() => {
        const tagsQuery = route.query.tags as string | undefined
        return tagsQuery ? tagsQuery.split(',') : []
    })

    const loading = ref(true)
    const activities = ref([])

    const mockActivities = [
        {
        id: '1',
        title: 'Randonnée des Calanques',
        image: 'https://images.pexels.com/photos/917494/pexels-photo-917494.jpeg',
        location: 'Marseille, France',
        rating: 4.8,
        type: 'activity'
        },
        {
        id: '2',
        title: 'Tour de la Grande Roue',
        image: 'https://images.pexels.com/photos/3204950/pexels-photo-3204950.jpeg',
        location: 'Paris, France',
        rating: 4.5,
        type: 'activity'
        },
        {
        id: '3',
        title: 'Visite de Disneyland',
        image: 'https://images.pexels.com/photos/5107128/pexels-photo-5107128.jpeg',
        location: 'Marne-la-Vallée, France',
        rating: 4.9,
        type: 'activity'
        },
        {
        id: '4',
        title: 'Randonnée des Gorges',
        image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg',
        location: 'Verdon, France',
        rating: 4.7,
        type: 'activity'
        },
        {
        id: '5',
        title: 'Bar de Nuit Étoilé',
        image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg',
        location: 'Lyon, France',
        rating: 4.6,
        type: 'restaurant'
        },
        {
        id: '6',
        title: 'Randonnée des Cirques',
        image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
        location: 'Réunion, France',
        rating: 4.9,
        type: 'activity'
        }
    ]

    const mockRestaurants = [
        {
        id: '7',
        title: 'Restaurant des Frites',
        image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
        location: 'Lille, France',
        rating: 4.3,
        type: 'restaurant'
        },
        {
        id: '8',
        title: 'Pizzeria des Gones',
        image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg',
        location: 'Lyon, France',
        rating: 4.5,
        type: 'restaurant'
        },
        {
        id: '9',
        title: 'Le Grand Restaurant',
        image: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg',
        location: 'Paris, France',
        rating: 4.8,
        type: 'restaurant'
        },
        {
        id: '10',
        title: 'Restaurant du Port',
        image: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
        location: 'Marseille, France',
        rating: 4.6,
        type: 'restaurant'
        },
        {
        id: '11',
        title: 'Restaurant du Marché',
        image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
        location: 'Bordeaux, France',
        rating: 4.4,
        type: 'restaurant'
        },
        {
        id: '12',
        title: 'Restaurant de la Mer',
        image: 'https://images.pexels.com/photos/735869/pexels-photo-735869.jpeg',
        location: 'Nice, France',
        rating: 4.7,
        type: 'restaurant'
        }
    ]

    // Duplicate the data to have more results
    const duplicateData = (data: any[], times: number) => {
        let result = [...data]
        for (let i = 1; i < times; i++) {
        const newItems = data.map(item => ({
            ...item,
            id: `${item.id}-${i}`
        }))
        result = [...result, ...newItems]
        }
        return result
    }

    onMounted(() => {
        // Simulate API call
        setTimeout(() => {
        if (searchType === 'restaurant') {
            activities.value = duplicateData(mockRestaurants, 3)
        } else if (searchType === 'activity') {
            activities.value = duplicateData(mockActivities, 3)
        } else {
            // If no type specified, show both
            activities.value = duplicateData([...mockActivities, ...mockRestaurants], 2)
        }
        loading.value = false
        }, 1000)
    })

    const resultsCount = computed(() => activities.value.length)
</script>

<template>
    <div class="search-results-view">
        <div class="container">
            <div class="results-header">
                <h1 class="results-title">{{ resultsCount }} activités trouvées</h1>
                <div class="filters">
                    <div class="filter-item" v-if="searchType">
                    <span class="filter-label">Type:</span>
                    <span class="filter-value">{{ searchType === 'restaurant' ? 'Restaurant' : 'Activité' }}</span>
                    </div>
                    <div class="filter-item" v-if="distance">
                    <span class="filter-label">Distance:</span>
                    <span class="filter-value">{{ distance }}km</span>
                    </div>
                    <div class="filter-item" v-if="tags.length">
                    <span class="filter-label">Tags:</span>
                    <div class="filter-tags">
                        <span 
                        v-for="(tag, index) in tags" 
                        :key="index"
                        class="filter-tag"
                        >
                        {{ tag }}
                        </span>
                    </div>
                    </div>
                </div>
            </div>
            
            <div v-if="loading" class="loading">
                <div class="loading-spinner"></div>
                <p>Chargement des résultats...</p>
            </div>
            
            <div v-else class="results-grid">
                <ActivityCard 
                    v-for="activity in activities" 
                    :key="activity['id']" 
                    :activity="activity" 
                />
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
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
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