<template>
  <div class="container mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-semibold mb-4">Editar Perfil</h3>
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário</label>
          <input 
            id="username"
            v-model="profile.username" 
            type="text" 
            readonly
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div v-if="changePassword">
          <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
          <input 
            id="newPassword"
            v-model="profile.newPassword" 
            type="password" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div class="flex items-center">
          <HSwitch 
            v-model="changePassword" 
            :class="changePassword ? 'bg-blue-600' : 'bg-gray-200'"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
          >
            <span class="sr-only">Alterar senha?</span>
            <span
              :class="changePassword ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition"
            />
          </HSwitch>
          <span class="ml-2 text-sm text-gray-700">Alterar senha?</span>
        </div>

        <button 
          type="submit" 
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: {
        username: '',
        newPassword: ''
      },
      changePassword: false
    }
  },
  mounted() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const res = await this.$api.getUserProfile()
        this.profile.username = res.data.username
      } catch (error) {
        console.error('Erro ao buscar perfil:', error)
        // Use username from localStorage as fallback
        this.profile.username = localStorage.getItem('username') || 'Usuário'
      }
    },
    async updateProfile() {
      try {
        if (this.changePassword) {
          await this.$api.updateUserProfile({
            password: this.profile.newPassword
          })
          alert("Perfil atualizado com sucesso!")
        }
        this.$router.push('/')
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error)

        // Check if it's a 404 error (endpoint not found)
        if (error.response && error.response.status === 404) {
          alert("Não foi possível atualizar o perfil. O endpoint não está disponível.")
        } else if (error.message) {
          // Display the error message from the API service
          alert(error.message)
        } else {
          alert("Erro ao atualizar o perfil. Por favor, tente novamente.")
        }
      }
    }
  }
}
</script>
