    <script setup lang="ts">
    import { onMounted, onUnmounted, computed, ref } from 'vue'
    import { useRoute } from 'vue-router'
    import defaultPicture from '../../assets/Profile_picture.jpg'
    import router from '../../router'
    import { isAuthenticated } from '../../router/guards'
    import { useUserStore } from '../../stores/user'
    import SearchBar from '../../components/SearchBar.vue'
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { library } from '@fortawesome/fontawesome-svg-core'
    import { faCalendarDays, faMessage, faSliders } from '@fortawesome/free-solid-svg-icons'
    library.add(faMessage, faSliders, faCalendarDays)

    const route = useRoute()
    const isTransparent = computed(() => route.path === '/')

    const menuOpen = ref(false)
    const menuRef = ref<HTMLElement | null>(null)
    const avatarRef = ref<HTMLElement | null>(null)

    const mobileMenuOpen = ref(false)
    const mobileMenuRef = ref<HTMLElement | null>(null)

    function toggleMenu() {
        menuOpen.value = !menuOpen.value
    }

    function toggleMobileMenu() {
        mobileMenuOpen.value = !mobileMenuOpen.value
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as Node

        if (
            menuRef.value?.contains(target) ||
            avatarRef.value?.contains(target) ||
            mobileMenuRef.value?.contains(target)
        ) {
            return
        }

        menuOpen.value = false
        mobileMenuOpen.value = false
    }

    onMounted(() => {
        document.addEventListener('mousedown', handleClickOutside)
    })

    onUnmounted(() => {
        document.removeEventListener('mousedown', handleClickOutside)
    })

    function logout() {
        localStorage.removeItem('access_token')
        router.push({ name: 'login' })
    }

    const store = useUserStore()

    const user = computed(() => store.user)

    const profilePictureUrl = computed(() => {
        return user.value?.profilePicture
            ? `http://localhost:3000/uploads/profile-pictures/${user.value.profilePicture}`
            : defaultPicture
    })

</script>



    <template>
        <header :class="['header', { 'header-transparent': isTransparent }]">
            <div class="container header-container">
                <div class="logo-beside">
                    <router-link to="/">
                        <img src="../../assets/icons/beside blanc.png" alt="Logo Beside" class="logo-img" />
                    </router-link>
                </div>
                <nav v-if="!route.meta.hideNavbar">
                    <div class="nav">
                        <SearchBar class="search-bar-wrapper" />
                        <div class="icon-link">
                        <router-link to="/search" class="nav-link">
                        <font-awesome-icon :icon="['fas', 'sliders']" />
                            Personnaliser
                        </router-link>
                        </div>
                        <div class="icon-link">
                        <router-link to="/conversations" class="nav-link"> 
                          <font-awesome-icon icon="fa-solid fa-message" />
                            Messages
                        </router-link>
                        </div>
                        <div class="icon-link">
                        <router-link to="/plannings" class="nav-link"> 
                          <font-awesome-icon :icon="['fas', 'calendar-days']" />
                            Plannings
                        </router-link>
                        </div>
                    </div>
                </nav>

                <button class="burger-btn" @click="toggleMobileMenu">
                    ☰
                </button>

                <!-- Menu mobile -->
                <div v-if="mobileMenuOpen" class="mobile-menu" ref="mobileMenuRef">
                    <router-link to="/search" class="mobile-link" @click="toggleMobileMenu">Personnaliser</router-link>
                    <router-link to="/conversations" class="mobile-link" @click="toggleMobileMenu">Messages</router-link>
                    <router-link to="/plannings" class="mobile-link" @click="toggleMobileMenu">Plannings</router-link>
                    <router-link to="/profile" class="mobile-link" @click="toggleMobileMenu">Mon profil</router-link>

                    <div v-if="!isAuthenticated()" class="mobile-auth">
                        <router-link v-if="route.path !== '/login'" to="/login" class="mobile-link"
                            @click="toggleMobileMenu">Se connecter</router-link>
                        <router-link v-if="route.path !== '/signup'" to="/signup" class="mobile-link"
                            @click="toggleMobileMenu">Créer un compte</router-link>
                    </div>

                    <div v-if="isAuthenticated()" class="mobile-auth">
                        <a href="#" @click.prevent="logout" class="mobile-link">Déconnexion</a>
                    </div>
                </div>

                <div v-if="!isAuthenticated()" class="auth-buttons">
                    <router-link v-if="route.path !== '/login'" to="/login" class="btn btn-outline">Se
                        connecter</router-link>
                    <router-link v-if="route.path !== '/signup'" to="/signup" class="btn btn-primary">Créer un
                        compte</router-link>
                </div>
                <div v-if="isAuthenticated()" class="user-menu" ref="menuRef">
                    <div class="avatar-wrapper" @click="toggleMenu">
                        <img :src="profilePictureUrl" alt="Photo de profil" />
                    </div>
                    <div v-if="menuOpen" class="dropdown-menu">
                        <router-link to="/profile" class="dropdown-item">Mon profil</router-link>
                        <router-link to="/" @click.native.prevent="logout"
                            class="dropdown-item">Déconnexion</router-link>
                    </div>
                </div>
            </div>
        </header>
    </template>

<style scoped>
.header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--color-primary);
    padding: var(--space-3) 0;
    transition: background-color var(--transition-normal);
}

.header-transparent {
    background-color: transparent;
    position: absolute;
    width: 100%;
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    display: flex;
    align-items: center;
}

.logo-img {
    height: 2rem;
}

.nav {
    display: none;
    align-items: center;
}

.icon-link {
display: flex;
text-align: center;
}

.nav-link {
    margin: 0 var(--space-3);
    position: relative;
    color: var(--color-secondary);
    transition: color var(--transition-fast);
}

.nav-link:hover,
.nav-link.router-link-active {
    color: var(--color-accent);
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-accent);
    transition: width var(--transition-fast);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
    width: 100%;
}

.auth-buttons {
    display: flex;
    gap: var(--space-2);
    align-items: center;
}

.logo-beside {
    display: flex;
    align-items: center;
}

.logo-beside .logo-img {
    height: 100px;
    width: auto;
    max-height: 100%;
    object-fit: contain;
}

.user-menu {
    position: relative;
}

.avatar-wrapper {
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;
    width: 40px;
    height: 40px;
}

.search-bar-wrapper {
    max-width: 400px;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    z-index: 999;
    min-width: 150px;
}

.dropdown-item {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-primary);
    transition: background 0.2s ease;
}

.dropdown-item:hover {
    background-color: var(--color-light-grey);
}

.burger-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: white;
    cursor: pointer;
    display: none;
}

.mobile-menu {
    position: absolute;
    top: 100%;
    right: 1rem;
    background-color: white;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    z-index: 999;
}

.mobile-link {
    padding: 0.5rem 0;
    text-decoration: none;
    color: var(--color-primary);
}

.mobile-link:hover {
    color: var(--color-accent);
}

@media (max-width: 768px) {

    .nav,
    .user-menu,
    .auth-buttons {
        display: none;
    }

    .burger-btn {
        display: block;
    }
}

@media (min-width: 768px) {
    .mobile-menu {
        display: none !important;
    }
}


@media (max-width: 768px) {
    .logo-beside .logo-img {
        height: 75px;
    }
}

@media (min-width: 768px) {
    .nav {
        display: flex;
    }
}
</style>