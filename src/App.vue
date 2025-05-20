<template>
  <div id="app" :class="[
    'min-h-screen transition-colors duration-300',
    isDarkMode ? 'dark bg-gray-900' : 'bg-primary-100/10'
  ]">
    <!-- Layout para usuários autenticados -->
    <div v-if="isLoggedIn" class="min-h-screen">
      <!-- Barra superior -->
      <div :class="[
        'shadow-md transition-colors duration-300',
        isDarkMode ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-500'
      ]">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <!-- Logo/Título -->
            <div class="text-xl font-semibold">
              Controle Financeiro
            </div>

            <!-- Controles à direita -->
            <div class="flex items-center space-x-4">
              <!-- Botão de alternar tema -->
              <button 
                @click="toggleDarkMode" 
                class="p-2 rounded-full hover:bg-opacity-20 hover:bg-black"
                :title="isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'"
              >
                <w-icon v-if="isDarkMode">mdi mdi-white-balance-sunny</w-icon>
                <w-icon v-else>mdi mdi-moon-waning-crescent</w-icon>
              </button>

              <!-- Menu do usuário -->
              <div class="relative">
                <button @click="toggleMenu" class="flex items-center space-x-2">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    isDarkMode ? 'bg-primary-400' : 'bg-primary-200'
                  ]">
                    <w-icon :class="isDarkMode ? 'text-white' : 'text-primary-500'">mdi mdi-account</w-icon>
                  </div>
                </button>

                <!-- Menu dropdown -->
                <div v-if="showMenu"
                    :class="[
                      'absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 transition-colors duration-300',
                      isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
                    ]">
                  <router-link
                      v-for="item in menuItems"
                      :key="item.path"
                      :to="item.path"
                      :class="[
                        'block px-4 py-2 text-sm',
                        isDarkMode 
                          ? 'hover:bg-gray-700' + ($route.path === item.path ? ' bg-gray-700' : '')
                          : 'hover:bg-primary-100/30' + ($route.path === item.path ? ' bg-primary-100/30' : '')
                      ]"
                      @click="showMenu = false"
                  >
                    <div class="flex items-center space-x-3">
                      <w-icon class="w-5 h-5 flex-shrink-0">{{ item.icon }}</w-icon>
                      <span>{{ item.label }}</span>
                    </div>
                  </router-link>

                  <div :class="isDarkMode ? 'border-gray-700' : 'border-gray-100'" class="border-t my-1"></div>

                  <a href="#"
                    @click.prevent="logout"
                    :class="[
                      'block px-4 py-2 text-sm text-red-600',
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-primary-100/30'
                    ]"
                  >
                    <div class="flex items-center space-x-3">
                      <w-icon class="w-5 h-5 flex-shrink-0">mdi mdi-logout</w-icon>
                      <span>Sair</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Área principal do conteúdo -->
      <div class="max-w-7xl mx-auto">
        <div class="p-6">
          <router-view></router-view>
        </div>
      </div>
    </div>

    <!-- Layout para usuários não autenticados -->
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      showMenu: false,
      isDarkMode: false,
      menuItems: [
        { path: '/', label: 'Dashboard', icon: 'mdi mdi-view-dashboard' },
        { path: '/trips', label: 'Viagens', icon: 'mdi mdi-car' },
        { path: '/expenses', label: 'Despesas', icon: 'mdi mdi-cash-multiple' },
        { path: '/goals', label: 'Metas', icon: 'mdi mdi-target' },
        { path: '/reports', label: 'Relatórios', icon: 'mdi mdi-chart-bar' },
        { path: '/profile', label: 'Meu Perfil', icon: 'mdi mdi-account-circle' }
      ]
    }
  },
  created() {
    this.checkAuthStatus()
    this.loadThemePreference()
    window.addEventListener('storage', this.checkAuthStatus)
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.checkAuthStatus)
    document.removeEventListener('click', this.handleClickOutside)
  },
  watch: {
    '$route': 'checkAuthStatus',
    isDarkMode: {
      handler(newValue) {
        // Atualiza a classe 'dark' no elemento HTML para ativar os estilos do modo escuro
        if (newValue) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        // Salva a preferência do usuário
        localStorage.setItem('darkMode', newValue ? 'true' : 'false')
      },
      immediate: true
    }
  },
  methods: {
    checkAuthStatus() {
      const token = localStorage.getItem('token')
      this.isLoggedIn = !!token
    },
    loadThemePreference() {
      // Carrega a preferência de tema do localStorage
      const darkMode = localStorage.getItem('darkMode')
      this.isDarkMode = darkMode === 'true'

      // Aplica o tema inicial
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    handleClickOutside(event) {
      const menuElement = this.$el.querySelector('.relative')
      if (menuElement && !menuElement.contains(event.target)) {
        this.showMenu = false
      }
    },
    async logout() {
      try {
        // Limpa todos os dados de autenticação do localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('username')
        localStorage.removeItem('driver_id')

        // Fecha o menu dropdown
        this.showMenu = false

        // Atualiza o estado de autenticação
        this.isLoggedIn = false

        // Redireciona para a página de login
        this.$router.push('/login')
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      }
    }
  }
}
</script>

<style>
/* Estilos para o modo claro */
.router-link-active {
  @apply bg-primary-100/30;
}

/* Estilos para o modo escuro */
.dark .router-link-active {
  @apply bg-gray-700;
}

/* Transições suaves para mudanças de tema */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
