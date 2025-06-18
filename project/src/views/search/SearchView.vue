<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    interface activityTag {
        id: number
        name: string
        type: 'activity'
        selected: boolean
    }

    interface restaurantTag {
        id: number
        name: string
        type: 'restaurant'
        selected: boolean 
    }
    


    const activeStep = ref(0)
    const searchType = ref<'restaurant' | 'activity' | null>(null)

    const token = localStorage.getItem('access_token') 
    const activitiesTags = ref<activityTag[]>([])
    const restaurantsTags = ref<restaurantTag[]>([])
  


    const steps = [
        {
        id: 'type',
        title: 'Que recherches-tu ?',
        description: "Envie d’un bon repas ou d’une activité qui change du quotidien ? Démarrez votre recherche en choisissant le type de sortie qui correspond à votre humeur du moment. Une première étape pour créer une expérience à votre image !"
        },
        {
        id: 'distance',
        title: 'Jusqu\'où peut-on aller ?',
        description: "Que ce soit près de chez vous ou dans une ville à découvrir, indiquez la localisation idéale pour vivre votre prochaine sortie. Nous vous guidons vers les meilleures options autour de vous."
        },
        {
        id: 'preferences',
        title: 'Des exigences ?',
        description: "Pour que votre sortie soit parfaitement adaptée à vos attentes, sélectionnez les critères qui comptent le plus pour vous. Nous nous chargeons de trouver des lieux qui cochent toutes vos cases !"
        }
    ]

    const cities = ref ([
        {
            id:1,
            city: 'Paris',
            selected : false
        },
        {
            id:2,
            city: 'Lyon',
            selected : false
        },
        {
            id:3,
            city: 'Marseille',
            selected : false
        },
        {
            id:4,
            city: 'Toulouse',
            selected : false
        },
        {

            id:5,
            city: 'Nice',
            selected : false
        },
        {
            id:6,
            city: 'Bordeaux',
            selected : false
        },
        {
            id:7,
            city: 'Nantes',
            selected : false
        },
        {
            id:8,
            city: 'Strasbourg',
            selected : false
        },
        {
            id:9,
            city: 'Montpellier',
            selected : false
        },
        {
            id:10,
            city: 'Lille',
            selected : false
        }
    ])

    onMounted(async () => {
        try {
            const activitiesAPI = await fetch('http://localhost:3000/categ-activ/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const restaurantAPI = await fetch('http://localhost:3000/categ-restau/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!activitiesAPI.ok || !restaurantAPI.ok) {
                throw new Error('Failed to fetch activities')
            }
            
            
            const activitie = await activitiesAPI.json()
    
            
            activitiesTags.value = activitie.map((item: Omit<activityTag, 'type'>) => ({
                ...item,
                type: 'activity',
                selected: false
            }))
            

            const restaurant = await restaurantAPI.json()
            restaurantsTags.value = restaurant.map((item: Omit<restaurantTag, 'type'>) => ({
                ...item,
                type: 'restaurant',
                selected: false
            }))
            
        } catch (error) {
            console.log('Error fetching tags:', error)
        }
    })



    function selectType(type: 'restaurant' | 'activity') {
        searchType.value = type
    }

    async function nextStep() {
    if (activeStep.value === 0 && !searchType.value) {
            console.error("Aucun type sélectionné.");
            return;
        }

        if (activeStep.value < steps.length - 1) {
            activeStep.value++;
            return;
        }

        const isActivity = searchType.value === 'activity';

        const selectedCities = cities.value
            .filter(city => city.selected)
            .map(city => city.city);

        const selectedTags = (isActivity ? activitiesTags.value : restaurantsTags.value)
            .filter(tag => tag.selected)
            .map(tag => tag.name);

        try {
            router.push({
                name: 'search-results',
                query: {
                    search: '',
                    type: searchType.value,
                    tags: selectedTags.join(','),
                    city: selectedCities.join(',')
                }
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des résultats :', error);
        }
    }

    function toggleTag(tagId: number, tagType: string | void) {
        if (tagType == "activity") {
            const tag = activitiesTags.value.find(t => t.id === tagId)
            if (tag) {
                tag.selected = !tag.selected
                 console.log(tag)
            }
        }
        else if (tagType == "restaurant") {
            const tag = restaurantsTags.value.find(t => t.id === tagId)
            if (tag) {
                tag.selected = !tag.selected
                console.log(tag)
            }
        }
   
    }

    function toggleCity(cityId: number) {
        const city = cities.value.find(c => c.id === cityId)
        if (city) {
            city.selected = !city.selected
            console.log(city)
        }
    }
</script>

<template>
    <div class="search-view">
        <div class="container">
            <div class="search-container">
                <div class="search-progress">
                    <div 
                    v-for="(step, index) in steps" 
                    :key="step.id" 
                    class="progress-item"
                    :class="{ active: index <= activeStep, completed: index < activeStep }"
                    >
                        <div class="progress-circle">
                            <span v-if="index < activeStep" class="check-icon">✓</span>
                            <span v-else>{{ index + 1 }}</span>
                        </div>
                        <div class="progress-text">
                            <h4 class="progress-title">{{ step.id === 'type' ? 'Catégorie' : step.id === 'distance' ? 'Localisation' : 'Exigences' }}</h4>
                               <p class="progress-desc">
                                {{
                                    step.id === 'type'
                                    ? 'Choisissez entre une activité ou un restaurant.'
                                    : step.id === 'distance'
                                    ? 'Sélectionnez la localisation de votre sortie.'
                                    : 'Précisez vos préférences pour une recherche plus ciblée.'
                                }}
                            </p>    
                        </div>
                    </div>
                </div>

                <!-- Search content -->
                <div class="search-content">
                    <div class="search-step" v-if="activeStep === 0">
                        <h2 class="step-title">{{ steps[activeStep].title }}</h2>
                        <p class="step-description">{{ steps[activeStep].description }}</p>
                        
                        <div class="type-selection">
                            <button 
                            class="type-btn activity-btn" 
                            :class="{ active: searchType === 'activity' }"
                            @click="selectType('activity')"
                            >
                            Une activité
                            </button>
                            <button 
                            class="type-btn restaurant-btn" 
                            :class="{ active: searchType === 'restaurant' }"
                            @click="selectType('restaurant')"
                            >
                            Un restaurant
                            </button>
                        </div>
                    </div>
                    
                    <div class="search-step" v-else-if="activeStep === 1">
                        <h2 class="step-title">{{ steps[activeStep].title }}</h2>
                        <p class="step-description">{{ steps[activeStep].description }}</p>
                        <button 
                            v-for="city in cities"
                            :key="city.id" 
                            class="tag-btn"
                            :class="{ selected: city.selected }"
                            @click="toggleCity(city.id)"
                        >
                            {{ city.city }}
                        </button>
                    </div>
                    
                    <div class="search-step" v-else-if="activeStep === 2">
                        <h2 class="step-title">{{ steps[activeStep].title }}</h2>
                        <p class="step-description">{{ steps[activeStep].description }}</p>
                        
                        <div class="preferences-section">
                            <h3 class="section-subtitle">Sélectionnez des tags pour affiner votre recherche</h3>
                            <div class="tags-container">
                                <div v-if="searchType === 'activity'">
                                    <button 
                                        v-for="tag in activitiesTags" 
                                        :key="tag.id"
                                        class="tag-btn"
                                        :class="{ selected: tag.selected }"
                                        @click="toggleTag(tag.id, tag.type)"
                                    >
                                        {{ tag.name }}
                                    </button>
                                </div>
                                <div v-else-if="searchType === 'restaurant'">
                                    <button 
                                        v-for="tag in restaurantsTags" 
                                        :key="tag.id"
                                        class="tag-btn"
                                        :class="{ selected: tag.selected }"
                                        @click="toggleTag(tag.id, tag.type)"
                                    >
                                        {{ tag.name }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Continue button -->
                    <button 
                    class="btn-continue"
                    :disabled="(activeStep === 0 && !searchType)"
                    @click="nextStep"
                    >
                        Continuer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .search-view {
        min-height: calc(100vh - 140px); /* Adjust based on header/footer height */
        padding: var(--space-6) 0;
    }

    .search-container {
        display: flex;
        gap: var(--space-6);
        flex-direction: column;
    }

    .search-progress {
        display: none;
    }

    .search-content {
        flex: 2;
        background-color: var(--color-primary);
        border-radius: var(--radius-lg);
        padding: var(--space-5);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 400px;
    }

    .step-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: var(--space-3);
        color: var(--color-secondary);
    }

    .step-description {
        color: var(--color-neutral-300);
        margin-bottom: var(--space-5);
        max-width: 600px;
    }

    .type-selection {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        margin-bottom: var(--space-5);
    }

    .type-btn {
        padding: var(--space-3);
        border: 1px solid var(--color-neutral-700);
        background-color: var(--color-primary);
        color: var(--color-secondary);
        border-radius: var(--radius-md);
        font-size: 1.2rem;
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-normal);
        text-align: center;
    }

    .type-btn.active {
        border-color: var(--color-accent);
        box-shadow: 0 0 0 2px var(--color-accent);
    }

    .distance-slider {
        width: 100%;
        padding: var(--space-5) 0;
    }

    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 8px;
        border-radius: 4px;
        background: var(--color-neutral-700);
        outline: none;
        margin-bottom: var(--space-3);
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--color-accent);
        cursor: pointer;
    }

    .slider::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--color-accent);
        cursor: pointer;
    }

    .slider-value {
        text-align: center;
        color: var(--color-secondary);
        font-size: 1.2rem;
        font-weight: 500;
    }

    .section-subtitle {
        color: var(--color-secondary);
        font-size: 1.2rem;
        margin-bottom: var(--space-3);
    }

    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-bottom: var(--space-4);
    }

    .tag-btn {
        padding: var(--space-2) var(--space-3);
        border-radius: 20px;
        background-color: transparent;
        border: 1px solid var(--color-neutral-600);
        color: var(--color-secondary);
        font-size: 0.875rem;
        cursor: pointer;
        transition: all var(--transition-fast);
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .tag-btn.selected {
        background-color: var(--color-accent);
        border-color: var(--color-accent);
        color: var(--color-primary);
    }

    .btn-continue {
        align-self: center;
        padding: var(--space-3) var(--space-5);
        background-color: var(--color-primary);
        color: var(--color-secondary);
        border: 1px solid var(--color-neutral-700);
        border-radius: var(--radius-md);
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-fast);
        width: 100%;
        max-width: 300px;
    }

    .btn-continue:hover:not(:disabled) {
        background-color: var(--color-neutral-800);
    }

    .btn-continue:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .progress-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: var(--space-4);
        opacity: 0.5;
        transition: opacity var(--transition-fast);
    }

    .progress-item.active {
        opacity: 1;
    }

    .progress-circle {
        width: 36px;
        height: 36px;
        min-width: 36px;
        min-height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-neutral-800);
        color: var(--color-secondary);
        margin-right: var(--space-3);
        font-weight: 600;
        position: relative;
        transition: background-color var(--transition-fast);
    }

    .progress-item.active .progress-circle {
        background-color: var(--color-accent);
        color: var(--color-primary);
    }

    .progress-item.completed .progress-circle {
        background-color: var(--color-success);
    }

    .progress-title {
        font-weight: 600;
        margin-bottom: var(--space-1);
        color: var(--color-secondary);
    }

    .progress-desc {
        font-size: 0.875rem;
        color: var(--color-neutral-400);
    }

    .check-icon {
        font-size: 1rem;
    }

    @media (min-width: 768px) {
        .search-container {
            flex-direction: row;
        }
        
        .search-progress {
            display: block;
            flex: 1;
            padding: var(--space-4);
            border-radius: var(--radius-lg);
        }
        
        .type-selection {
            flex-direction: row;
        }
        
        .type-btn {
            flex: 1;
        }
    }
</style>