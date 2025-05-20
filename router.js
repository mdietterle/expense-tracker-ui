import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './src/components/Dashboard.vue'
import Trips from './src/components/Trips.vue'
import Expenses from './src/components/Expenses.vue'
import Goals from './src/components/Goals.vue'
import Reports from './src/components/Reports.vue'
import Login from './src/components/Login.vue'
import Register from './src/components/Register.vue'

const routes = [
    { path: '/', component: Dashboard },
    { path: '/trips', component: Trips },
    { path: '/expenses', component: Expenses },
    { path: '/goals', component: Goals },
    { path: '/reports', component: Reports },
    { path: '/login', component: Login },
    { path: '/register', component: Register }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router