<template>
  <div class="container">
    <!-- Sidebar avec Stepper Vertical -->
    <nav class="nav-stepper">
      <img src="./../assets/images/beside blanc.png" alt="Logo" />

      <div class="stepper-container">
        <div v-for="(stepItem, index) in stepDetails" :key="index" class="step-wrapper">
          <!-- Ligne verticale entre les étapes -->
          <div v-if="index !== 0" class="line" :class="{ 'line-active': index <= step }"></div>

          <!-- Cercle avec numéro ou check -->
          <div class="circle" :class="{ 'active': index < step, 'current': index === step }">
            <svg v-if="index < step" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </div>

          <!-- Nom de l'étape + description -->
          <div class="step-info">
            <span class="step-label">{{ stepItem.name }}</span>
            <span class="step-description">{{ stepItem.description }}</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu avec animation -->
    <div class="content">
      <transition :name="transitionName" mode="out-in">
        <component :is="steps[step]" :key="step" v-bind:formValues="values" class="form-container"></component>
      </transition>

      <!-- Boutons de navigation -->
      <div class="buttons">
        <button @click="previousStep" :disabled="step === 0">Précédent</button>
        <button @click="nextStep" :disabled="step === steps.length - 1">Suivant</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import FirstStep from "./steps/FirstStep.vue";
import SecondStep from "./steps/SecondStep.vue";
import ThirdStep from "./steps/ThirdStep.vue";
import FourthStep from "./steps/FourthStep.vue";
import useForm from "../../public/js/formValues.js";

const step = ref(0);
const transitionName = ref("fade-slide-right"); // Animation par défaut
const { values } = useForm();

const steps = [FirstStep, SecondStep, ThirdStep, FourthStep];

const stepDetails = [
  { name: "Budget", description: "Définissez votre budget maximum pour le projet." },
  { name: "Exigences", description: "Listez les critères essentiels à respecter." },
  { name: "Envie précises", description: "Ajoutez vos idées et inspirations personnelles." },
  { name: "Culture", description: "Prenez en compte les aspects culturels du projet." }
];

const previousStep = () => {
  if (step.value > 0) {
    transitionName.value = "fade-slide-left"; // Animation vers la gauche
    step.value--;
  }
};

const nextStep = () => {
  if (step.value < steps.length - 1) {
    transitionName.value = "fade-slide-right"; // Animation vers la droite
    step.value++;
  }
};
</script>

<style>
/* Layout principal */
.container {
  display: flex;
  height: 100vh;
}

/* Sidebar */
.nav-stepper {
  width: 250px;
  background-color: black;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Logo */
.nav-stepper img {
  width: 100px;
  margin-bottom: 20px;
}

/* Stepper vertical */
.stepper-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Étapes */
.step-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  flex-direction: column;
  text-align: center;
}

/* Ligne entre étapes */
.line {
  width: 3px;
  height: 40px;
  background-color: gray;
  margin: 5px 0;
}

.line-active {
  background-color: white;
}

/* Cercle des étapes */
.circle {
  width:25px;
  height: 25px;
  border-radius: 50%;
  border: 2px solid white;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: white;
}

.active {
  background-color: white;
  border-color: white;
  color: black;
  font-weight: bold;
}

.current {
  border-color: white;
  color: white;
  border: 3px solid white;
  background-color: black;
}

.check-icon {
  width: 20px;
  height: 20px;
  color: black;
}

.buttons button {
  background-color: black !important;
  font-weight:600;
  padding:1.2rem;
}

/* Infos des étapes */
.step-info {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-label {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.step-description {
  font-size: 12px;
  color: rgb(149, 149, 149);
  margin-top: 3px;
  max-width: 200px;
  text-align: center;
}

/* Contenu */
.content {
  flex-grow: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Boutons */
.buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  opacity: 0;
 cursor: auto;
}

button:not(:disabled) {
  background-color: #007bff;
  color: white;
}

/* 🎬 Animations entre étapes */
.fade-slide-right-enter-active {
  animation: fadeInSlideRight 0.5s ease-out;
}

.fade-slide-right-leave-active {
  animation: fadeOutSlideRight 0.5s ease-in forwards;
}

.fade-slide-left-enter-active {
  animation: fadeInSlideLeft 0.5s ease-out;
}

.fade-slide-left-leave-active {
  animation: fadeOutSlideLeft 0.5s ease-in forwards;
}

@keyframes fadeInSlideRight {
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOutSlideRight {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-30px);
  }
}

@keyframes fadeInSlideLeft {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOutSlideLeft {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
