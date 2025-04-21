<template>
  <div class="centered-container">
    <div class="form-container">
      <div class="text-center">
        <h1 class="fw-bold display-4">Bienvenue !</h1>
        <p class="text-muted">C'est parti création d'un compte !</p>
      </div>
      <form @submit.prevent="createUserForm">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label fw-medium">Nom</label>
            <input
              v-model="lastName"
              type="text"
              class="form-control"
              @blur="validateName('lastName')"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-medium">Prénom</label>
            <input
              v-model="firstName"
              type="text"
              class="form-control"
              @blur="validateName('firstName')"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-medium">Téléphone</label>
            <input
              v-model="phoneNumber"
              type="tel"
              class="form-control"
              @input="handlePhoneNumberInput"
              @blur="validatePhoneNumber"
              required
              maxlength="10"
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-medium">Email</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              @blur="validateEmail"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-medium">Ville</label>
            <input v-model="city" type="text" class="form-control" @blur="validateCity" required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-medium">Pays</label>
            <CountrySelect v-model:country="country" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-medium">Mot de passe</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              @input="checkPasswords"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-medium">Confirmer le mot de passe</label>
            <input
              v-model="checkPassword"
              type="password"
              class="form-control"
              @input="checkPasswords"
              required
            />
          </div>
          <div class="col-12 mb-3">
            <label class="form-label fw-medium">Date de naissance</label>
            <input
              v-model="dateofbirthday"
              type="date"
              class="form-control fw-medium"
              @blur="validateDateOfBirth"
              required
            />
          </div>
        </div>
        <p v-if="errorMessageAuth" class="error-message">{{ errorMessageAuth }}</p>
        <button type="submit" class="btn btn-primary">S'inscrire</button>
      </form>
    </div>
    <div class="banner-container"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import CountrySelect from '../components/CountrySelect.vue'

  const country = ref('')
  const firstName = ref('')
  const lastName = ref('')
  const phoneNumber = ref('')
  const email = ref('')
  const password = ref('')
  const checkPassword = ref('')
  const dateofbirthday = ref('')
  const city = ref('')
  const errorMessageAuth = ref('')
  const passwordError = ref(false)

  const checkPasswords = () => {
    if (!password.value || !checkPassword.value) {
      passwordError.value = true
      errorMessageAuth.value =
        'Veuillez remplir les champs mot de passe et confirmer le mot de passe.'
    } else if (password.value !== checkPassword.value) {
      passwordError.value = true
      errorMessageAuth.value = 'Les mots de passe ne correspondent pas.'
    } else {
      passwordError.value = false
      errorMessageAuth.value = ''
    }
  }
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

  const validateDateOfBirth = () => {
    console.log('Valeur saisie :', dateofbirthday.value)

    if (!dateRegex.test(dateofbirthday.value)) {
      console.log('Test Regex:', !dateRegex.test(dateofbirthday.value))
      errorMessageAuth.value = 'Format de date invalide. Utilisez JJ/MM/AAAA.'
      return false
    }
    return true
  }

  const formatDateToISO = (dateStr: string) => {
    if (!dateStr.includes('/')) return dateStr
    const [day, month, year] = dateStr.split('/')
    return `${year}-${month}-${day}`
  }

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      errorMessageAuth.value = "L'adresse e-mail n'est pas valide."
      return false
    }
    return true
  }

  const validateName = (field: 'firstName' | 'lastName') => {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/
    const value = field === 'firstName' ? firstName.value : lastName.value
    if (!nameRegex.test(value)) {
      errorMessageAuth.value = `Le ${field === 'firstName' ? 'nom' : 'prénom'} saisi n'est pas valide.`
      return false
    }
    return true
  }

  const validateCity = () => {
    const cityRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/
    if (!cityRegex.test(city.value)) {
      errorMessageAuth.value = "La ville saisie n'est pas valide."
      return false
    }
    return true
  }

  const validatePhoneNumber = () => {
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(phoneNumber.value)) {
      errorMessageAuth.value = 'Le numéro de téléphone doit contenir exactement 10 chiffres.'
      return false
    }
    return true
  }

  const handlePhoneNumberInput = (event: Event) => {
    const input = event as unknown as InputEvent
    const target = input.target as HTMLInputElement
    target.value = target.value.replace(/\D/g, '').slice(0, 10)
    phoneNumber.value = target.value
  }

  const createUserForm = async (e: Event) => {
    e.preventDefault()
    checkPasswords()
    if (
      passwordError.value ||
      !validateName('firstName') ||
      !validateName('lastName') ||
      !validateEmail() ||
      !validatePhoneNumber() ||
      !validateDateOfBirth() ||
      !validateCity()
    ) {
      return
    }

    try {
      errorMessageAuth.value = ''
      const formattedDate = formatDateToISO(dateofbirthday.value)

      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          phoneNumber: phoneNumber.value,
          password: password.value,
          dateofbirthday: formattedDate,
          city: city.value,
          country: country.value
        })
      })

      const result = await response.json()
      if (response.ok) {
        console.log(result)
      } else {
        errorMessageAuth.value =
          result.error && result.error.includes('E-mail already exists')
            ? 'Cette adresse e-mail est déjà utilisée.'
            : "Échec de la création de l'utilisateur. Veuillez réessayer."
      }
    } catch (error) {
      console.error(error)
      errorMessageAuth.value = 'Une erreur est survenue, veuillez réessayer.'
    }
  }
</script>

<style scoped>
  .centered-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .banner-container {
    background-image: url('../assets/photoSignup.avif');
    background-size: cover;
    width: 60vw;
    height: 100vh;
  }

  .form-control {
    height: 30px;
    border: 1px solid #ededed;
    border-radius: 4px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #6b6b6b;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 60%;
    padding: 100px 80px; /* Augmente le padding en haut et en bas */
  }

  .display-4 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 40px;
    letter-spacing: -0.06em;
    color: #121212;
  }

  /* Texte sous-titre */
  .text-muted {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
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

  .btn-primary {
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    border: none;
    width: 35%;
    display: block;
    margin: 10px auto 0;
    background-color: #121212;
  }

  .error-message {
    color: red;
    font-size: 12px;
    margin-top: -10px;
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    .centered-container {
      flex-direction: column; /* Empiler l'image et le formulaire verticalement sur les petits écrans */
      justify-content: flex-start;
      align-items: center;
    }

    .banner-container,
    .form-container {
      min-width: 100%; /* Les deux éléments prennent toute la largeur */
      height: auto; /* Ajuster la taille de l'image sur les petits écrans */
    }

    .form-container {
      max-width: 100%;
      margin-top: 20px; /* Ajouter un peu d'espace au-dessus du formulaire */
    }
  }
</style>
