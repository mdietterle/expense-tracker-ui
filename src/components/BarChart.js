// src/components/BarChart.js
        import { defineComponent, h } from 'vue'
        import { Bar } from 'vue-chartjs'
        import {
          Chart as ChartJS,
          CategoryScale,
          LinearScale,
          BarElement,
          Title,
          Tooltip,
          Legend
        } from 'chart.js'

        ChartJS.register(
          CategoryScale,
          LinearScale,
          BarElement,
          Title,
          Tooltip,
          Legend
        )

        export default defineComponent({
          name: 'BarChart',
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
            return () => h(Bar, {
              data: props.chartData,
              options: props.chartOptions
            })
          }
        })