<template>
  <div class="select-container">
    <select v-model="selectedCountry" @change="emitCountryUpdate" class="fw-medium form-control">
      <option disabled value="">Sélectionnez un pays</option>
      <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, ref, watch } from 'vue'
  import { countries } from '../data/countries'

  const props = defineProps({
    country: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['update:country'])

  const selectedCountry = ref(props.country)

  watch(
    () => props.country,
    (newCountry) => {
      selectedCountry.value = newCountry
    }
  )

  const emitCountryUpdate = () => {
    emit('update:country', selectedCountry.value)
  }
</script>

<style scoped>
  .fw-medium {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 14px;
    letter-spacing: -0.04em;
    color: #121212;
  }

  .form-control {
    height: 30px;
    border: 1px solid #ededed;
    border-radius: 4px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #6b6b6b;
  }
</style>
