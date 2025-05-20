<template>
            <div class="max-w-3xl mx-auto px-4 py-8">
              <h1 class="text-2xl font-bold mb-8">Dashboard</h1>

              <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 class="text-xl font-semibold mb-6">Resumo Financeiro</h3>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="p-4 bg-blue-50 rounded-lg">
                    <p class="text-sm text-gray-500">Ganhos Totais</p>
                    <p class="text-2xl font-bold text-blue-600">R$ {{ formatNumberBR(totalEarnings) }}</p>
                    <w-icon class="mt-2 text-blue-600">mdi mdi-currency-usd</w-icon>
                  </div>

                  <div class="p-4 bg-red-50 rounded-lg">
                    <p class="text-sm text-gray-500">Despesas Totais</p>
                    <p class="text-2xl font-bold text-red-600">R$ {{ formatNumberBR(totalExpenses) }}</p>
                    <w-icon class="mt-2 text-red-600">mdi mdi-credit-card</w-icon>
                  </div>

                  <div class="p-4 bg-green-50 rounded-lg">
                    <p class="text-sm text-gray-500">Lucro Líquido</p>
                    <p class="text-2xl font-bold text-green-600">R$ {{ formatNumberBR(netProfit) }}</p>
                    <w-icon class="mt-2 text-green-600">mdi mdi-bank</w-icon>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-xl font-semibold mb-6">Progresso das Metas</h3>
                <div class="space-y-4">
                  <div v-for="goal in goals" :key="goal.id" class="border border-gray-200 rounded-lg p-4">
                    <div class="flex justify-between mb-2">
                      <span class="font-medium">{{ goal.name }}</span>
                      <span class="font-semibold">{{ Math.round(calculateProgress(goal)) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div class="h-2.5 rounded-full"
                           :class="calculateProgress(goal) >= 100 ? 'bg-green-600' : 'bg-blue-600'"
                           :style="`width: ${calculateProgress(goal)}%`">
                      </div>
                    </div>
                  </div>

                  <div v-if="goals.length === 0" class="text-center py-4 text-gray-500">
                    Nenhuma meta encontrada
                  </div>
                </div>
              </div>

              <!-- Gráficos -->
              <div class="grid grid-cols-1 gap-8 mt-8">
                <!-- Gráfico por Data -->
                <div class="bg-white rounded-lg shadow-md p-6">
                  <h3 class="text-xl font-semibold mb-6">Faturamento por Data</h3>
                  <div class="h-64">
                    <BarChart
                      v-if="earningsByDate.labels.length"
                      :chart-data="earningsByDate"
                      :chart-options="chartOptions"
                    />
                  </div>
                </div>

                <!-- Gráfico por Plataforma -->
                <div class="bg-white rounded-lg shadow-md p-6">
                  <h3 class="text-xl font-semibold mb-6">Faturamento por Plataforma</h3>
                  <div class="h-64">
                    <BarChart
                        v-if="earningsByPlatform.labels.length"
                        :chart-data="earningsByPlatform"
                        :chart-options="platformChartOptions"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <script>
          import BarChart from './BarChart'

          export default {
            components: {
              BarChart
            },
            data() {
              return {
                totalEarnings: 0,
                totalExpenses: 0,
                netProfit: 0,
                goals: [],
                earningsByDate: {
                  labels: [],
                  datasets: []
                },
                earningsByPlatform: {
                  labels: [],
                  datasets: []
                },
                chartOptions: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      stacked: true,
                      ticks: {
                        callback: function(value) {
                          return 'R$ ' + value.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        }
                      }
                    },
                    x: {
                      stacked: true
                    }
                  }
                },
                platformChartOptions: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false // Remove a legenda do gráfico de plataformas
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return 'R$ ' + value.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })
                        }
                      }
                    }
                  }
                }
              }
            },
            mounted() {
              this.fetchData()
            },
            methods: {
              formatDate(date) {
                return new Date(date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
              },
              formatNumberBR(value) {
                if (typeof value !== 'number') {
                  value = Number(value)
                }
                return value.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              },
              async fetchData() {
                try {
                  const [earningsRes, expensesRes, goalsRes] = await Promise.all([
                    this.$api.getTrips(),
                    this.$api.getExpenses(),
                    this.$api.getGoals()
                  ])

                  this.totalEarnings = earningsRes.data.reduce((sum, trip) => sum + Number(trip.earnings), 0)
                  this.totalExpenses = expensesRes.data.reduce((sum, expense) => sum + Number(expense.amount), 0)
                  this.netProfit = this.totalEarnings - this.totalExpenses
                  this.goals = goalsRes.data.map(goal => ({
                    ...goal,
                    current_amount: Number(goal.current_amount),
                    target_amount: Number(goal.target_amount)
                  }))
                  this.processChartData(earningsRes.data)
                } catch (error) {
                  console.error('Erro ao buscar dados:', error)
                }
              },
              calculateProgress(goal) {
                const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100
                return Math.min(progress, 100)
              },
              processChartData(trips) {
                const sortedTrips = [...trips].sort((a, b) => new Date(a.date) - new Date(b.date))

                // Cores por plataforma usando a nova paleta de cores
                const platformColors = {
                  'Uber': '#5868a6',    // color3
                  '99': '#031f55',      // color5
                  'Lift': '#828cce',    // color2
                  'Bolt': '#acb1f7'     // color1
                }

                const byDate = sortedTrips.reduce((acc, trip) => {
                  const date = this.formatDate(trip.date)
                  if (!acc[date]) {
                    acc[date] = {}
                  }
                  acc[date][trip.platform] = (acc[date][trip.platform] || 0) + Number(trip.earnings)
                  return acc
                }, {})

                const platforms = [...new Set(sortedTrips.map(trip => trip.platform))]
                const dates = Object.keys(byDate)

                this.earningsByDate = {
                  labels: dates,
                  datasets: platforms.map(platform => ({
                    label: platform,
                    data: dates.map(date => byDate[date][platform] || 0),
                    backgroundColor: platformColors[platform] || '#A3A3A3',
                    borderRadius: 8,
                  }))
                }

                const byPlatform = sortedTrips.reduce((acc, trip) => {
                  acc[trip.platform] = (acc[trip.platform] || 0) + Number(trip.earnings)
                  return acc
                }, {})

                this.earningsByPlatform = {
                  labels: Object.keys(byPlatform),
                  datasets: [{
                    data: Object.values(byPlatform),
                    backgroundColor: Object.keys(byPlatform).map(platform => platformColors[platform] || '#A3A3A3'),
                    borderRadius: 8
                    // label: 'Faturamento por Plataforma'
                  }]
                }
              }
            }
          }
          </script>
