<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">Viagens</h1>

    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="space-y-6">
        <h3 class="text-xl font-semibold mb-6">Nova Viagem</h3>
        <form @submit.prevent="submitTrip" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <w-select
                v-model="trip.platform"
                :items="platforms"
                item-label="label"
                item-value="value"
                label="Plataforma"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-car-outline"
                required
                round
            ></w-select>

            <w-input
                label="Data"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-calendar"
                v-model="trip.date"
                type="date"
                required
                round
            ></w-input>

            <w-input
                label="Origem"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-map-marker"
                v-model="trip.origin"
                required
                round
            ></w-input>

            <w-input
                label="Destino"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-map-marker-check"
                v-model="trip.destination"
                required
                round
            ></w-input>

            <w-input
                label="Distância (km)"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-map-marker-distance"
                v-model="trip.distance"
                type="number"
                step="0.01"
                min="0.01"
                required
                round
            ></w-input>

            <w-input
                label="Ganhos (R$)"
                label-position="inside"
                outline
                inner-icon-left="mdi mdi-cash"
                v-model="trip.earnings"
                type="number"
                step="0.01"
                min="0.01"
                required
                round
            ></w-input>
          </div>

          <w-button class="w-full" bg-color="success" type="submit" round>
            <w-icon class="mr-2">wi-check</w-icon>
            Salvar Viagem
          </w-button>
        </form>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-8">
      <div class="space-y-10">
        <h3 class="text-xl font-semibold mb-10">Viagens Registradas</h3>
        <div class="mb-8">
          <ul class="divide-y divide-gray-200">
            <li v-for="trip in trips" :key="trip.id" class="py-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h4 class="text-lg font-semibold text-gray-900" style="margin-bottom: 16px">Plataforma: {{ trip.platform }}</h4>

                  <div class="text-sm text-gray-600 space-y-1">
                    <p><strong>Data:</strong> {{ formatDate(trip.date) }}</p>
                    <p><strong>Origem:</strong> {{ trip.origin }}</p>
                    <p><strong>Destino:</strong> {{ trip.destination }}</p>
                    <p><strong>Distância:</strong> {{ formatNumberBR(trip.distance) }} km</p>
                    <p><strong>Ganhos:</strong> R$ {{ formatNumberBR(trip.earnings) }}</p>
                    <p>
                      <strong>Valor/km:</strong>
                      <span :class="{
                        'text-red-600 font-medium': getValuePerKm(trip) <= 2.5,
                        'text-yellow-600 font-medium': getValuePerKm(trip) > 2.5 && getValuePerKm(trip) <= 4.0,
                        'text-green-600 font-medium': getValuePerKm(trip) > 4.0
                      }">
                        R$ {{ formatNumberBR(getValuePerKm(trip)) }}
                        <span v-if="getValuePerKm(trip) <= 2.5">😞</span>
                        <span v-else-if="getValuePerKm(trip) <= 4.0">🙂</span>
                        <span v-else>😄</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <div v-if="trips.length === 0" class="text-center py-4 text-gray-500">
            Nenhuma viagem encontrada
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/20/solid'
import { WSelect } from 'wave-ui'

export default {
  components: {
    ChevronDownIcon,
    CheckIcon,
    WSelect
  },
  data() {
    return {
      trip: {
        platform: '',
        date: new Date().toISOString().substr(0, 10),
        distance: 0,
        earnings: 0,
        user_id: null,
        driver_id: null
      },
      platforms: [
        { label: 'Uber', value: 'Uber' },
        { label: '99', value: '99' },
        { label: 'Lift', value: 'Lift' },
        { label: 'Bolt', value: 'Bolt' }
      ],
      trips: []
    }
  },
  // Restante do script permanece igual
  mounted() {
    this.fetchTrips()
  },
  methods: {
    async fetchTrips() {
      try {
        const res = await this.$api.getTrips()
        this.trips = res.data
      } catch (error) {
        console.error('Erro ao buscar viagens:', error)
      }
    },
    async submitTrip() {
      try {
        const userId = localStorage.getItem('user_id') || "1";

        // Formatar a data para ISO string antes de enviar
        const formattedTrip = {
          ...this.trip,
          user_id: String(userId),
          driver_id: String(userId),
          date: this.trip.date,
          // Converter strings para números
          distance: Number(this.trip.distance),
          earnings: Number(this.trip.earnings)

        };

        await this.$api.createTrip(formattedTrip)

        // Resetar o formulário
        this.trip = {
          platform: '',
          date: new Date().toISOString().substr(0, 10),
          origin: '',
          destination: '',
          distance: 0,
          earnings: 0,
          user_id: null,
          driver_id: null
        }

        this.fetchTrips()
      } catch (error) {
        console.error('Erro ao salvar viagem:', error)
        alert('Erro ao salvar viagem: ' + (error.response?.data?.detail ? JSON.stringify(error.response.data.detail) : error.message))
      }
    },
    getValuePerKm(trip) {
      if (!trip.distance || trip.distance <= 0) return 0;
      return parseFloat(trip.earnings) / parseFloat(trip.distance);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
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
    formatValuePerKm(value) {
      return this.formatNumberBR(value);
    }
  }
}
</script>