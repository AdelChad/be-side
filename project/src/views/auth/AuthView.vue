  <script setup lang="ts">
  import { ref } from 'vue';
  import router from '../../router';
  import CountrySelect from '../../components/CountrySelect.vue';

  const country = ref('');
  const firstName = ref('');
  const lastName = ref('');
  const phoneNumber = ref('');
  const email = ref('');
  const password = ref('');
  const checkPassword = ref('');
  const dateofbirthday = ref('');
  const city = ref('');
  const errorMessageAuth = ref('');
  const passwordError = ref(false);
  const isSubmitting = ref(false);

  const checkPasswords = () => {
    if (!password.value || !checkPassword.value) {
      passwordError.value = true;
      errorMessageAuth.value = 'Veuillez remplir les champs mot de passe et confirmer le mot de passe.';
    } else if (password.value !== checkPassword.value) {
      passwordError.value = true;
      errorMessageAuth.value = 'Les mots de passe ne correspondent pas.';
    } else {
      passwordError.value = false;
      errorMessageAuth.value = '';
    }
  };

  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

  const validateDateOfBirth = () => {
    if (!dateRegex.test(dateofbirthday.value)) {
      errorMessageAuth.value = 'Format de date invalide. Utilisez AAAA-MM-JJ.';
      return false;
    }
    return true;
  };

  const formatDateToISO = (dateStr: string) => {
    if (!dateStr.includes('/')) return dateStr;
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      errorMessageAuth.value = "L'adresse e-mail n'est pas valide.";
      return false;
    }
    return true;
  };

  const validateName = (field: 'firstName' | 'lastName') => {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
    const value = field === 'firstName' ? firstName.value : lastName.value;
    if (!nameRegex.test(value)) {
      errorMessageAuth.value = `Le ${field === 'firstName' ? 'prénom' : 'nom'} saisi n'est pas valide.`;
      return false;
    }
    return true;
  };

  const validateCity = () => {
    const cityRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
    if (!cityRegex.test(city.value)) {
      errorMessageAuth.value = "La ville saisie n'est pas valide.";
      return false;
    }
    return true;
  };

  const validatePhoneNumber = () => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber.value)) {
      errorMessageAuth.value = 'Le numéro de téléphone doit contenir exactement 10 chiffres.';
      return false;
    }
    return true;
  };

  const handlePhoneNumberInput = (event: Event) => {
    const input = event as unknown as InputEvent;
    const target = input.target as HTMLInputElement;
    target.value = target.value.replace(/\D/g, '').slice(0, 10);
    phoneNumber.value = target.value;
  };

  const createUserForm = async (e: Event) => {
    e.preventDefault();
    checkPasswords();
    
    if (
      passwordError.value ||
      !validateName('firstName') ||
      !validateName('lastName') ||
      !validateEmail() ||
      !validatePhoneNumber() ||
      !validateDateOfBirth() ||
      !validateCity()
    ) {
      return;
    }

    try {
      isSubmitting.value = true;
      errorMessageAuth.value = '';
      const formattedDate = formatDateToISO(dateofbirthday.value);

      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
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
      });

      const result = await response.json();
      if (response.ok) {
        router.push('/')
      } else {
        errorMessageAuth.value =
          result.error && result.error.includes('E-mail already exists')
            ? 'Cette adresse e-mail est déjà utilisée.'
            : "Échec de la création de l'utilisateur. Veuillez réessayer.";
      }
    } catch (error) {
      console.error(error);
      errorMessageAuth.value = 'Une erreur est survenue, veuillez réessayer.';
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>

  <template>
    <div class="signup-view">
      <div class="signup-container">
        <div class="form-container">
          <div class="form-content">
            <h1 class="title">Bienvenue !</h1>
            <p class="subtitle">C'est parti, création d'un compte !</p>
            
            <form @submit.prevent="createUserForm" class="signup-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="lastName" class="form-label">Nom</label>
                  <input
                    id="lastName"
                    v-model="lastName"
                    type="text"
                    class="form-control"
                    placeholder="Votre nom"
                    @blur="validateName('lastName')"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="firstName" class="form-label">Prénom</label>
                  <input
                    id="firstName"
                    v-model="firstName"
                    type="text"
                    class="form-control"
                    placeholder="Votre prénom"
                    @blur="validateName('firstName')"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="phoneNumber" class="form-label">Téléphone</label>
                  <input
                    id="phoneNumber"
                    v-model="phoneNumber"
                    type="tel"
                    class="form-control"
                    placeholder="0612345678"
                    @input="handlePhoneNumberInput"
                    @blur="validatePhoneNumber"
                    maxlength="10"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="email" class="form-label">Email</label>
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    class="form-control"
                    placeholder="exemple@email.com"
                    @blur="validateEmail"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="city" class="form-label">Ville</label>
                  <input
                    id="city"
                    v-model="city"
                    type="text"
                    class="form-control"
                    placeholder="Votre ville"
                    @blur="validateCity"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="country" class="form-label">Pays</label>
                  <CountrySelect v-model:country="country" />
                </div>
                
                <div class="form-group">
                  <label for="password" class="form-label">Mot de passe</label>
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    class="form-control"
                    placeholder="••••••••••"
                    @input="checkPasswords"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="confirmPassword" class="form-label">Confirmer le mot de passe</label>
                  <input
                    id="confirmPassword"
                    v-model="checkPassword"
                    type="password"
                    class="form-control"
                    placeholder="••••••••••"
                    @input="checkPasswords"
                    required
                  />
                </div>
              </div>
              
              <div class="form-group full-width">
                <label for="dateofbirthday" class="form-label">Date de naissance</label>
                <input
                  id="dateofbirthday"
                  v-model="dateofbirthday"
                  type="date"
                  class="form-control"
                  @blur="validateDateOfBirth"
                  required
                />
              </div>
              
              <div v-if="errorMessageAuth" class="error-message">
                {{ errorMessageAuth }}
              </div>
              
              <button 
                type="submit" 
                class="btn-primary" 
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Inscription en cours...' : 'S\'inscrire' }}
              </button>
              
              <div class="login-link">
                <p>Vous avez déjà un compte ?</p>
                <router-link to="/login" class="text-link">Se connecter !</router-link>
              </div>
            </form>
          </div>
        </div>
        
<div class="image-container">
  <img src="../../assets/icons/beside blanc.png" alt="Logo Beside" class="logo-img" />
  <div class="image-overlay">
    <h2 class="overlay-title">Découvrez de nouvelles expériences</h2>
    <p class="overlay-text">Rejoignez notre communauté et accédez à des opportunités uniques.</p>
  </div>
</div>
      </div>
    </div>
  </template>

  <style scoped>
  :root {
    --color-primary: #121212;
    --color-secondary: #ffffff;
    --color-accent: #3b82f6;
    --color-error: #ef4444;
    --color-success: #10b981;
    --color-neutral-100: #f9fafb;
    --color-neutral-200: #f3f4f6;
    --color-neutral-300: #e5e7eb;
    --color-neutral-400: #d1d5db;
    --color-neutral-500: #9ca3af;
    --color-neutral-600: #6b7280;
    --color-neutral-700: #4b5563;
    --color-neutral-800: #374151;
    --color-neutral-900: #1f2937;
    
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.5rem;
    --space-6: 2rem;
    --space-8: 3rem;
    
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
  }

    html, body, #app {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .signup-view {
  min-height: 100vh;
  height: auto;
  overflow-y: auto;
  display: flex;
  background-color: var(--color-primary);
  }

  .signup-container {
    display: flex;
    flex: 1;
    width: 100%;
    background-color: var(--color-secondary);
  }

  .form-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  }

  .form-content {
    width: 100%;
    max-width: 600px;
    padding: var(--space-5);
  }

  .title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: var(--space-2);
    color: var(--color-primary);
    line-height: 1.2;
  }

  .subtitle {
    color: var(--color-neutral-600);
    font-size: 1rem;
    margin-bottom: var(--space-6);
  }

  .signup-form {
    margin-bottom: var(--space-4);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
    margin-bottom: var(--space-4);
  }

  .form-group {
    margin-bottom: var(--space-4);
  }

  .form-group.full-width {
    grid-column: span 2;
  }

  .form-label {
    display: block;
    margin-bottom: var(--space-2);
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--color-primary);
  }

  .form-control {
    width: 100%;
    border: 1px solid var(--color-neutral-300);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    background-color: var(--color-secondary);
    color: var(--color-neutral-800);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    height: 48px;
  }

  .form-control:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .error-message {
    color: var(--color-error);
    margin-bottom: var(--space-4);
    font-size: 0.875rem;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .btn-primary {
    width: 100%;
    font-weight: 600;
    background-color: var(--color-primary);
    color: var(--color-secondary);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color var(--transition-fast), transform var(--transition-fast);
    font-size: 1rem;
    margin-bottom: var(--space-4);
    height: 48px;
  }

  .btn-primary:hover {
    background-color: var(--color-neutral-800);
    transform: translateY(-1px);
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  .btn-primary:disabled {
    background-color: var(--color-neutral-400);
    cursor: not-allowed;
    transform: none;
  }

  .login-link {
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-neutral-600);
    color: var(--color-primary);
    margin-top: var(--space-4);
  }

  .text-link {
    font-weight: 600;
    transition: color var(--transition-fast);
    margin-left: var(--space-1);
  }

  .text-link:hover {
    color: var(--color-accent);
  }

  .image-container {
    display: none;
    position: relative;
    flex: 1;
    background-image: url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg');
    background-size: cover;
    background-position: center;
  }

  .image-overlay {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: var(--space-6);
    color: white;
  }

  .logo-img {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  height: 150px;
  width: auto;
  z-index: 2;
}

  .overlay-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: var(--space-3);
    line-height: 1.2;
  }

  .overlay-text {
    font-size: 1rem;
    max-width: 400px; 
    opacity: 0.9;
  }

  @media (min-width: 768px) {
    .image-container {
      display: block;
    }
    
    .form-container {
      padding: var(--space-6);
      overflow-y: auto;
    }
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .form-group.full-width {
      grid-column: span 1;
    }
    
    .title {
      font-size: 2rem;
    }
    
    .form-content {
      padding: var(--space-4);
    }
  }
  </style>