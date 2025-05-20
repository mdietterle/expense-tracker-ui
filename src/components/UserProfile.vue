<template>
  <div :class="[
    'max-w-2xl mx-auto p-6 rounded-lg shadow-lg',
    isDarkMode ? 'bg-gray-800' : 'bg-white'
  ]">
    <h2 class="text-2xl font-bold mb-6">Meu Perfil</h2>

    <form @submit.prevent="updateProfile" class="space-y-6">
      <!-- Foto do perfil -->
      <div class="flex items-center space-x-4">
        <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          <img
              v-if="profile.profile_picture"
              :src="profile.profile_picture"
              alt="Foto de perfil"
              class="w-full h-full object-cover"
          >
          <div v-else class="w-full h-full flex items-center justify-center">
            <w-icon class="text-4xl text-gray-400">mdi mdi-account</w-icon>
          </div>
        </div>
        <input
            type="text"
            v-model="profile.profile_picture"
            placeholder="URL da foto de perfil"
            class="flex-1 p-2 border rounded"
        >
      </div>

      <!-- Username -->
      <div>
        <label class="block mb-2">Nome de usuário</label>
        <input
            type="text"
            v-model="profile.username"
            required
            class="w-full p-2 border rounded"
        >
      </div>

      <!-- Email -->
      <div>
        <label class="block mb-2">Email</label>
        <input
            type="email"
            v-model="profile.email"
            required
            class="w-full p-2 border rounded"
        >
      </div>

      <!-- Botões -->
      <div class="flex justify-end space-x-4">
        <w-button type="submit" color="primary">
          Salvar Alterações
        </w-button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      profile: {
        username: '',
        email: '',
        profile_picture: ''
      }
    }
  },
  async created() {
    await this.loadProfile()
  },
  methods: {
    async loadProfile() {
      try {
        const response = await this.$api.get('/api/users/me')
        this.profile = response.data
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
        this.$emit('show-notification', {
          type: 'error',
          message: 'Erro ao carregar perfil'
        })
      }
    },
    async updateProfile() {
      try {
        const response = await this.$api.put('/api/users/me', this.profile)
        this.profile = response.data
        this.$emit('show-notification', {
          type: 'success',
          message: 'Perfil atualizado com sucesso'
        })
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error)
        this.$emit('show-notification', {
          type: 'error',
          message: 'Erro ao atualizar perfil'
        })
      }
    }
  }
}
</script>