<template>
  <fieldset class="checkbox-group">
    <legend class="checkbox-group-legend">Choisissez vos plats préférés</legend>

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
{ id: 'burger', label: 'Burger' },
{ id: 'pizza', label: 'Pizza' },
{ id: 'fishandchips', label: 'Fish and chips' },
{ id: 'pokebowl', label: 'Pokebowl' },
{ id: 'couscous', label: 'Couscous' },
{ id: 'huitres', label: 'Huîtres' },
{ id: 'tacos', label: 'Tacos' },
{ id: 'poisson', label: 'Poisson' },
{ id: 'raclette', label: 'Raclette' },
{ id: 'sushi', label: 'Sushi' },
{ id: 'pates', label: 'Pâtes' },
{ id: 'wok', label: 'Wok' },
{ id: 'tapas', label: 'Tapas' },
{ id: 'tandoori', label: 'Tandoori' },
{ id: 'poulet', label: 'Poulet' },
{ id: 'foiegras', label: 'Foie gras' },
{ id: 'viandes', label: 'Viandes & grillades' },
{ id: 'escargots', label: 'Escargots' }
]);
</script>
