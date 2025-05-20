import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './components/Dashboard.vue'
import Trips from './components/Trips.vue'
import Expenses from './components/Expenses.vue'
import Goals from './components/Goals.vue'
import Reports from './components/Reports.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Profile from './components/Profile.vue'

const routes = [
    {
        path: '/login',
        component: Login,
        meta: { public: true }
    },
    {
        path: '/register',
        component: Register,
        meta: { public: true }
    },
    {
        path: '/',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/trips',
        component: Trips,
        meta: { requiresAuth: true }
    },
    {
        path: '/expenses',
        component: Expenses,
        meta: { requiresAuth: true }
    },
    {
        path: '/goals',
        component: Goals,
        meta: { requiresAuth: true }
    },
    {
        path: '/reports',
        component: Reports,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        component: Profile,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token')
    const isPublicRoute = to.matched.some(record => record.meta.public)

    if (!isAuthenticated && !isPublicRoute) {
        next('/login')
    } else if (isAuthenticated && to.path === '/login') {
        next('/')
    } else {
        next()
    }
})

export default router