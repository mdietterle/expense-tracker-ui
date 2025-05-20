<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">Despesas</h1>

    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="space-y-6">
        <h3 class="text-xl font-semibold mb-6">Registrar Nova Despesa</h3>
        <form @submit.prevent="submitExpense" class="space-y-6">
          <div class="space-y-4">
            <w-select
                :items="categories"
                item-label="label"
                outline
                inner-icon-left="mdi mdi-account"
                label="Categoria"
                label-position="inside"
                required
                v-model="expense.category"
                round
            ></w-select>

            <w-input
                label="Valor"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-currency-usd"
                v-model="expense.amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                round
            ></w-input>

            <w-input
                label="Data"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-calendar-clock-outline"
                required
                v-model="expense.date"
                type="date"
                id="date"
                round
            ></w-input>

            <w-textarea
                label="Descrição"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-message-text-outline"
                v-model="expense.description"
                rows="3"
                round
                required
            ></w-textarea>
          </div>

          <div v-if="expense.category === 'Combustível'" class="space-y-4 bg-gray-50 p-4 rounded-lg">
            <w-input
                label="Quilometragem"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-counter"
                v-model="expense.odometer"
                type="number"
                step="0.01"
                min="0.01"
                required
                round
            ></w-input>

            <w-select
                :items="fuelTypes"
                outline
                inner-icon-left="mdi mdi-gas-station"
                label="Combustível"
                label-position="inside"
                required
                v-model="expense.fuel_type"
                round
            ></w-select>

            <div class="grid grid-cols-2 gap-4">
              <w-input
                  label="Litros"
                  label-position="inside"
                  outline
                  inner-icon-left="mdi mdi-numeric"
                  v-model="expense.liters"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  round
              ></w-input>

              <w-input
                  label="Preço por litro"
                  label-position="inside"
                  outline
                  inner-icon-left="mdi mdi-account-cash-outline"
                  v-model="expense.price_per_liter"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  round
              ></w-input>
            </div>
          </div>

          <w-button class="w-full" bg-color="success" type="submit" round>
            <w-icon class="mr-2">wi-check</w-icon>
            Salvar Despesa
          </w-button>
        </form>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-8">
      <div class="space-y-10">
      <h3 class="text-xl font-semibold mb-10">Despesas Registradas</h3> <!-- Aumentado de mb-6 para mb-8 -->
      <div class="mb-8"> <!-- Adicionada div wrapper com margin-bottom -->
        <w-table
            :headers="headers"
            :items="expenses"
            :filters="filters"
            filterable
            hover
            striped
            class="mb-4"
        >
          <template #item="{ item }">
            <tr 
              @click="openViewModal(item)"
              class="cursor-pointer hover:bg-gray-50"
            >
              <td>{{ item?.category || '-' }}</td>
              <td>R$ {{ item?.amount ? formatNumberBR(item.amount) : '-' }}</td>
              <td>{{ item?.date ? formatDate(item.date) : '-' }}</td>
              <td>{{ item?.description || '-' }}</td>
            </tr>
          </template>
        </w-table>

        <div v-if="expenses.length === 0" class="text-center py-4 text-gray-500">
          Nenhuma despesa encontrada
        </div>
      </div>
      </div>
    </div>
  <!-- Modal de Edição -->
  <w-dialog v-model="showEditModal" persistent>
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-6">Editar Despesa</h3>
      <form @submit.prevent="updateExpense" class="space-y-4">
        <w-select
            :items="categories"
            v-model="editingExpense.category"
            label="Categoria"
            outline
            round
        ></w-select>

        <w-input
            v-model="editingExpense.amount"
            label="Valor"
            type="number"
            step="0.01"
            outline
            round
        ></w-input>

        <w-input
            v-model="editingExpense.date"
            label="Data"
            type="date"
            outline
            round
        ></w-input>

        <w-textarea
            v-model="editingExpense.description"
            label="Descrição"
            outline
            round
        ></w-textarea>

        <div class="flex justify-end space-x-2 mt-6">
          <w-button
              outline
              @click="showEditModal = false"
              round
          >
            Cancelar
          </w-button>
          <w-button
              type="submit"
              bg-color="success"
              round
          >
            Salvar
          </w-button>
        </div>
      </form>
    </div>
  </w-dialog>

  <!-- Modal de Visualização -->
  <w-dialog v-model="showViewModal">
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-6">Detalhes da Despesa</h3>
      <div class="space-y-4">
        <p><strong>Categoria:</strong> {{ selectedExpense?.category }}</p>
        <p><strong>Valor:</strong> R$ {{ formatNumberBR(selectedExpense?.amount) }}</p>
        <p><strong>Data:</strong> {{ formatDate(selectedExpense?.date) }}</p>
        <p><strong>Descrição:</strong> {{ selectedExpense?.description }}</p>

        <!-- Campos específicos para despesas de combustível -->
        <template v-if="selectedExpense?.category === 'Combustível'">
          <p><strong>Quilometragem:</strong> {{ selectedExpense?.odometer }} km</p>
          <p><strong>Tipo de Combustível:</strong> {{ selectedExpense?.fuel_type }}</p>
          <p><strong>Litros:</strong> {{ selectedExpense?.liters }}</p>
          <p><strong>Preço por Litro:</strong> R$ {{ formatNumberBR(selectedExpense?.price_per_liter) }}</p>
        </template>

        <div class="flex justify-end space-x-2 mt-6">
          <w-button
              bg-color="info"
              @click="startEdit"
              round
          >
            Editar
          </w-button>
          <w-button
              bg-color="error"
              @click="confirmDelete(selectedExpense)"
              round
          >
            Excluir
          </w-button>
          <w-button
              outline
              @click="showViewModal = false"
              round
          >
            Fechar
          </w-button>
        </div>
      </div>
    </div>
  </w-dialog>

  <!-- Dialog de Confirmação -->
  <w-dialog v-model="showDeleteConfirm">
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-4">Confirmar Exclusão</h3>
      <p class="mb-6">Tem certeza que deseja excluir esta despesa?</p>
      <div class="flex justify-end space-x-2">
        <w-button
            outline
            @click="showDeleteConfirm = false"
            round
        >
          Cancelar
        </w-button>
        <w-button
            bg-color="error"
            @click="deleteExpense"
            round
        >
          Excluir
        </w-button>
      </div>
    </div>
  </w-dialog>
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
      headers: [
        { label: 'Categoria', key: 'category', filterable: true },
        { label: 'Valor', key: 'amount', filterable: true },
        { label: 'Data', key: 'date', filterable: true },
        { label: 'Descrição', key: 'description', filterable: true }
      ],
      showEditModal: false,
      showViewModal: false,
      showDeleteConfirm: false,
      editingExpense: null,
      selectedExpense: null,
      filters: {
        category: '',
        amount: '',
        date: '',
        description: '',
      },
      expenses: [],
      // categories: ['Combustível', 'Alimentação', 'Lazer', 'Outros'],
      categories: [
        { label: 'Combustível', value: 'Combustível' },
        { label: 'Alimentação', value: 'Alimentação' },
        { label: 'Lazer', value: 'Lazer' },
        { label: 'Outros', value: 'Outros' }
      ],
      fuelTypes: ['Gasolina', 'Etanol', 'Diesel', 'GNV']
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
        console.log('Dados da API:', res.data); // Verifique isto

        // Se necessário, faça ajuste de campos aqui
        this.expenses = res.data.map(item => ({
          ...item,
          date: new Date(item.date).toISOString().substr(0, 10)
        }));

      } catch (error) {
        console.error('Erro ao buscar despesas:', error);
        // this.$waveui.notify({
        //   type: 'error',
        //   message: 'Falha ao carregar despesas'
        // });
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
    },
    openEditModal(expense) {
      this.editingExpense = { ...expense }
      this.showEditModal = true
    },

    openViewModal(expense) {
      this.selectedExpense = expense
      this.showViewModal = true
    },

    confirmDelete(expense) {
      this.selectedExpense = expense
      this.showDeleteConfirm = true
    },

    async updateExpense() {
      try {
        await this.$api.updateExpense(this.editingExpense.id, this.editingExpense)
        this.showEditModal = false
        this.fetchExpenses()
      } catch (error) {
        console.error('Erro ao atualizar despesa:', error)
        alert('Erro ao atualizar despesa')
      }
    },

    async deleteExpense() {
      try {
        await this.$api.deleteExpense(this.selectedExpense.id)
        this.showDeleteConfirm = false
        this.fetchExpenses()
      } catch (error) {
        console.error('Erro ao excluir despesa:', error)
        alert('Erro ao excluir despesa')
      }
    }
  }
}
</script>
