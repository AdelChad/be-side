<template>
  <router-view />
</template>

<script lang="ts">
  import { useRouter } from 'vue-router'

  export default {
    setup() {
      const router = useRouter()

      return { router }
    }
  }
</script>
