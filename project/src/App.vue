<script setup lang="ts">
    import { RouterView } from 'vue-router'
    import TheHeader from './components/layout/TheHeader.vue'
    import TheFooter from './components/layout/TheFooter.vue'
</script>

<template>
    <div class="app-container">
        <TheHeader  v-if="!$route.meta.hideNavbar"   />
        <main>
            <RouterView />
        </main>
        <TheFooter  v-if="!$route.meta.hideFooter" />
    </div>
</template>

<style>
    .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
    }
</style>