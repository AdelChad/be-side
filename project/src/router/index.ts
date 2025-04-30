import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import SignupView from '../views/auth/LoginView.vue'
import SearchView from '../views/search/SearchView.vue'
import SearchResultsView from '../views/search/SearchResultsView.vue'
import ActivityDetailView from '../views/activities/ActivityDetailView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignupView
        },
        {
            path: '/search',
            name: 'search',
            component: SearchView
        },
        {
            path: '/search/results',
            name: 'search-results',
            component: SearchResultsView
        },
        {
            path: '/activities/:id',
            name: 'activity-detail',
            component: ActivityDetailView
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

export default router