<script setup lang="ts">
  import TheWelcome from '../components/TheWelcome.vue'
  import Navbar from '@/components/Navbar.vue'
  import Carousel from "@/components/Carousel.vue"

</script>

<template>
  <div class="loading-page">
    <img src="../assets/images/beside blanc.png" alt="">
  </div>
    <div class="main-screen">
      <Navbar></Navbar>
      <div class="banner">
        <div class="titles">
          <h1>Marre des listes interminables ? Trouvez enfin ce qui vous correspond !</h1>
          <h2>Une recherche interactive pour des expériences sur-mesure.</h2>
          <a class="main-btn" href="">Personnaliser ma recherche</a>
        </div>
        <Carousel></Carousel>
      </div>
    </div>

    <div class="second-screen">
  <h3>Vos sorties, à votre image</h3>
  <div class="card-container">
    <div class="card">
      <span>
      Disneyland Paris
      </span>
    </div>
    <div class="card">
      <span>
      Disneyland Paris
      </span>
    </div>
    <div class="card">
      <span>
      Disneyland Paris
      </span>
    </div>
    <div class="card">
      <span>
      Disneyland Paris
      </span>
    </div>
    <div class="card">
      <span>
      Disneyland Paris
      </span>
    </div>
    <div class="card">
      <span>
      Disneyland Paris
      </span>
    </div>
  </div>
  <h3>Ne cherchez plus, dégustez</h3>
  <div class="card-container">
    <div class="card">
      <span>
      Disneyland Paris
      </span>
    </div>
    <div class="card">
      <span>
      Disneyland Paris
      </span>
    </div>
    <div class="card">
      <span>
      Disneyland Paris
      </span>
    </div>
    <div class="card">
      <span>
      Disneyland Paris
      </span>
    </div>
    <div class="card">
      <span>
      Disneyland Paris
      </span>
    </div>
    <div class="card">
      <span>
      Disneyland Paris
      </span>
    </div>
  </div>
  </div>  
</template>

<style scoped>
main {
  color:white;
}

.loading-page {

  position: fixed; /* Permet d'afficher la loading page peu importe le scroll */
  top: 0;
  left: 0;
  background-color: rgb(22, 22, 22);
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Assure que la loading page est bien au-dessus de tout */
  animation: fadeOut 1.5s forwards 1.5s;
}

.loading-page img {
  height:20rem;
  animation: fadeIn 1.5s forwards;
}

.loading-page span {
  color: white;
  font-family: Montserrat;
  font-size: 2rem;
  font-weight: 500;
  animation: fadeIn 1.5s forwards 0s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animation de disparition */
@keyframes fadeOut {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

/* Afficher la page principale après le chargement */
.loading-page::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  animation: revealContent 1.5s forwards 1.5s;
}

@keyframes revealContent {
  to {
    display: none;
  }
}

/* Afficher la page principale après disparition de la page de chargement */
.loading-page::after + .main-screen {
  display: block;
}


.banner {
  display: flex;
  justify-content: space-between;
  padding: 1em 10em;
}

.titles {
  width:50%;
  display: flex;
  flex-direction: column; 
  justify-content: center; 
  align-items: flex-start;
  height: 60vh;
}

.main-btn {
  padding:15px;
  margin:20px 0;
  color:black;
  background-color: white;
  border-radius: 5px;
  font-weight: 700;
}

h1 {
  font-weight:700;

}

h2 {
  font-weight:200;
}
.main-screen {
  height: 100vh;
  width:100vw;
  background-image: 
  linear-gradient(to top, rgba(22, 22, 22, 1), rgba(255, 0, 0, 0)), 
  url(https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
  background-position: 50% 80%;
  transition:
    color 0.5s,
    background-color 0.5s;
  line-height: 1.6;
  font-family:Montserrat;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color:white;
}

.second-screen {
  font-family:Montserrat;
  background-color: rgb(22, 22, 22);
  color:white;
  margin: 0;
  padding: 1em 10em;  
}

.second-screen h3 {
margin:2em 1em;
font-weight: 600;
}

.card {
  height:20em;
  width:15em;
  background:
  url(https://images.unsplash.com/photo-1687177680406-30a7e50d1f24?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
  background-size:cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 1em;
  margin:0 1em;
}


.card span {
  margin:1em;
}

.card-container {
  display: flex;
}
</style>
