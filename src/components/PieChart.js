// src/components/PieChart.js
import { defineComponent, h } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

export default defineComponent({
  name: 'PieChart',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    return () => h(Pie, {
      data: props.chartData,
      options: props.chartOptions
    })
  }
})