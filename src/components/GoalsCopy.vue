<template>
  <div class="container mx-auto px-4 py-6">
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">Nova Meta Financeira</h3>
      <form @submit.prevent="submitGoal" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome da Meta</label>
          <input
              id="name"
              v-model="goal.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="target_amount" class="block text-sm font-medium text-gray-700 mb-1">Valor Alvo (R$)</label>
          <input
              id="target_amount"
              v-model="goal.target_amount"
              type="number"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="deadline" class="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
          <input
              id="deadline"
              v-model="goal.deadline"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Criar Meta
        </button>
      </form>
    </div>

    <div class="bg-white rounded-lg shadow-md">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Metas Atuais</h2>
      </div>
      <ul class="divide-y divide-gray-200">
        <li v-for="goal in goals" :key="goal.id" class="px-6 py-4">
          <div class="mb-1">
            <div class="text-sm font-medium text-gray-900">{{ goal.name }} - R$ {{ goal.target_amount }}</div>
            <div class="text-sm text-gray-500">Prazo: {{ goal.deadline }} - Progresso: {{ calculateProgress(goal) }}%</div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
                class="h-4 rounded-full"
                :class="calculateProgress(goal) >= 100 ? 'bg-green-600' : 'bg-blue-600'"
                :style="{ width: `${calculateProgress(goal)}%` }"
            ></div>
          </div>
        </li>
      </ul>
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
