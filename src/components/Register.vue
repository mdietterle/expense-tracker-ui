<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">Cadastro</h1>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="space-y-6">
        <h3 class="text-xl font-semibold mb-6">Criar Nova Conta</h3>

        <form @submit.prevent="register" class="space-y-6">
          <div class="space-y-4">
            <w-input
                label="Nome de Usuário"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-account"
                v-model="form.username"
                type="text"
                required
                round
            ></w-input>

            <w-input
                label="Senha"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-lock"
                v-model="form.password"
                type="password"
                required
                round
            ></w-input>
          </div>

          <w-button class="w-full" bg-color="success" type="submit" round>
            <w-icon class="mr-2">wi-check</w-icon>
            Criar Conta
          </w-button>

          <div class="text-center pt-4">
            <p class="text-gray-600">
              Já tem conta?
              <router-link to="/login" class="text-success-500 hover:text-success-600 font-medium">
                Faça login
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async register() {
      if (!this.form.username || !this.form.password) {
        alert("Por favor, preencha todos os campos.")
        return
      }
      try {
        const response = await this.$api.register(this.form)

        if (response.data && response.data.access_token) {
          localStorage.setItem('token', response.data.access_token)
          localStorage.setItem('username', this.form.username)
          this.$router.push('/')
        } else {
          alert("Cadastro realizado com sucesso! Por favor, faça login.")
          this.$router.push('/login')
        }
      } catch (error) {
        console.error('Erro ao cadastrar:', error)

        if (error.response?.data?.message) {
          alert(`Erro: ${error.response.data.message}`)
        } else if (error.message?.includes('Network Error')) {
          alert("Erro de conexão com o servidor. Verifique se o backend está em execução.")
        } else {
          alert("Erro ao cadastrar. Por favor, tente novamente.")
        }
      }
    }
  }
}
</script>