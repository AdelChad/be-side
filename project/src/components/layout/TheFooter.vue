<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <footer v-if="!route.meta.hideFooter">
    <div class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-links">
            <div class="footer-section">
              <h5 class="footer-heading">Informations</h5>
              <ul class="footer-list">
                <li><router-link to="/mentions-legales">Mentions légales</router-link></li>
                <li><router-link to="/conditions-utilisation">Conditions d'utilisation</router-link></li>
                <li><router-link to="/confidentialite">Politique de confidentialité</router-link></li>
              </ul>
            </div>

            <div class="footer-section">
              <h5 class="footer-heading">À propos</h5>
              <ul class="footer-list">
                <li><router-link to="/a-propos">Qui sommes-nous ?</router-link></li>
                <li><router-link to="/contact">Contact</router-link></li>
              </ul>
            </div>

            <div class="footer-section">
              <h5 class="footer-heading">Projet</h5>
              <ul class="footer-list">
                <li><a>Projet étudiant à ENSITECH</a></li>
                <li><a>Réalisé avec Vue.js & NestJS</a></li>
                <li><a>Encadré par M.HADJ MOKHNECHE</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="copyright">© {{ currentYear }} BeSide. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
    .footer {
  background-color: var(--color-primary);
  padding: var(--space-5) 0 var(--space-3);
  margin-top: var(--space-6);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--space-5);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  width: 100%;
  text-align: center;
}

.footer-heading {
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--color-secondary);
  font-size: 1rem;
}

.footer-list {
  list-style: none;
  padding: 0;
}

.footer-list li {
  margin-bottom: var(--space-2);
}

.footer-list a {
  color: var(--color-neutral-400);
  font-size: 0.875rem;
  transition: color var(--transition-fast);
}

.footer-list a:hover {
  color: var(--color-secondary);
}

.footer-bottom {
  text-align: center;
  border-top: 1px solid var(--color-neutral-800);
  padding-top: var(--space-3);
  width: 100%;
}

.copyright {
  color: var(--color-neutral-500);
  font-size: 0.875rem;
}

    .social-icons {
        display: flex;
        gap: var(--space-3);
    }

    .social-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background-color: var(--color-neutral-800);
        transition: background-color var(--transition-fast);
    }

    .social-icon:hover {
        background-color: var(--color-neutral-700);
    }

    .social-icon img {
        width: 1rem;
        height: 1rem;
    }

    @media (min-width: 768px) {
        .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
        }
    }
</style>