import { defineStore } from 'pinia'
import { addFavorite, removeFavorite } from '../api/favorites'
import { useUserStore } from './user'

export const useFavoritesStore = defineStore('favorites', () => {
    const userStore = useUserStore()

    async function toggleFavorite(item: {
        id: number
        name: string
        photo: string
        country: string
        address: string
        city: string
        rating: number
        phoneNumber: string
        type: 'activity' | 'restaurant'
    }) {
        try {
            if (userStore.isFavorite(item.id, item.type)) {
                await removeFavorite(item.id, item.type)
                userStore.removeFavoriteLocal(item.id, item.type)
            } else {
                await addFavorite(item.id, item.type)
                userStore.addFavoriteLocal(item)
            }
        } catch (err) {
            console.error('Erreur lors du toggle', err)
        }
    }

    return {
        toggleFavorite,
    }
})
