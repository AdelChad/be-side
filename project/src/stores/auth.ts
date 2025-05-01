import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
    id: string
    email: string
    name: string
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string>(localStorage.getItem('access_token') || '')

    if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('user')
        const savedToken = localStorage.getItem('access_token')

        if (savedUser) user.value = JSON.parse(savedUser)
        if (savedToken) token.value = savedToken
    }

    const isAuthenticated = computed(() => !!token.value)

    function setUser(newUser: User) {
        user.value = newUser
        localStorage.setItem('user', JSON.stringify(newUser))
    }

    function setToken(newToken: string) {
        token.value = newToken
        localStorage.setItem('access_token', newToken)
    }

    async function login(email: string, password: string) {
        const mockUser = {
            id: '123',
            email,
            name: 'Demo User'
        }

        const mockToken = 'mock-jwt-token'

        setUser(mockUser)
        setToken(mockToken)

        return mockUser
    }

    function logout() {
        user.value = null
        token.value = ''
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
    }

    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
        setUser,
        setToken
    }
})