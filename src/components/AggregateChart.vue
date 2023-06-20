<template>
  <Card>
    <template #content>
      <Line
        id="aggregate_chart"
        :options="chartOptions"
        :data="chartData"
        :style="chartStyles"
      />
    </template>
  </Card>
</template>

<script lang="ts">
import Card from 'primevue/card';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale
);

export default {
  name: 'AggregateChart',
  components: { Line, Card },
  data() {
    return {
      chartData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Total',
            data: [213, 232, 249, 239, 225, 191],
            backgroundColor: 'rgb(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
          },
          {
            label: 'Gas',
            data: [63, 69, 75, 99, 95, 92],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132)',
          },
          {
            label: 'Hydro',
            data: [150, 163, 174, 140, 130, 99],
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            borderColor: 'rgba(255, 205, 86)',
          },
        ],
      },
      chartOptions: {
        responsive: true,
      },
    };
  },

  computed: {
    chartStyles() {
      return {
        height: '400px',
        width: '100%',
        position: 'relative',
      };
    },
  },
};
</script>
