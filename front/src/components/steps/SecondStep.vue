<template> 
  <fieldset class="checkbox-group">
    <legend class="checkbox-group-legend">Choisissez vos préférences</legend>

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

<style>
.checkbox-group {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 6 colonnes fixes pour le maximum */
  gap: 10px; /* Espacement entre les éléments */
  justify-items: center; /* Centre les éléments dans chaque cellule */
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  user-select: none;
  border: none;
}

.checkbox-group > * {
  margin: 0.5rem 0.5rem;
}

.checkbox-group-legend {
  font-size: 1.5rem;
  font-weight: 700;
  color: #9c9c9c;
  text-align: center;
  line-height: 1.125;
  margin-bottom: 1.25rem;
}

.checkbox-input {
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.checkbox-input:checked + .checkbox-tile {
  border-color: #2260ff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  color: #2260ff;
}

.checkbox-input:checked + .checkbox-tile:before {
  transform: scale(1);
  opacity: 1;
  background-color: #2260ff;
  border-color: #2260ff;
}

.checkbox-input:checked + .checkbox-tile .checkbox-icon,
.checkbox-input:checked + .checkbox-tile .checkbox-label {
  color: #2260ff;
}

.checkbox-input:focus + .checkbox-tile {
  border-color: #2260ff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1), 0 0 0 4px #b5c9fc;
}

.checkbox-input:focus + .checkbox-tile:before {
  transform: scale(1);
  opacity: 1;
}

.checkbox-tile {
  width: 8rem; /* Taille fixe */
  min-height: 8rem;
  border-radius: 0.5rem;
  border: 3px solid #d1d1d3;
  background-color: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  transition: 0.15s ease;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.checkbox-tile:before {
  content: "";
  position: absolute;
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #b5bfd9;
  background-color: #fff;
  border-radius: 50%;
  top: 0.25rem;
  left: 0.25rem;
  opacity: 0;
  transform: scale(0);
  transition: 0.25s ease;
}

.checkbox-tile:hover {
  border-color: #2260ff;
}

.checkbox-tile:hover:before {
  transform: scale(1);
  opacity: 1;
}

.checkbox-icon {
  transition: 0.375s ease;
  color: #494949;
}

.checkbox-label {
  color: #707070;
  transition: 0.375s ease;
  text-align: center;
}
</style>

<script setup>
import { ref } from 'vue';

const options = ref([
  { id: 'vegetarien', label: 'Végétarien' },
  { id: 'halal', label: 'Halal' },
  { id: 'sans-gluten', label: 'Sans gluten' },
  { id: 'intolerance-lactose', label: 'Intolérance au lactose' },
  { id: 'bio', label: 'Bio' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'produits-locaux', label: 'Produits locaux' }
]);
</script>
