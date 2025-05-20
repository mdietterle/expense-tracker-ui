<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">Metas Financeiras</h1>

    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="space-y-6">
        <h3 class="text-xl font-semibold mb-6">Nova Meta Financeira</h3>
        <form @submit.prevent="submitGoal" class="space-y-6">
          <div class="space-y-4">
            <w-input
                label="Nome da Meta"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-bullseye-arrow"
                v-model="goal.name"
                required
                round
            ></w-input>

            <w-input
                label="Valor"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-currency-usd"
                v-model="goal.target_amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                round
            ></w-input>

            <w-input
                label="Data Limite"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-calendar-clock-outline"
                required
                v-model="goal.deadline"
                type="date"
                round
            ></w-input>
          </div>

          <w-button class="w-full" bg-color="success" type="submit" round>
            <w-icon class="mr-2">wi-check</w-icon>
            Salvar Meta
          </w-button>
        </form>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-8">
      <div class="space-y-10">
        <h3 class="text-xl font-semibold mb-10">Metas Registradas</h3>
        <div class="mb-8">
          <ul class="divide-y divide-gray-200">
            <li v-for="goal in goals" :key="goal.id" class="py-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ goal.name }}</h4>
                  <div class="text-sm text-gray-600 space-y-1">
                    <p>Meta: R$ {{ formatNumberBR(goal.target_amount) }}</p>
                    <p>Atual: R$ {{ formatNumberBR(goal.current_amount) }}</p>
                    <p>Prazo: {{ formatDate(goal.deadline) }}</p>
                  </div>
                </div>
                <div class="ml-4">
                  <w-progress
                      :value="calculateProgress(goal)"
                      :color="getProgressColor(goal)"
                      radius="full"
                      size="6em"
                  >
                    <strong>{{ calculateProgress(goal).toFixed(1) }}%</strong>
                  </w-progress>
                </div>
              </div>
            </li>
          </ul>

          <div v-if="goals.length === 0" class="text-center py-4 text-gray-500">
            Nenhuma meta encontrada
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goal: {
        name: '',
        target_amount: 0,
        deadline: '',
        driver_id: 'teste'
      },
      goals: []
    }
  },
  mounted() {
    this.fetchGoals()
  },
  methods: {
    getProgressColor(goal) {
      const progress = this.calculateProgress(goal);
      if (progress >= 100) return 'green';
      if (progress >= 75) return 'success';
      if (progress >= 50) return 'info';
      if (progress >= 25) return 'warning';
      return 'error';
    },
    // Adicione dentro do objeto methods
    formatNumberBR(value) {
      if (!value) return "0,00";
      if (typeof value !== 'number') {
        value = Number(value);
      }
      return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    async fetchGoals() {
      try {
        // Check if user is authenticated
        if (!this.$api.isAuthenticated()) {
          console.log('User is not authenticated, not fetching goals');
          this.goals = [];
          return;
        }

        console.log('Fetching goals...');
        const res = await this.$api.getGoals();
        console.log('Goals fetched successfully:', res.data);
        this.goals = res.data;
      } catch (error) {
        console.error('Erro ao buscar metas:', error);
        if (error.response && error.response.status === 401) {
          console.log('Authentication error while fetching goals');
          this.goals = [];
        }
      }
    },
    async submitGoal() {
      try {
        console.log('Submitting goal:', this.goal);

        // Check if user is authenticated
        if (!this.$api.isAuthenticated()) {
          console.error('User is not authenticated');
          alert('Você precisa estar logado para criar uma meta.');
          this.$router.push('/login');
          return;
        }

        // Validate token with server
        const isValid = await this.$api.validateToken();
        if (!isValid) {
          console.error('Token is invalid or expired');
          alert('Sua sessão expirou. Por favor, faça login novamente.');
          localStorage.removeItem('token');
          this.$router.push('/login');
          return;
        }

        // Validação básica antes do envio
        if (!this.goal.name || this.goal.target_amount <= 0 || !this.goal.deadline) {
          alert('Por favor, preencha todos os campos obrigatórios.');
          return;
        }

        // Garante que os tipos de dados estejam corretos
        console.log('Original deadline value:', this.goal.deadline, 'type:', typeof this.goal.deadline);

        // Simplificar o tratamento da data - usar o valor original como string
        // O input type="date" já retorna no formato YYYY-MM-DD
        const deadlineFormatted = this.goal.deadline ? String(this.goal.deadline) : '';
        console.log('Simplified formatted deadline:', deadlineFormatted);

        // Criar um novo objeto para o payload, sem incluir a propriedade deadline original
        const { deadline, ...goalWithoutDeadline } = this.goal;

        const payload = {
          ...goalWithoutDeadline,
          target_amount: parseFloat(this.goal.target_amount), // Garantir formato float
          current_amount: 0, // Adicionar valor inicial
          deadline: deadlineFormatted // Data formatada como string
        };

        console.log('Token is valid, proceeding with request');
        console.log('Token in localStorage:', localStorage.getItem('token'));
        console.log('Payload enviado:', payload);

        const response = await this.$api.createGoal(payload);
        console.log('Goal created successfully:', response);
        this.goal = { name: '', target_amount: 0, deadline: '', driver_id: 'teste' };
        this.fetchGoals();
        alert('Meta criada com sucesso!');
      } catch (error) {
        console.error('Erro ao criar meta:', error);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);

          // Tratamento específico para erro 422 (Unprocessable Entity)
          if (error.response.status === 422) {
            const validationErrors = error.response.data.detail || [];
            let errorMessage = 'Erro de validação:\n';

            if (Array.isArray(validationErrors)) {
              validationErrors.forEach(err => {
                errorMessage += `- ${err.loc.join('.')}: ${err.msg}\n`;
              });
            } else {
              errorMessage += JSON.stringify(error.response.data);
            }

            alert(errorMessage);
            return;
          }
        }

        if (error.response && error.response.status === 401) {
          alert('Você precisa estar logado para criar uma meta.');
          this.$router.push('/login');
        } else {
          alert('Erro ao criar meta. Verifique o console para mais detalhes.');
        }
      }
    },
    calculateProgress(goal) {
      return Math.min((goal.current_amount / goal.target_amount) * 100, 100)
    }
  }
}
</script>
