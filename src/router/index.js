import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home.vue';
import Expenses from '@/components/Expenses.vue';
import UserProfile from '@/components/UserProfile.vue'; // Importe o novo componente

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/expenses',
      name: 'Expenses',
      component: Expenses
    },
    {
      path: '/profile',
      name: 'UserProfile',
      component: UserProfile // Adicione a nova rota
    }
  ]
});