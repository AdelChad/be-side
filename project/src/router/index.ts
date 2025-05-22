import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import SearchView from '../views/search/SearchView.vue'
import SearchResultsView from '../views/search/SearchResultsView.vue'
import ActivityDetailView from '../views/activities/ActivityDetailView.vue'
import ConversationsView from '../views/ConversationsView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { isAuthenticated } from './guards'
import AuthView from '../views/auth/AuthView.vue'
import ProfileView from '../views/ProfileView.vue'
import MentionsLegalesView from '../views/footer/MentionsLegalesView.vue'
import ConditionsUtilisationView from '../views/footer/ConditionsUtilisationView.vue'
import ConfidentialiteView from '../views/footer/ConfidentialiteView.vue'
import APropos from '../views/footer/APropos.vue'
import ContactView from '../views/footer/ContactView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { hideNavbar: true, hideFooter: true }
        },
        {
            path: '/signup',
            name: 'signup',
            component: AuthView,
            meta: { hideNavbar: true, hideFooter: true }
        },
        {
            path: '/search',
            name: 'search',
            component: SearchView
        },
        {
            path: '/profile',
            name: 'profil',
            component: ProfileView,
            meta: { requiresAuth: true }
        },
        {
            path: '/conversations',
            name: 'conversations',
            component: ConversationsView,
            meta: { requiresAuth: true, hideFooter: true }
        },
        {
            path: '/search/results',
            name: 'search-results',
            component: SearchResultsView,
            meta: { requiresAuth: true }
        },
        {
            path: '/activities/:id',
            name: 'activity-detail',
            component: ActivityDetailView,
            meta: { requiresAuth: true }
        },
        {
            path: '/mentions-legales',
            name: 'mentions-legales',
            component: MentionsLegalesView,
            meta: { requiresAuth: true }
        },
        {
            path: '/conditions-utilisation',
            name: 'conditions-utilisation',
            component: ConditionsUtilisationView,
            meta: { requiresAuth: true }
        },
        {
            path: '/confidentialite',
            name: 'confidentialite',
            component: ConfidentialiteView,
            meta: { requiresAuth: true }
        },
        {
            path: '/a-propos',
            name: 'a-propos',
            component: APropos,
            meta: { requiresAuth: true }
        },
        {
            path: '/contact',
            name: 'contact',
            component: ContactView,
            meta: { requiresAuth: true }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFoundView
        }
    ],

    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router