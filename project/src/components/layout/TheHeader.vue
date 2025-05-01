<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '../../router'
import { isAuthenticated } from '../../router/guards'

const route = useRoute()
const isTransparent = computed(() => route.path === '/')

function logout() {
    localStorage.removeItem('access_token')
    router.push({ name: 'login' })
}
</script>

<template>
    <header :class="['header', { 'header-transparent': isTransparent }]">
        <div class="container header-container">
            <div class="logo-beside">
                <router-link to="/">
                    <img src="../../assets/icons/beside blanc.png" alt="Logo Beside" class="logo-img" />
                </router-link>
            </div>
            <nav class="nav">
                <router-link to="/search" class="nav-link">Favoris</router-link>
                <router-link to="/search" class="nav-link">Recherche</router-link>
                <router-link to="/explore" class="nav-link">Explorer</router-link>
                <router-link to="/profile" class="nav-link">Mon profil</router-link>
            </nav>

            <div v-if="!isAuthenticated()" class="auth-buttons">
                <router-link v-if="route.path !== '/login'" to="/login" class="btn btn-outline">Se
                    connecter</router-link>
                <router-link v-if="route.path !== '/signup'" to="/signup" class="btn btn-primary">Créer un
                    compte</router-link>
            </div>
            <button v-if="isAuthenticated()" @click="logout" class="btn btn-outline">Se déconnecter</button>
        </div>
    </header>
</template>

<style scoped>
.header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--color-primary);
    padding: var(--space-3) 0;
    transition: background-color var(--transition-normal);
}

.header-transparent {
    background-color: transparent;
    position: absolute;
    width: 100%;
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    display: flex;
    align-items: center;
}

.logo-img {
    height: 2rem;
}

.nav {
    display: none;
}

.nav-link {
    margin: 0 var(--space-3);
    position: relative;
    color: var(--color-secondary);
    transition: color var(--transition-fast);
}

.nav-link:hover,
.nav-link.router-link-active {
    color: var(--color-accent);
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-accent);
    transition: width var(--transition-fast);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
    width: 100%;
}

.auth-buttons {
    display: flex;
    gap: var(--space-2);
    align-items: center;
}

.logo-beside {
    display: flex;
    align-items: center;
}

.logo-beside .logo-img {
    height: 100px;
    width: auto;
    max-height: 100%;
    object-fit: contain;
}

@media (max-width: 768px) {
    .logo-beside .logo-img {
        height: 75px;
    }
}

@media (min-width: 768px) {
    .nav {
        display: flex;
    }
}
</style>