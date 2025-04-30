<script setup lang="ts">
    import { useRouter } from 'vue-router'

    const router = useRouter()

    function goBack() {
        router.back()
    }

    function goHome() {
        router.push('/')
    }
</script>

<template>
    <div class="not-found">
        <div class="container not-found-container">
            <h1 class="not-found-title">404</h1>
            <h2 class="not-found-subtitle">Page non trouvée</h2>
            <p class="not-found-message">
            La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <div class="not-found-actions">
                <button @click="goBack" class="btn btn-outline">Retour</button>
                <button @click="goHome" class="btn btn-primary">Accueil</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .not-found {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 140px);
        text-align: center;
    }

    .not-found-container {
        max-width: 600px;
        padding: var(--space-6) var(--space-4);
    }

    .not-found-title {
        font-size: 8rem;
        font-weight: 700;
        color: var(--color-accent);
        margin-bottom: var(--space-2);
        line-height: 1;
    }

    .not-found-subtitle {
        font-size: 2rem;
        font-weight: 600;
        color: var(--color-secondary);
        margin-bottom: var(--space-3);
    }

    .not-found-message {
        color: var(--color-neutral-400);
        margin-bottom: var(--space-5);
        font-size: 1.1rem;
    }

    .not-found-actions {
        display: flex;
        justify-content: center;
        gap: var(--space-3);
    }
</style>