<template>
  <div class="budget-container">
    <p class="budget">Quel est votre budget ?</p>
    <label for="range">
      <input 
        type="range" 
        name="range" 
        id="range" 
        min="0" 
        max="300" 
        step="5" 
        v-model="budget"
      />
    </label>
    <output class="output">{{ budget }} €</output>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['formValues']);
const budget = ref(175);
</script>

<style scoped>
.budget-container {
  gap:2rem;
  text-align: center;
  display: grid;  
  margin-top: 20px;
}
.budget {
  font-size: 1.5em;
  color: #3a3a3a;
}
input[type=range] {
  width: 300px;
}
.output {
  font-size: 1.5em;
  color: #84ce42;
}
</style>
