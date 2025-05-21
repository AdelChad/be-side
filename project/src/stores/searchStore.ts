import { defineStore } from 'pinia'
import { ref } from 'vue'

interface SearchResult {
    id: number
    name: string
    photo: string
    city: string
    address: string
    type: 'activity' | 'restaurant'
    [key: string]: any
}

export const useSearchStore = defineStore('search', () => {
    const results = ref<SearchResult[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchSearchResults(search: string, city: string, type: string) {
        console.log('fetchSearchResults called with:', { search, city, type })
        loading.value = true
        error.value = null
        results.value = []

        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (city) params.append('city', city)
        if (type) params.append('type', type)

        try {
            const response = await fetch(`http://localhost:3000/users/search_activities_restaurant?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            })

            if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)

            const data = await response.json()
            console.log('data.activities:', data.activities)
            console.log('data.restaurants:', data.restaurants)
            results.value = [
                ...data.activities.map((a: any) => ({ ...a, type: 'activity' })),
                ...data.restaurants.map((r: any) => ({ ...r, type: 'restaurant' })),
            ]
            console.log('results final:', results.value)

        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return {
        results,
        loading,
        error,
        fetchSearchResults
    }
})
