<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Despesas</h1>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">Registrar Nova Despesa</h3>
      <form @submit.prevent="submitExpense">
        <div class="mb-4">
          <label for="category" class="block text-sm font-medium text-gray-700">Categoria</label>
          <select
              id="category"
              v-model="expense.category"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="" disabled>Selecione uma categoria</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label for="amount" class="block text-sm font-medium text-gray-700">Valor (R$)</label>
          <input
              id="amount"
              v-model="expense.amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
        </div>

        <div class="mb-4">
          <label for="date" class="block text-sm font-medium text-gray-700">Data</label>
          <input
              id="date"
              v-model="expense.date"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
        </div>

        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
              id="description"
              v-model="expense.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div v-if="expense.category === 'Combustível'">
          <div class="mb-4">
            <label for="odometer" class="block text-sm font-medium text-gray-700">Quilometragem (odômetro)</label>
            <input
                id="odometer"
                v-model="expense.odometer"
                type="number"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
          </div>
          <div class="mb-4">
            <label for="fuel_type" class="block text-sm font-medium text-gray-700">Tipo de combustível</label>
            <input
                id="fuel_type"
                v-model="expense.fuel_type"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
          </div>
          <div class="mb-4">
            <label for="liters" class="block text-sm font-medium text-gray-700">Litros</label>
            <input
                id="liters"
                v-model="expense.liters"
                type="number"
                step="0.01"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
          </div>
          <div class="mb-4">
            <label for="price_per_liter" class="block text-sm font-medium text-gray-700">Preço por litro (R$)</label>
            <input
                id="price_per_liter"
                v-model="expense.price_per_liter"
                type="number"
                step="0.01"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
          </div>
        </div>

        <button
            type="submit"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Salvar Despesa
        </button>
      </form>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-semibold mb-4">Despesas Registradas</h3>

      <div v-if="expenses.length === 0" class="text-gray-500 text-center py-4">
        Nenhuma despesa registrada
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
          <tr class="bg-gray-100">
            <th class="py-2 px-4 text-left">Categoria</th>
            <th class="py-2 px-4 text-left">Valor</th>
            <th class="py-2 px-4 text-left">Data</th>
            <th class="py-2 px-4 text-left">Descrição</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in expenses" :key="item.id" class="border-t border-gray-200">
            <td class="py-2 px-4">{{ item.category }}</td>
            <td class="py-2 px-4">R$ {{ formatNumberBR(item.amount) }}</td>
            <td class="py-2 px-4">{{ formatDate(item.date) }}</td>
            <td class="py-2 px-4">{{ item.description }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expense: {
        driver_id: 'teste',
        trip_id: null,
        category: '',
        amount: 0,
        date: new Date().toISOString().substr(0, 10),
        description: '',
        odometer: null,
        fuel_type: '',
        liters: null,
        price_per_liter: null
      },
      categories: ['Combustível', 'Alimentação', 'Lazer', 'Outros'],
      expenses: []
    };
  },
  mounted() {
    this.fetchExpenses();
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    formatNumberBR(value) {
      if (typeof value !== 'number') {
        value = Number(value);
      }
      return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    async fetchExpenses() {
      try {
        const res = await this.$api.getExpenses();
        this.expenses = res.data;
      } catch (error) {
        console.error('Erro ao buscar despesas:', error);
      }
    },
    async submitExpense() {
      try {
        // Busque um driver_id consistente (padrão 'teste' se nada for encontrado)
        const driverId = await this.$api.getDriverId();
        this.expense.driver_id = String(driverId);
        console.log('Enviando despesa:', this.expense);

        await this.$api.createExpense(this.expense);

        // Reseta campos mantendo driver_id
        this.expense = {
          ...this.expense,
          trip_id: null,
          category: '',
          amount: 0,
          date: new Date().toISOString().substr(0, 10),
          description: '',
          odometer: null,
          fuel_type: '',
          liters: null,
          price_per_liter: null
        }

        this.fetchExpenses();
      } catch (error) {
        console.error('Erro ao criar despesa:', error);
        alert('Erro ao criar despesa. Verifique o console para mais detalhes.');
      }
    }
  }
};
</script>
