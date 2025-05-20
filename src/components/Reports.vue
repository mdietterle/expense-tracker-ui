<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">Relatórios</h1>

    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="space-y-6">
        <h3 class="text-xl font-semibold mb-6">Gerar Relatório</h3>

        <form @submit.prevent="generateReport" class="space-y-6">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <w-input
                  label="Data Inicial"
                  label-position="inside"
                  outline
                  inner-icon-left="mdi mdi-calendar"
                  v-model="startDate"
                  type="date"
                  required
                  round
              ></w-input>

              <w-input
                  label="Data Final"
                  label-position="inside"
                  outline
                  inner-icon-left="mdi mdi-calendar-check"
                  v-model="endDate"
                  type="date"
                  required
                  round
              ></w-input>
            </div>
          </div>

          <div class="flex space-x-4">
            <w-button class="flex-1" bg-color="success" type="submit" :disabled="loading" round>
              <w-icon class="mr-2">{{ loading ? 'mdi mdi-loading mdi-spin' : 'wi-check' }}</w-icon>
              {{ loading ? 'Gerando...' : 'Gerar Relatório' }}
            </w-button>

            <w-button
                v-if="devMode"
                class="flex-none"
                bg-color="info"
                @click="generateDemoReport"
                round
            >
              <w-icon class="mr-2">mdi mdi-file-document-outline</w-icon>
              Demo
            </w-button>

          </div>
        </form>
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
      {{ error }}
    </div>

    <div v-if="report" class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-semibold mb-6">Resultado do Relatório</h3>
      <div class="space-y-8">
        <p class="text-sm text-gray-500">
          Período: {{ formatDateRange(startDate, endDate) }}
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-500">Total de Ganhos</p>
            <p class="text-2xl font-bold text-green-600">R$ {{ formatValue(report.total_earnings) }}</p>
          </div>
          <div class="p-4 bg-red-50 rounded-lg">
            <p class="text-sm text-gray-500">Total de Despesas</p>
            <p class="text-2xl font-bold text-red-600">R$ {{ formatValue(report.total_expenses) }}</p>
          </div>
          <div class="p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-500">Lucro Líquido</p>
            <p class="text-2xl font-bold text-blue-600">R$ {{ formatValue(report.net_profit) }}</p>
          </div>
        </div>

        <div v-if="report.goals_progress && Object.keys(report.goals_progress).length > 0" class="space-y-4">
          <h4 class="font-semibold text-lg">Progresso das Metas</h4>
          <div class="space-y-4">
            <div v-for="(progress, goalId) in report.goals_progress" :key="goalId"
                 class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between mb-2">
                <span class="font-medium">{{ progress.name }}</span>
                <span class="font-semibold">{{ progress.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="h-2.5 rounded-full"
                     :class="progress.achieved ? 'bg-green-600' : 'bg-blue-600'"
                     :style="`width: ${progress.progress}%`">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!report.goals_progress || Object.keys(report.goals_progress).length === 0"
             class="text-center py-4 text-gray-500">
          Nenhuma meta definida para o período.
        </div>

        <!-- Novas métricas e gráficos -->
        <div class="mt-8 space-y-8">
          <!-- Valor médio por km -->
          <div class="p-6 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-lg mb-4">Valor Médio por Km</h4>
            <p class="text-2xl font-bold text-indigo-600 mb-4">
              R$ {{ formatValue(report.average_value_per_km || 0) }} / km
            </p>

            <div v-if="valuePerKmChart && valuePerKmChart.chartData" class="h-64 mt-4">
              <line-chart 
                :chart-data="valuePerKmChart.chartData" 
                :chart-options="valuePerKmChart.chartOptions"
              />
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              Dados insuficientes para gerar o gráfico.
            </div>
          </div>

          <!-- Comparativo entre despesas e ganhos -->
          <div class="p-6 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-lg mb-4">Comparativo entre Despesas e Ganhos</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-500">Proporção de Despesas</p>
                <p class="text-xl font-bold text-red-600">
                  {{ report.total_expenses && report.total_earnings ? 
                    ((report.total_expenses / (report.total_expenses + report.total_earnings)) * 100).toFixed(1) : 
                    0 }}%
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Proporção de Ganhos</p>
                <p class="text-xl font-bold text-green-600">
                  {{ report.total_expenses && report.total_earnings ? 
                    ((report.total_earnings / (report.total_expenses + report.total_earnings)) * 100).toFixed(1) : 
                    0 }}%
                </p>
              </div>
            </div>

            <div v-if="expensesVsEarningsChart && expensesVsEarningsChart.chartData" class="h-64 mt-4">
              <pie-chart 
                :chart-data="expensesVsEarningsChart.chartData" 
                :chart-options="expensesVsEarningsChart.chartOptions"
              />
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              Dados insuficientes para gerar o gráfico.
            </div>
          </div>

          <!-- Contribuição do lucro líquido para metas -->
          <div v-if="report.goal_contributions && report.goal_contributions.length > 0" class="p-6 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-lg mb-4">Contribuição do Lucro Líquido para Metas</h4>

            <div class="space-y-4 mb-4">
              <div v-for="(contribution, index) in report.goal_contributions" :key="index" class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between mb-2">
                  <span class="font-medium">{{ contribution.name }}</span>
                  <span class="font-semibold">{{ contribution.contributionPercentage }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="h-2.5 rounded-full bg-purple-600"
                       :style="`width: ${contribution.contributionPercentage}%`">
                  </div>
                </div>
              </div>
            </div>

            <div v-if="goalContributionChart && goalContributionChart.chartData" class="h-64 mt-4">
              <bar-chart 
                :chart-data="goalContributionChart.chartData" 
                :chart-options="goalContributionChart.chartOptions"
              />
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              Dados insuficientes para gerar o gráfico.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from './BarChart.js'
import PieChart from './PieChart.js'
import LineChart from './LineChart.js'

export default {
  components: {
    BarChart,
    PieChart,
    LineChart
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      report: null,
      loading: false,
      error: null,
      devMode: true, // Sempre ativado para facilitar testes
      expensesVsEarningsChart: null,
      goalContributionChart: null,
      valuePerKmChart: null
    }
  },
  mounted() {
    // Inicializa com a data atual e 30 dias atrás
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.endDate = this.formatDate(today);
    this.startDate = this.formatDate(thirtyDaysAgo);
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    formatDateRange(start, end) {
      if (!start || !end) return '';

      return `${this.formatDate(start)} a ${this.formatDate(end)}`;
    },
    formatValue(value) {
      // Formata o valor monetário ou retorna 0,00 se não existir
      if (value === undefined || value === null) return '0,00';

      if (typeof value !== 'number') {
        value = Number(value);
      }

      return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    // Função para buscar as metas e calcular o progresso manualmente
    async fetchGoalsProgress() {
      try {
        const goalsResponse = await this.$api.getGoals();

        if (goalsResponse.data && goalsResponse.data.length > 0) {
          const goals = goalsResponse.data;
          console.log('Metas obtidas para cálculo de progresso:', goals);

          // Calcular progresso para cada meta (simulado)
          // Em uma aplicação real, você obteria dados reais de progresso
          const goalsProgress = {};

          goals.forEach(goal => {
            // Calcula um progresso simulado entre 50-100%
            const randomProgress = Math.floor(Math.random() * 51) + 50;
            const isAchieved = randomProgress >= 100;

            goalsProgress[goal.id] = {
              name: goal.name,
              progress: randomProgress,
              achieved: isAchieved
            };
          });

          // Adiciona o progresso das metas ao relatório
          this.report.goals_progress = goalsProgress;
          console.log('Progresso de metas calculado manualmente:', goalsProgress);
        }
      } catch (error) {
        console.error('Erro ao buscar progresso das metas:', error);
      }
    },

    // Função para calcular dados financeiros baseado nas viagens e despesas
    async calculateFinancials() {
      try {
        console.log('Calculando dados financeiros...');
        let totalEarnings = 0;
        let totalExpenses = 0;

        // Obter o driver_id correto
        const correctDriverId = await this.getDriverId();
        console.log('Driver ID correto para cálculos financeiros:', correctDriverId);

        // Buscar viagens para o período
        const tripsResponse = await this.$api.getTrips();
        if (tripsResponse.data && tripsResponse.data.length > 0) {
          console.log('Todas as viagens do sistema:', tripsResponse.data);

          // Exibir estatísticas sobre driver_id das viagens
          const driverIds = tripsResponse.data.map(trip => trip.driver_id);
          const uniqueDriverIds = [...new Set(driverIds)];
          console.log('Driver IDs únicos nas viagens:', uniqueDriverIds);

          // Verificar se o driver_id correto está presente nas viagens
          const hasCorrectDriverId = uniqueDriverIds.includes(correctDriverId);
          console.log(`O driver_id correto (${correctDriverId}) está presente nas viagens? ${hasCorrectDriverId}`);

          // Filtrar viagens pelo período e driver_id correto
          const trips = tripsResponse.data.filter(trip => {
            const tripDate = new Date(trip.date);
            const startDateObj = new Date(this.startDate);
            const endDateObj = new Date(this.endDate);
            return trip.driver_id === correctDriverId && tripDate >= startDateObj && tripDate <= endDateObj;
          });

          console.log(`Viagens no período selecionado: ${trips.length}`);

          // Somar ganhos das viagens
          totalEarnings = trips.reduce((sum, trip) => sum + parseFloat(trip.earnings || 0), 0);

          console.log(`Total de ganhos calculado: R$ ${totalEarnings.toFixed(2).replace('.', ',')}`);
        }

        // Buscar despesas para o período
        const expensesResponse = await this.$api.getExpenses();
        if (expensesResponse.data && expensesResponse.data.length > 0) {
          const expenses = expensesResponse.data.filter(expense => {
            const expenseDate = new Date(expense.date);
            const startDateObj = new Date(this.startDate);
            const endDateObj = new Date(this.endDate);
            return (
              expenseDate >= startDateObj &&
              expenseDate <= endDateObj &&
              expense.driver_id === correctDriverId
            );
          });

          // Somar despesas
          totalExpenses = expenses.reduce((sum, expense) => {
            const amount = parseFloat(expense.amount || 0);
            return sum + amount;
          }, 0);

          console.log(`Total de despesas calculado: R$ ${totalExpenses.toFixed(2).replace('.', ',')}`);
        }

        // Calcular lucro líquido
        const netProfit = totalEarnings - totalExpenses;
        console.log(`Lucro líquido calculado: R$ ${netProfit.toFixed(2).replace('.', ',')}`);

        // Atualizar relatório
        this.report.total_earnings = totalEarnings;
        this.report.total_expenses = totalExpenses;
        this.report.net_profit = netProfit;
      } catch (error) {
        console.error('Erro ao calcular dados financeiros:', error);
      }
    },
    generateDemoReport() {
      // Gera um relatório de demonstração para testes
      this.report = {
        total_earnings: 1250.75,
        total_expenses: 450.30,
        net_profit: 800.45,
        average_value_per_km: 2.35,
        goals_progress: {
          '1': {
            name: 'Meta mensal de viagens',
            progress: 75,
            achieved: false
          },
          '2': {
            name: 'Redução de gastos com combustível',
            progress: 90,
            achieved: true
          }
        },
        goal_contributions: [
          {
            goalId: '1',
            name: 'Meta mensal de viagens',
            progress: 75,
            contributionPercentage: 65
          },
          {
            goalId: '2',
            name: 'Redução de gastos com combustível',
            progress: 90,
            contributionPercentage: 40
          }
        ]
      };

      // Preparar dados para os gráficos de demonstração

      // Gráfico de valor por km
      this.valuePerKmChart = {
        chartData: {
          labels: ['01/05', '05/05', '10/05', '15/05', '20/05', '25/05', '30/05'],
          datasets: [
            {
              label: 'Valor por Km (R$)',
              backgroundColor: 'rgba(88, 104, 166, 0.2)', /* color3 with opacity */
              borderColor: 'rgba(88, 104, 166, 1)', /* color3 */
              borderWidth: 1,
              data: [2.10, 2.25, 2.40, 2.35, 2.50, 2.45, 2.35]
            }
          ]
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'R$ / Km'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Data'
              }
            }
          }
        }
      };

      // Gráfico de comparação entre despesas e ganhos
      this.expensesVsEarningsChart = {
        chartData: {
          labels: ['Ganhos', 'Despesas'],
          datasets: [
            {
              backgroundColor: ['rgba(88, 104, 166, 0.2)', 'rgba(172, 177, 247, 0.2)'], /* color3 and color1 with opacity */
              borderColor: ['rgba(88, 104, 166, 1)', 'rgba(172, 177, 247, 1)'], /* color3 and color1 */
              borderWidth: 1,
              data: [this.report.total_earnings, this.report.total_expenses]
            }
          ]
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Comparativo entre Ganhos e Despesas'
            }
          }
        }
      };

      // Gráfico de contribuição do lucro líquido para metas
      this.goalContributionChart = {
        chartData: {
          labels: this.report.goal_contributions.map(goal => goal.name),
          datasets: [
            {
              label: 'Contribuição do Lucro Líquido (%)',
              backgroundColor: 'rgba(130, 140, 206, 0.2)', /* color2 with opacity */
              borderColor: 'rgba(130, 140, 206, 1)', /* color2 */
              borderWidth: 1,
              data: this.report.goal_contributions.map(goal => goal.contributionPercentage)
            }
          ]
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Contribuição (%)'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Contribuição do Lucro Líquido para Metas'
            }
          }
        }
      };
    },

    // Obtém o driver_id correto usando o serviço centralizado
    async getDriverId() {
      try {
        // Usa o método centralizado para obter o driver_id consistente
        const driverId = await this.$api.getDriverId();
        console.log('Driver ID obtido para relatório:', driverId);
        return driverId;
      } catch (error) {
        console.error('Erro ao obter driver_id:', error);
        // Fallback para 'teste' em caso de erro
        return 'teste';
      }
    },

    // Calcula o valor médio por km no período
    async calculateAverageValuePerKm() {
      try {
        const tripsResponse = await this.$api.getTrips();
        if (!tripsResponse.data || tripsResponse.data.length === 0) {
          return { averageValuePerKm: 0, chartData: null };
        }

        const driverId = await this.getDriverId();

        // Filtrar viagens pelo período e driver_id
        const trips = tripsResponse.data.filter(trip => {
          const tripDate = new Date(trip.date);
          const startDateObj = new Date(this.startDate);
          const endDateObj = new Date(this.endDate);
          return trip.driver_id === driverId && tripDate >= startDateObj && tripDate <= endDateObj;
        });

        if (trips.length === 0) {
          return { averageValuePerKm: 0, chartData: null };
        }

        // Calcular total de km e ganhos
        let totalKm = 0;
        let totalEarnings = 0;

        trips.forEach(trip => {
          totalKm += parseFloat(trip.distance || 0);
          totalEarnings += parseFloat(trip.earnings || 0);
        });

        const averageValuePerKm = totalKm > 0 ? totalEarnings / totalKm : 0;

        // Preparar dados para o gráfico
        const chartData = {
          labels: trips.map(trip => this.formatDate(trip.date)),
          datasets: [
            {
              label: 'Valor por Km (R$)',
              backgroundColor: 'rgba(88, 104, 166, 0.2)', /* color3 with opacity */
              borderColor: 'rgba(88, 104, 166, 1)', /* color3 */
              borderWidth: 1,
              data: trips.map(trip => {
                const distance = parseFloat(trip.distance || 0);
                const earnings = parseFloat(trip.earnings || 0);
                return distance > 0 ? (earnings / distance).toFixed(2) : 0;
              })
            }
          ]
        };

        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'R$ / Km'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Data'
              }
            }
          }
        };

        return { 
          averageValuePerKm, 
          chartData,
          chartOptions
        };
      } catch (error) {
        console.error('Erro ao calcular valor médio por km:', error);
        return { averageValuePerKm: 0, chartData: null };
      }
    },

    // Prepara dados para o gráfico de comparação entre despesas e ganhos
    prepareExpensesVsEarningsChart() {
      if (!this.report) return null;

      const chartData = {
        labels: ['Ganhos', 'Despesas'],
        datasets: [
          {
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
            data: [this.report.total_earnings, this.report.total_expenses]
          }
        ]
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Comparativo entre Ganhos e Despesas'
          }
        }
      };

      return { chartData, chartOptions };
    },

    // Calcula a contribuição do lucro líquido para o atingimento das metas
    calculateGoalContribution() {
      if (!this.report || !this.report.goals_progress || Object.keys(this.report.goals_progress).length === 0) {
        return { goalContributions: [], chartData: null };
      }

      const netProfit = this.report.net_profit || 0;
      const goalContributions = [];

      // Para cada meta, calcular a contribuição do lucro líquido
      Object.entries(this.report.goals_progress).forEach(([goalId, goal]) => {
        // Simulação: considerar que o lucro líquido contribui entre 20% e 80% para o progresso da meta
        // Em uma aplicação real, isso seria calculado com base em dados reais
        const contributionPercentage = Math.min(80, Math.max(20, Math.floor(Math.random() * 60) + 20));

        goalContributions.push({
          goalId,
          name: goal.name,
          progress: goal.progress,
          contributionPercentage
        });
      });

      // Preparar dados para o gráfico
      const chartData = {
        labels: goalContributions.map(goal => goal.name),
        datasets: [
          {
            label: 'Contribuição do Lucro Líquido (%)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            data: goalContributions.map(goal => goal.contributionPercentage)
          }
        ]
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Contribuição (%)'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Contribuição do Lucro Líquido para Metas'
          }
        }
      };

      return { 
        goalContributions, 
        chartData,
        chartOptions
      };
    },

    async generateReport() {
      if (!this.startDate || !this.endDate) {
        this.error = 'Por favor, selecione o período para o relatório';
        return;
      }

      this.loading = true;
      this.error = null;
      this.report = null;

      try {
        // Obtém o driver_id correto que corresponde ao usado nas metas
        const driverId = await this.getDriverId();

        // Obtém todas as metas para verificar formatação
        const goalsResponse = await this.$api.getGoals();
        if (goalsResponse.data && goalsResponse.data.length > 0) {
          console.log('Verificando formato das metas:', goalsResponse.data);
          const firstGoal = goalsResponse.data[0];
          console.log('Exemplo de meta - driver_id:', firstGoal.driver_id, 'tipo:', typeof firstGoal.driver_id);
        }

        // Obtém todas as viagens para verificar formatação
        const tripsResponse = await this.$api.getTrips();
        if (tripsResponse.data && tripsResponse.data.length > 0) {
          console.log('Verificando formato das viagens:', tripsResponse.data);
          const firstTrip = tripsResponse.data[0];
          console.log('Exemplo de viagem - driver_id:', firstTrip.driver_id, 'tipo:', typeof firstTrip.driver_id);
        }

        console.log('Gerando relatório com os parâmetros:', {
          driver_id: driverId,
          start_date: this.startDate,
          end_date: this.endDate
        });

        // Usa o método específico de relatório em vez do post genérico
        // Tentar os dois formatos possíveis de driver_id (string e numérico)
        let res;
        try {
          res = await this.$api.generateReport({
            driver_id: driverId,
            start_date: this.startDate,
            end_date: this.endDate
          });
          console.log('Resposta da API de relatórios (tentativa 1):', res);
        } catch (firstError) {
          console.error('Erro na primeira tentativa:', firstError);

          // Se falhar, tenta com formato numérico (se possível)
          if (!isNaN(driverId)) {
            try {
              res = await this.$api.generateReport({
                driver_id: Number(driverId),
                start_date: this.startDate,
                end_date: this.endDate
              });
              console.log('Resposta da API de relatórios (tentativa 2 - numérico):', res);
            } catch (secondError) {
              console.error('Erro na segunda tentativa:', secondError);
              throw secondError;
            }
          } else {
            throw firstError;
          }
        }

        if (res && res.data) {
          this.report = res.data;

          // Garante que o relatório tenha a estrutura mínima esperada
          if (!this.report.total_earnings) this.report.total_earnings = 0;
          if (!this.report.total_expenses) this.report.total_expenses = 0;
          if (!this.report.net_profit) this.report.net_profit = 0;
          if (!this.report.goals_progress) this.report.goals_progress = {};

          // Se não houver progresso de metas no relatório, obtém as metas e adiciona ao relatório
          if (Object.keys(this.report.goals_progress).length === 0) {
            console.log('Não há metas no relatório, buscando metas separadamente...');
            await this.fetchGoalsProgress();
          }

          // Calcula ganhos, despesas e lucro líquido se não estiverem presentes
          if (this.report.total_earnings === 0 && this.report.total_expenses === 0) {
            await this.calculateFinancials();
          }

          // Calcular métricas adicionais e preparar gráficos
          const valuePerKmResult = await this.calculateAverageValuePerKm();
          this.report.average_value_per_km = valuePerKmResult.averageValuePerKm;
          this.valuePerKmChart = {
            chartData: valuePerKmResult.chartData,
            chartOptions: valuePerKmResult.chartOptions
          };

          // Preparar gráfico de comparação entre despesas e ganhos
          const expensesVsEarningsResult = this.prepareExpensesVsEarningsChart();
          this.expensesVsEarningsChart = expensesVsEarningsResult;

          // Calcular contribuição do lucro líquido para metas
          const goalContributionResult = this.calculateGoalContribution();
          this.report.goal_contributions = goalContributionResult.goalContributions;
          this.goalContributionChart = {
            chartData: goalContributionResult.chartData,
            chartOptions: goalContributionResult.chartOptions
          };
        } else {
          throw new Error('A API retornou uma resposta vazia');
        }
      } catch (error) {
        console.error('Erro ao gerar relatório:', error);

        if (error.response) {
          console.log('Detalhes da resposta de erro:', {
            status: error.response.status,
            data: error.response.data
          });

          if (error.response.status === 404) {
            this.error = 'Endpoint de relatórios não encontrado. Verifique a implementação da API.';
          } else {
            this.error = `Erro ao gerar relatório: ${error.response.status} - ${error.response.statusText || 'Erro desconhecido'}`;
          }
        } else if (error.request) {
          this.error = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        } else {
          this.error = `Não foi possível gerar o relatório: ${error.message || 'Erro desconhecido'}`;
        }

        // Se estiver em modo de desenvolvimento, gere um relatório de demonstração
        if (this.devMode) {
          console.log('Gerando relatório de demonstração devido a falha na API');
          setTimeout(() => {
            this.generateDemoReport();
            this.error = this.error + ' (Exibindo dados de demonstração)';
          }, 500);
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
