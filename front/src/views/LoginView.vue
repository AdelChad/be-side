<template> 
  <div class="centered-container">
    <div class="banner-container"></div>
    <!-- Formulaire -->
    <div class="form-container">
      <div class="text-center mb-4">
        <h1 class="fw-bold display-4">Bon retour !</h1>
        <p class="text-muted">Connectez-vous pour continuer !</p>
      </div>

      <form class="w-100">
        <div class="mb-3">
          <label for="email" class="form-label fw-medium">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            class="form-control"
            placeholder="Entrez votre e-mail"
            :value="email"
            @input="(event) => (email = (event.target as HTMLInputElement).value)"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label fw-medium">Mot de passe</label>
          <input
            type="password"
            id="password"
            :value="password"
            @input="(event) => (password = (event.target as HTMLInputElement).value)"
            required
            class="form-control"
            placeholder="Entrez votre mot de passe"
          />
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="form-check">
            <input type="checkbox" id="rememberMe" class="form-check-input" />
            <label for="rememberMe" class="form-check-label">Se souvenir de moi</label>
          </div>
          <a href="#" class="text-decoration-none">Mot de passe oublié ?</a>
        </div>
        <p v-if="errorMessageLogin" class="error-message">{{ errorMessageLogin }}</p>
        <button type="submit" class="btn btn-primary" @click="submitForm">Se connecter</button>
        <div class="text-center mt-3">
          <p class="mb-1">Vous n'avez pas de compte ?</p>
          <a href="/" class="text-primary fw-bold">S'inscrire</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import router from '@/router'
  import { ref } from 'vue'

  const email = ref('')
  const password = ref('')
  const errorMessageLogin = ref('')
  const rememberMe = ref(false)

  const submitForm = async (e: Event) => {
    try {
      e.preventDefault()
      errorMessageLogin.value = ''

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, pass: password.value })
      })

      if (response.ok) {
        const result = await response.json()
        if (result && result.access_token) {
          localStorage.setItem('access_token', result.access_token)
          if (rememberMe.value) {
            localStorage.setItem('user_email', email.value)
            localStorage.setItem('userLoggedIn', 'true')
          } else {
            localStorage.removeItem('user_email')
            localStorage.removeItem('userLoggedIn')
          }
          router.push('/')
        }
      } else if (email.value === '' || password.value === '') {
        errorMessageLogin.value = 'Veuillez completer le formulaire'
      } else if (response.status === 401 || 404) {
        errorMessageLogin.value = 'Email ou mot de passe incorrect.'
      } else {
        errorMessageLogin.value = "Une erreur s'est produite lors de la connexion."
      }
    } catch (error) {
      console.error(error)
      errorMessageLogin.value = "Une erreur s'est produite lors de la connexion."
    }
  }
</script>

<style scoped>

  .centered-container {
    display: flex;
    height: 100vh;
  }

  .banner-container {
    background-image: url('../assets/banner.svg');
    background-size: cover;
    width: 60vw;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40%;
    padding: 50px;
  }

  .display-4 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 48px;
    line-height: 64px;
    letter-spacing: -0.06em;
    color: #121212;
  }

  .text-muted {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    letter-spacing: -0.04em;
    color: #3d3d3d;
  }

  .fw-medium {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 14px;
    letter-spacing: -0.04em;
    color: #121212;
  }

  .form-control {
    box-sizing: border-box;
    padding: 14px 16px;
    height: 48px;
    border: 1px solid #ededed;
    border-radius: 4px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #6b6b6b;
  }

  .btn-primary {
    padding: 12px;
    font-size: 16px;
    border-radius: 4px;
    border: none;
    width: 35%;
    display: block;
    margin: 10px auto 0;
    background-color: #121212;
  }

  .text-decoration-none {
    font-size: 14px;
    color: #3d3d3d;
  }

  .text-decoration-none:hover {
    background-color: #3d3d3d;
    opacity: 0.5;
    color: white;
  }

  .error-message {
    color: red;
    font-size: 16px;
    margin-top: -10px;
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    .centered-container {
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }

    .banner-container,
    .form-container {
      min-width: 100%;
      height: auto;
    }

    .form-container {
      max-width: 100%;
      margin-top: 20px;
      padding: 50px 20px;
    }
  }
</style>
