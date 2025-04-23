<template>
  <fieldset class="checkbox-group">
    <legend class="checkbox-group-legend">Choisissez votre type de cuisine</legend>

    <div class="checkbox" v-for="option in options" :key="option.id">
      <label class="checkbox-wrapper" :for="option.id">
        <input class="checkbox-input" type="checkbox" :id="option.id" :name="option.id" />
        <span class="checkbox-tile">
          <span class="checkbox-label">{{ option.label }}</span>
        </span>
      </label>
    </div>
  </fieldset>

</template>

<script setup>
import { ref } from 'vue';

const options = ref([
{ id: 'africain', label: 'Africain' },
{ id: 'americain', label: 'Américain' },
{ id: 'asiatique', label: 'Asiatique' },
{ id: 'bresilien', label: 'Brésilien' },
{ id: 'creole', label: 'Créole' },
{ id: 'creperie', label: 'Crêperie' },
{ id: 'cuisine-iles', label: 'Cuisine des îles' },
{ id: 'cuisine-monde', label: 'Cuisine du monde' },
{ id: 'francais', label: 'Français' },
{ id: 'fusion', label: 'Fusion' },
{ id: 'indien', label: 'Indien' },
{ id: 'italien', label: 'Italien' },
{ id: 'japonais', label: 'Japonais' },
{ id: 'latino', label: 'Latino' },
{ id: 'libanais', label: 'Libanais' },
{ id: 'marocain', label: 'Marocain' },
{ id: 'mediterraneen', label: 'Méditerranéen' },
{ id: 'oriental', label: 'Oriental' },
{ id: 'portugais', label: 'Portugais' },
{ id: 'peruvien', label: 'Péruvien' },
{ id: 'savoyard', label: 'Savoyard' },
{ id: 'scandinave', label: 'Scandinave' },
{ id: 'vietnamien', label: 'Vietnamien' }
]);
</script>
