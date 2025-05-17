import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../interfaces/User.interface'
import router from '../router'

interface FavoriteItem {
    id: number
    name: string
    photo: string
    country: string
    address: string
    city: string
    rating: number
    phoneNumber: string
    type: 'activity' | 'restaurant'
}

export const useUserStore = defineStore('user', () => {
    const API_BASE_URL = 'http://localhost:3000'
    const user = ref<User | null>(null)
    const selectedFile = ref<File | null>(null)
    const favoriteActivities = ref<FavoriteItem[]>([])
    const favoriteRestaurants = ref<FavoriteItem[]>([])
    const loading = ref(true)

    async function fetchCurrentUser() {
        loading.value = true
        try {
            const response = await fetch(`${API_BASE_URL}/users/me/`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            })

            if (response.status === 401) {
                localStorage.removeItem('access_token')
                router.push('/login')
                return
            }
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
            user.value = await response.json()
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error)
        } finally {
            loading.value = false
        }
    }

    async function fetchFavoriteActivities() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/get_activities_fav`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            })

            if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
            favoriteActivities.value = await response.json()
        } catch (error) {
            console.error('Erreur lors de la récupération des activités:', error)
        }
    }

    async function fetchFavoriteRestaurants() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/get_restaurants_fav`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            })

            if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
            favoriteRestaurants.value = await response.json()
        } catch (error) {
            console.error('Erreur lors de la récupération des restaurants:', error)
        }
    }

    async function uploadProfilePicture() {
        if (!selectedFile.value) return

        const formData = new FormData()
        formData.append('file', selectedFile.value)

        try {
            loading.value = true
            const response = await fetch(`${API_BASE_URL}/users/${user.value?.id}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                },
                body: formData
            })

            if (!response.ok) throw new Error('Erreur lors du téléchargement')

            const data = await response.json()
            if (user.value) user.value.profilePicture = data.profilePicture
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error)
        } finally {
            loading.value = false
        }
    }

    async function deleteProfilePicture() {
        try {
            loading.value = true
            const response = await fetch(`${API_BASE_URL}/users/${user.value?.id}/profile-picture`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            )

            if (!response.ok) throw new Error('Erreur lors de la suppression')

            if (user.value) user.value.profilePicture = ''
        } catch (error) {
            console.error('Erreur lors de la suppression:', error)
        } finally {
            loading.value = false
        }
    }

    function logout() {
        user.value = null
        favoriteActivities.value = []
        favoriteRestaurants.value = []
    }

    function isFavorite(id: number, type: 'activity' | 'restaurant') {
        const list = type === 'activity' ? favoriteActivities.value : favoriteRestaurants.value
        return list.some(item => item.id === id)
    }

    function removeFavoriteLocal(id: number, type: 'activity' | 'restaurant') {
        if (type === 'activity') {
            favoriteActivities.value = favoriteActivities.value.filter(item => item.id !== id)
        } else {
            favoriteRestaurants.value = favoriteRestaurants.value.filter(item => item.id !== id)
        }
    }

    function addFavoriteLocal(item: FavoriteItem) {
        if (item.type === 'activity') {
            favoriteActivities.value.push(item)
        } else {
            favoriteRestaurants.value.push(item)
        }
    }

    return {
        user,
        selectedFile,
        favoriteActivities,
        favoriteRestaurants,
        loading,
        fetchCurrentUser,
        fetchFavoriteActivities,
        fetchFavoriteRestaurants,
        uploadProfilePicture,
        deleteProfilePicture,
        isFavorite,
        removeFavoriteLocal,
        addFavoriteLocal,
        logout
    }
})
