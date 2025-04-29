<template>
  <div class="container-xl dashboard d-flex justify-content-center align-items-center">
    <main class="col-lg-10 p-4">
      <header class="d-flex justify-content-between align-items-center">
        <h2>Mon profil</h2>
        <div class="user-info d-flex align-items-center">
          <label class="upload-label" @click.prevent>
            <img :src="user?.profilePicture
                ? `http://localhost:3000/uploads/profile-pictures/${user.profilePicture}`
                : defaultProfilePicture
              " class="mini-profile-img" alt="Profile" />
            <input ref="fileInputRef" type="file" @change="onFileChange" accept="image/*" class="d-none" />
          </label>
          <span>Bonjour {{ user?.firstName || '' }}</span>
        </div>
      </header>

      <div class="row mt-4">
        <div class="col-md-6">
          <div class="card p-3 h-100 d-flex align-items-center text-center">
            <label class="upload-label cursor-pointer position-relative profile-wrapper">
              <img :src="user?.profilePicture
                  ? `http://localhost:3000/uploads/profile-pictures/${user.profilePicture}`
                  : defaultProfilePicture
                " class="profile-img hover-shadow" alt="Profile" />
              <div class="edit-circle">
                <i class="bi bi-pencil pencil-icon" title="Modifier la photo"></i>
              </div>
              <input ref="fileInputRef" type="file" @change="onFileChange" accept="image/*" class="d-none" />
            </label>
            <button class="btn btn-sm btn-outline-secondary delete-icon" @click="deleteProfilePicture()"
              title="Supprimer la photo">
              <i class="bi bi-trash3"></i>
            </button>
            <h5 class="p-3">{{ user?.firstName }} {{ user?.lastName }}</h5>
            <p>
              <i class="bi bi-geo-alt-fill me-2"></i>
              {{ user?.country || 'Non renseigné' }}
            </p>
            <p>
              <i class="bi bi-calendar3 me-2"></i>
              A rejoint le {{ formatDate(user?.dateJoined) }}
            </p>
            <p>{{ user?.email || 'Non renseigné' }}</p>
          </div>
        </div>

        <div class="col-md-6 d-flex flex-column h-100">
          <div class="card p-3 flex-grow-1 mb-3 accounts-card">
            <h5>Mes activités</h5>
            <p>Les activités likées :</p>
          </div>

          <!-- Pas encore mis en place -->
          <div class="card p-3 flex-grow-1">
            <h5>Mes restaurants</h5>
            <p>Les restaurants likées :</p>
            <ul class="list-group">
              <li
                class="list-group-item d-flex justify-content-between"
                v-for="activity in user?.activities"
                :key="activity.id"
              >
                {{ activity.name }}
                <span :class="activity.liked ? 'badge bg-success' : 'badge bg-danger'">
                  {{ activity.liked ? 'Like' : 'Dislike' }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '../interface/User.interface'

const user = ref<User | null>(null)
const defaultProfilePicture = '/assets/Profile_picture.jpg'
const fileInputRef = ref<HTMLInputElement | null>(null)

async function getUser() {
  try {
    const response = await fetch('http://localhost:3000/users/me/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const data = await response.json()

    if (!data) {
      throw new Error('Réponse vide')
    }

    user.value = data
  } catch (error) {
    console.error('Erreur lors de la récupération de l’utilisateur:', error)
  }
}

function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput || new Date(dateInput).toString() === 'Invalid Date') return ''

  const date = new Date(dateInput)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return new Intl.DateTimeFormat('fr-FR', options).format(date)
}

const selectedFile = ref<File | null>(null)

function onFileChange(event: Event) {
  const fileInput = event.target as HTMLInputElement
  if (fileInput.files && fileInput.files[0]) {
    selectedFile.value = fileInput.files[0]
    uploadProfilePicture()
  }
}

async function uploadProfilePicture() {
  if (!selectedFile.value) {
    alert('Veuillez sélectionner une image.')
    return
  }

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await fetch(`http://localhost:3000/users/${user.value?.id}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement de l’image.')
    }

    const data = await response.json()
    user.value!.profilePicture = data.profilePicture
  } catch (error) {
    console.error('Erreur upload:', error)
  }
}

async function deleteProfilePicture() {
  try {
    const response = await fetch(
      `http://localhost:3000/users/${user.value?.id}/profile-picture`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l’image.')
    }

    user.value!.profilePicture = null
  } catch (error) {
    console.error('Erreur suppression:', error)
  }
}

onMounted(getUser)
</script>

<style scoped>
.nav-link {
  color: gray;
}

.nav-link:hover {
  color: black;
}

.profile-img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin: 0 auto;
}

.mini-profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: auto;
  object-fit: cover;
  cursor: pointer;
}

.align-items-center {
  gap: 10px;
}

.card {
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-section {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  min-height: 100%;
}

.d-flex.flex-column.h-100>.card {
  flex: 1;
}

.profile-wrapper {
  display: inline-block;
  position: relative;
  width: fit-content;
}

.hover-shadow {
  transition: box-shadow 0.3s ease;
  border-radius: 50%;
}

.hover-shadow:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.pencil-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 50%;
  padding: 5px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.edit-circle i::before {
  vertical-align: 0 !important;
}

h2,
h5,
p {
  color: #003366;
}

.btn-primary,
.bg-primary {
  background-color: #003366;
  border-color: #003366;
}

.btn-outline-primary {
  color: #003366;
  border-color: #003366;
}

.btn-outline-primary:hover {
  background-color: #003366;
  color: white;
}

.delete-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 2;
  border-radius: 50%;
  padding: 4px 7px;
  font-size: 14px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 767px) {
  .accounts-card {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}

@media (min-width: 1600px) {
  .dashboard {
    max-width: 1400px;
    margin: auto;
  }
}
</style>
