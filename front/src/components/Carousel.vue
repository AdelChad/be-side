<template>
    <div class="carousel">
      <div class="carousel-group">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="carousel-card"
          :class="getClass(index)"
          :style="{ backgroundImage: `url(${image})` }"
        ></div>
      </div>
  
      <!-- Boutons placés en dehors de .carousel-group -->
      <div class="controls">
        <button @click="prev">❮</button>
        <button @click="next">❯</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from "vue";
  
  const images = ref([
    "https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60"
  ]);
  
  const activeIndex = ref(0);
  let interval = null;
  
  const next = () => {
    activeIndex.value = (activeIndex.value + 1) % images.value.length;
  };
  
  const prev = () => {
    activeIndex.value =
      (activeIndex.value - 1 + images.value.length) % images.value.length;
  };
  
  const getClass = (index) => {
    const total = images.value.length;
    if (index === activeIndex.value) return "active";
    if (index === (activeIndex.value + 1) % total) return "next";
    if (index === (activeIndex.value - 1 + total) % total) return "previous";
    return "hidden"; // Cache les autres images
  };
  
  onMounted(() => {
    interval = setInterval(next, 4000);
  });
  
  onUnmounted(() => {
    clearInterval(interval);
  });
  </script>
  
  <style scoped>
  /* Centrer tout */
  .carousel {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative; /* Important pour bien placer les boutons */
    width:50vw;
    padding: 1em 10em ;
  }
  
  .carousel-group {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: auto;
  }
  
  .carousel-card {
    position: absolute;
    background-size: cover;
    background-position: center;
    border-radius: 10px;
    border: 2px solid white;
    transition: all 0.8s ease-in-out;
  }
  
  /* Image active : reste au centre */
  .active {
    z-index: 3;
    height: 40vh;
    width: 12vw;
    transform: translateX(0) scale(1);
  }
  
  /* Image précédente (à gauche) */
  .previous {
    z-index: 2;
    transform: translateX(-100%) translateY(10px) rotateY(-25deg);
    opacity: 0.6;
    height: 35vh;
    width: 10vw;
  }
  
  /* Image suivante (à droite) */
  .next {
    z-index: 2;
    transform: translateX(100%) translateY(10px) rotateY(25deg);
    opacity: 0.6;
    width: 10vw;
  }
  
  /* Cache les autres images */
  .hidden {
    display: none;
  }
  
  /* Boutons de navigation */
  .controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px; /* Ajout d'espace sous le carousel */
  }
  
  button {
    background-color: white;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 15px;
    transition: 0.3s ease-in-out;
    height: 2rem;
    width: 2rem;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  button:hover {
    background-color: lightgray;
  }
  </style>
  