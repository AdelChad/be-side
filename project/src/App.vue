<script setup lang="ts">
    import { RouterView } from 'vue-router'
    import TheHeader from './components/layout/TheHeader.vue'
    import TheFooter from './components/layout/TheFooter.vue'
</script>

<template>
    <div class="app-container">
        <TheHeader />
        <main>
            <RouterView />
        </main>
        <TheFooter />
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