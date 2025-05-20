<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">Login</h1>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="space-y-6">
        <h3 class="text-xl font-semibold mb-6">Acesso ao Sistema</h3>

        <form @submit.prevent="login" class="space-y-6">
          <div class="space-y-4">
            <w-input
                label="Usuário"
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
            <w-icon class="mr-2">mdi mdi-login</w-icon>
            Entrar
          </w-button>

          <div class="text-center pt-4">
            <p class="text-gray-600">
              Não tem conta?
              <router-link to="/register" class="text-success-500 hover:text-success-600 font-medium">
                Cadastre-se
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
    async login() {
      try {
        console.log('Tentando login com:', this.form);
        const res = await this.$api.login(this.form);

        if (res.data && res.data.access_token && res.data.user_id) {
          console.log('Login bem-sucedido:', res.data);
          localStorage.setItem('token', res.data.access_token);
          localStorage.setItem('user_id', String(res.data.user_id));
          localStorage.setItem('username', this.form.username);
          this.$router.push('/');
        } else {
          console.error('Resposta inesperada do servidor:', res.data);
          alert('Credenciais inválidas ou resposta do servidor incorreta.');
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        if (error.response?.data?.message) {
          alert(`Erro: ${error.response.data.message}`);
        } else if (error.message?.includes('Network Error')) {
          alert('Erro de conexão com o servidor. Verifique se o backend está em execução.');
        } else {
          alert('Erro ao fazer login. Verifique suas credenciais.');
        }
      }
    }
  }
}
</script>