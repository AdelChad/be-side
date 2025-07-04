<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessageLogin = ref('')
const rememberMe = ref(false)
const isSubmitting = ref(false)
const error = ref('')

const submitForm = async (e: Event) => {
  e.preventDefault()
  errorMessageLogin.value = ''
  error.value = ''
  isSubmitting.value = true

  if (!email.value || !password.value) {
    errorMessageLogin.value = 'Veuillez compléter tous les champs.'
    isSubmitting.value = false
    return
  }

  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        pass: password.value,
      }),
    })

    const result = await response.json()

    if (response.ok && result.access_token) {
      localStorage.setItem('access_token', result.access_token)

      if (rememberMe.value) {
        localStorage.setItem('user_email', email.value)
        localStorage.setItem('userLoggedIn', 'true')
      } else {
        localStorage.removeItem('user_email')
        localStorage.removeItem('userLoggedIn')
      }

      router.push('/')
    } else if (response.status === 401 || response.status === 404) {
      errorMessageLogin.value = result?.message || 'Email ou mot de passe incorrect.'
    } else {
      errorMessageLogin.value = result?.message || "Une erreur s'est produite lors de la connexion."
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'Une erreur inconnue est survenue.'
    }
    errorMessageLogin.value = "Impossible de se connecter. Veuillez réessayer plus tard."
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
    <div class="login-view">
        <div class="login-container">
            <div class="login-image-container">
                <img src="../../assets/icons/beside blanc.png" alt="Logo Beside" class="logo-img" />
                <img src="https://images.pexels.com/photos/917494/pexels-photo-917494.jpeg" alt="Login"
                    class="login-image">
                <div class="login-overlay">
                    <h1 class="login-headline">Trouvez votre prochaine expérience en un clin d'oeil</h1>
                    <p class="login-tagline">Explorez des activités et restaurants sélectionnés pour vous, et organisez des sorties inoubliables en quelques clics.</p>
                </div>
            </div>

            <div class="login-form-container">
                <div class="login-form-content">
                    <h2 class="login-title">Bon retour !</h2>
                    <p class="login-subtitle">Entrez vos coordonnées ci-dessous</p>

                    <form @submit.prevent="submitForm" class="login-form">
                        <div class="form-group">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" id="email" class="form-control" placeholder="Entrez votre e-mail"
                                :value="email" @input="(event) => (email = (event.target as HTMLInputElement).value)"
                                required />
                        </div>

                        <div class="form-group">
                            <div class="password-header">
                                <label for="password" class="form-label">Mot de passe</label>
                                <a href="#" class="forgot-password">Mot de passe oublié ?</a>
                            </div>
                            <input type="password" id="password" :value="password"
                                @input="(event) => (password = (event.target as HTMLInputElement).value)" required
                                class="form-control" placeholder="Entrez votre mot de passe" />
                        </div>

                        <div class="form-group remember-me">
                            <label class="checkbox-container">
                                <input type="checkbox" v-model="rememberMe">
                                <span class="checkmark"></span>
                                Se souvenir
                            </label>
                        </div>

                        <div v-if="errorMessageLogin" class="error-message">
                            {{ errorMessageLogin }}
                        </div>

                        <button type="submit" class="btn btn-primary login-btn" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Connexion...' : 'Se connecter' }}
                        </button>
                    </form>

                    <div class="login-divider">
                        <span class="divider-text">ou continuez avec</span>
                    </div>

                    <div class="social-login">
                    </div>

                    <div class="signup-link">
                        Vous n'avez pas de compte ? <router-link to="/signup">S'inscrire</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-view {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-primary);
}

.login-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-secondary);
    color: var(--color-primary);
}


.login-image-container {
    position: relative;
    flex: 1;
    height: 100%;
    overflow: hidden;
}

.login-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.logo-img {
    position: absolute;
    top: var(--space-4);
    left: var(--space-4);
    height: 150px;
    width: auto;
    z-index: 2;
}

.login-overlay {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: var(--space-6);
    color: var(--color-secondary);
    background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
    z-index: 1;
}

.login-headline {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: var(--space-3);
    line-height: 1.2;
}

.login-tagline {
    font-size: 1rem;
    max-width: 400px;
}

.login-form-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
}

.login-form-content {
    width: 100%;
    max-width: 400px;
}

.login-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: var(--space-2);
    color: var(--color-primary);
}

.login-subtitle {
    color: var(--color-neutral-600);
    margin-bottom: var(--space-4);
}

.login-form {
    margin-bottom: var(--space-4);
}

.form-group {
    margin-bottom: var(--space-4);
}

.form-label {
    display: block;
    margin-bottom: var(--space-1);
    font-weight: 500;
    color: var(--color-primary);
}

.form-control {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-neutral-300);
    border-radius: var(--radius-md);
    font-size: 1rem;
    background-color: var(--color-secondary);
    color: var(--color-primary);
    transition: border-color var(--transition-fast);
}

.form-control:focus {
    outline: none;
    border-color: var(--color-accent);
}

.password-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-1);
}

.forgot-password {
    font-size: 0.875rem;
    color: var(--color-neutral-600);
    text-decoration: none;
    transition: color var(--transition-fast);
}

.forgot-password:hover {
    color: var(--color-primary);
}

.remember-me {
    display: flex;
    align-items: center;
}

.checkbox-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--color-neutral-600);
}

.checkbox-container input {
    opacity: 0;
    width: 0;
    height: 0;
}

.checkmark {
    margin-right: var(--space-2);
    width: 18px;
    height: 18px;
    border: 1px solid var(--color-neutral-400);
    border-radius: var(--radius-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.checkbox-container input:checked~.checkmark {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
}

.checkbox-container input:checked~.checkmark::after {
    content: "✓";
    display: block;
    color: var(--color-primary);
    font-size: 0.75rem;
}

.error-message {
    color: var(--color-error);
    margin-bottom: var(--space-3);
    font-size: 0.875rem;
}

.login-btn {
    width: 100%;
    padding: var(--space-3);
    font-weight: 600;
    background-color: var(--color-primary);
    color: var(--color-secondary);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color var(--transition-fast);
}

.login-btn:hover {
    background-color: var(--color-neutral-800);
}

.login-btn:disabled {
    background-color: var(--color-neutral-400);
    cursor: not-allowed;
}

.login-divider {
    position: relative;
    text-align: center;
    margin: var(--space-4) 0;
}

.login-divider::before,
.login-divider::after {
    content: "";
    position: absolute;
    top: 50%;
    width: calc(50% - 70px);
    height: 1px;
    background-color: var(--color-neutral-300);
}

.login-divider::before {
    left: 0;
}

.login-divider::after {
    right: 0;
}

.divider-text {
    display: inline-block;
    padding: 0 var(--space-2);
    background-color: var(--color-secondary);
    color: var(--color-neutral-500);
    font-size: 0.875rem;
    position: relative;
    z-index: 1;
}

.social-login {
    display: flex;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
}

.social-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-2);
    border: 1px solid var(--color-neutral-300);
    border-radius: var(--radius-md);
    background-color: var(--color-secondary);
    color: var(--color-primary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color var(--transition-fast);
}

.social-btn:hover {
    background-color: var(--color-neutral-100);
}

.social-icon {
    width: 20px;
    height: 20px;
}

.signup-link {
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-neutral-600);
}

.signup-link a {
    color: var(--color-primary);
    font-weight: 600;
    transition: color var(--transition-fast);
}

.signup-link a:hover {
    color: var(--color-accent);
}

@media (min-width: 768px) {
    .login-image-container {
        display: block;
    }

    .login-form-container {
        padding: var(--space-5);
    }
}

@media (max-width: 768px) {
    .login-image-container {
        display: none;
    }

    .login-form-content {
        height: auto;
    }

    .login-form-container {
        padding: var(--space-5);
        overflow-y: auto;
        max-height: 100vh;
    }

    .login-container {
        flex-direction: column;
        height: auto;
        min-height: 100vh;
    }

    .login-view {
        align-items: flex-start;
    }
}
</style>