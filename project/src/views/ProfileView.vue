<template>
    <div class="profile-view">
      <div class="profile-container">
        <header class="profile-header">
          <div class="container">
            <div class="header-content">
              <h1>Mon Profil</h1>
              <div class="user-info">
                <div class="avatar-section">
                  <div class="avatar-wrapper">
                    <img 
                      :src="user?.profilePicture 
                        ? `http://localhost:3000/uploads/profile-pictures/${user.profilePicture}` 
                        : defaultProfilePicture" 
                      alt="Photo de profil"
                      class="avatar-image"
                    />
                    <div class="avatar-actions">
  <label class="icon-button" title="Changer la photo">
    <input 
      type="file" 
      @change="onFileChange" 
      accept="image/*" 
      class="hidden-input"
    />
    <i class="bi bi-camera-fill"></i>
  </label>

  <button 
    v-if="user?.profilePicture"
    @click="deleteProfilePicture" 
    class="icon-button delete"
    title="Supprimer la photo"
  >
    <i class="bi bi-trash-fill"></i>
  </button>
</div>
                  </div>
                </div>
                <div class="user-details">
                  <h2>{{ user?.firstName }} {{ user?.lastName }}</h2>
                  <p class="user-location">
                    <i class="bi bi-geo-alt"></i>
                    {{ user?.city }}, {{ user?.country || 'Non renseigné' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
  
        <!-- Main Content -->
        <main class="profile-content container">
          <div class="profile-grid">
            <!-- Personal Information Card -->
            <div class="profile-card">
              <div class="card-header">
                <h3>Informations personnelles</h3>
                <button class="edit-button">
                  <i class="bi bi-pencil"></i>
                </button>
              </div>
              <div class="card-content">
                <div class="info-group">
                  <label>Email</label>
                  <p>{{ user?.email }}</p>
                </div>
                <div class="info-group">
                  <label>Téléphone</label>
                  <p>{{ user?.phoneNumber || 'Non renseigné' }}</p>
                </div>
                <div class="info-group">
                  <label>Date de naissance</label>
                  <p>{{ formatDate(user?.dateofbirthday) }}</p>
                </div>
                <div class="info-group">
                  <label>Membre depuis</label>
                  <p>{{ formatDate(user?.dateJoined) }}</p>
                </div>
              </div>
            </div>
  
            <!-- Activities Card -->
            <div class="profile-card">
              <div class="card-header">
                <h3>Mes activités favorites</h3>
              </div>
              <div class="card-content">
                <div class="activities-grid" v-if="user?.activities?.length">
                  <div v-for="activity in user.activities" :key="activity.id" class="activity-item">
                    <img :src="activity.image" :alt="activity.name" class="activity-image" />
                    <div class="activity-overlay">
                      <h4>{{ activity.name }}</h4>
                      <p>{{ activity.description }}</p>
                    </div>
                  </div>
                </div>
                <p v-else class="empty-state">Aucune activité favorite pour le moment</p>
              </div>
            </div>
  
            <!-- Restaurants Card -->
            <div class="profile-card">
              <div class="card-header">
                <h3>Mes restaurants préférés</h3>
              </div>
              <div class="card-content">
                <div class="restaurants-list" v-if="user?.restaurants?.length">
                  <div v-for="restaurant in user.restaurants" :key="restaurant.id" class="restaurant-item">
                    <img :src="restaurant.image" :alt="restaurant.name" class="restaurant-image" />
                    <div class="restaurant-info">
                      <h4>{{ restaurant.name }}</h4>
                      <p>{{ restaurant.cuisine }}</p>
                      <div class="rating">
                        <i class="bi bi-star-fill" v-for="n in restaurant.rating" :key="n"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <p v-else class="empty-state">Aucun restaurant favori pour le moment</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import type { User } from '../interfaces/User.interface'
  import defaultPicture from '../assets/Profile_picture.jpg'
  
  const user = ref<User | null>(null)
  const defaultProfilePicture = defaultPicture
  const selectedFile = ref<File | null>(null)
  
  async function getUser() {
    try {
      const response = await fetch('http://localhost:3000/users/me/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
  
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      const data = await response.json()
      user.value = data
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
    }
  }
  
  function formatDate(dateInput: string | Date | undefined): string {
    if (!dateInput) return 'Non renseigné'
    
    const date = new Date(dateInput)
    if (date.toString() === 'Invalid Date') return 'Non renseigné'
  
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }
  
  async function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return
  
    selectedFile.value = input.files[0]
    await uploadProfilePicture()
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
  
      if (!response.ok) throw new Error('Erreur lors du téléchargement')
      
      const data = await response.json()
      if (user.value) user.value.profilePicture = data.profilePicture
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      alert('Une erreur est survenue lors du téléchargement de l\'image.')
    }
  }
  
  async function deleteProfilePicture() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) return
  
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
  
      if (!response.ok) throw new Error('Erreur lors de la suppression')
  
      if (user.value) user.value.profilePicture = ''
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Une erreur est survenue lors de la suppression de l\'image.')
    }
  }
  
  onMounted(getUser)
  </script>
  
  <style scoped>
  .profile-view {
    min-height: 100vh;
    background-color: var(--color-neutral-100);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-4);
  }
  
  .profile-header {
    background-color: var(--color-primary);
    padding: var(--space-6) 0;
    color: var(--color-secondary);
  }
  
  .header-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }
  
  .avatar-section {
    position: relative;
    margin-bottom: var(--space-4);
  }
  
  .avatar-wrapper {
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: visible;
    margin: 0 auto;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid var(--color-secondary);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .avatar-actions {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: var(--space-2);
    margin-top: var(--space-2);
    width: max-content;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    background-color: var(--color-secondary);
    color: var(--color-primary);
    border: 1px solid var(--color-neutral-300);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 0.875rem;
  }
  
  .action-button:hover {
    background-color: var(--color-neutral-100);
    transform: translateY(-1px);
  }
  
  .upload-button {
    background-color: var(--color-secondary);
    color: var(--color-primary);
  }
  
  .delete-button {
    background-color: var(--color-error);
    color: var(--color-secondary);
    border-color: var(--color-error);
  }
  
  .delete-button:hover {
    background-color: #ef4444;
    color: var(--color-secondary);
  }
  
  .action-text {
    font-weight: 500;
  }
  
  .hidden-input {
    display: none;
  }
  
  .user-details h2 {
    font-size: 1.5rem;
    margin-bottom: var(--space-2);
  }
  
  .user-location {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-neutral-300);
  }
  
  .profile-content {
    padding: var(--space-6) 0;
  }
  
  .profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-4);
  }
  
  .profile-card {
    background: var(--color-secondary);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    padding: var(--space-4);
    border-bottom: 1px solid var(--color-neutral-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-primary);
  }
  
  .edit-button {
    background: none;
    border: none;
    color: var(--color-neutral-600);
    cursor: pointer;
    padding: var(--space-2);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }
  
  .edit-button:hover {
    background: var(--color-neutral-100);
    color: var(--color-primary);
  }
  
  .card-content {
    padding: var(--space-4);
  }
  
  .info-group {
    margin-bottom: var(--space-4);
  }
  
  .info-group:last-child {
    margin-bottom: 0;
  }
  
  .info-group label {
    display: block;
    color: var(--color-neutral-600);
    font-size: 0.875rem;
    margin-bottom: var(--space-1);
  }
  
  .info-group p {
    color: var(--color-primary);
    font-size: 1rem;
  }
  
  .activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--space-3);
  }
  
  .activity-item {
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
    aspect-ratio: 1;
  }
  
  .activity-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .activity-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--space-2);
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    color: white;
  }
  
  .restaurants-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .restaurant-item {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-2);
    border-radius: var(--radius-md);
    transition: background-color var(--transition-fast);
  }
  
  .restaurant-item:hover {
    background-color: var(--color-neutral-100);
  }
  
  .restaurant-image {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-md);
    object-fit: cover;
  }
  
  .restaurant-info h4 {
    margin-bottom: var(--space-1);
    color: var(--color-primary);
  }
  
  .restaurant-info p {
    color: var(--color-neutral-600);
    font-size: 0.875rem;
  }
  
  .rating {
    color: #fbbf24;
    margin-top: var(--space-1);
  }
  
  .empty-state {
    text-align: center;
    color: var(--color-neutral-600);
    padding: var(--space-4);
  }

  .icon-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  color: var(--color-secondary);
  transition: transform 0.2s ease;
}

.icon-button:hover {
  transform: scale(1.1);
}

.icon-button.delete {
  color: var(--color-error);
}
  
  @media (max-width: 768px) {
    .header-content {
      text-align: center;
    }
  
    .user-info {
      flex-direction: column;
      align-items: center;
    }
  
    .profile-grid {
      grid-template-columns: 1fr;
    }
  
    .avatar-wrapper {
      width: 120px;
      height: 120px;
    }
  
    .avatar-actions {
      flex-direction: row;
      position: relative;
      transform: none;
      left: 0;
      justify-content: center;
      margin-top: var(--space-3);
    }
  
    .action-button {
      padding: var(--space-2);
    }
  }
  </style>