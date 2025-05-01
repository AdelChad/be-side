<template>
  <div class="select-container">
    <select v-model="selectedCountry" class="country-select" required>
      <option disabled value="">Sélectionnez un pays</option>
      <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, computed } from 'vue'
  import { countries } from '../data/countries'

  const props = defineProps<{
  country: string
}>();

const emit = defineEmits<{
  (e: 'update:country', value: string): void
}>();

const selectedCountry = computed({
  get: () => props.country,
  set: (value) => emit('update:country', value)
});

</script>

<style scoped>
.country-select {
  font-size: 0.875rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  height: 48px;
}

.country-select:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

</style>
