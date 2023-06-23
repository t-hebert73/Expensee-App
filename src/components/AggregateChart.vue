<template>
  <Card>
    <template #content>
      <Chart
        type="line"
        :data="chartData"
        :style="chartStyles"
        :options="{ responsive: true, maintainAspectRatio: false }"
      />
    </template>
  </Card>
</template>

<script lang="ts">
import Card from 'primevue/card';
import Chart from 'primevue/chart';
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
import { defineComponent, computed, ref } from 'vue';
import { Expense, GetExpensesWithPaymentsDocument } from '@/graphql/generated';
import { useQuery } from '@urql/vue';
import moment from 'moment';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale
);

type IDataSet = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
};

export default defineComponent({
  name: 'AggregateChart',
  components: { Card, Chart },

  setup() {
    const expenses = ref<Expense[]>([]);

    const expenseColours = [
      {
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
      },
      {
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgb(255, 159, 64)',
      },
      {
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        borderColor: 'rgb(255, 205, 86)',
      },
      {
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
      },
      {
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
      },
      {
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgb(153, 102, 255)',
      },
    ];
    const xAxisDates = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const datasets = ref<IDataSet[]>([]);

    const mychart = ref(null);

    const query = useQuery({
      query: GetExpensesWithPaymentsDocument,
    });
    const fetchExpenses = async () => {
      const result = await query.executeQuery();

      expenses.value = result.data.value?.expenses
        ? result.data.value?.expenses
        : [];

      const totalData: number[] = [];
      const totalDataset = {
        label: 'Total',
        data: totalData,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 2,
      };

      expenses.value.forEach((expense, i) => {
        const label: string = expense.name;
        const data: number[] = [];
        const backgroundColor: string = expenseColours[i]
          ? expenseColours[i].backgroundColor
          : 'rgba(201, 203, 207, 0.2)';
        const borderColor: string = expenseColours[i]
          ? expenseColours[i].backgroundColor
          : 'rgb(201, 203, 207)';

        expense.payments?.forEach((payment) => {
          const paidAtDate = moment(payment.paidAt).format('MMMM');

          xAxisDates.forEach(() => {
            data.push(0);
            totalDataset.data.push(0);
          });

          if (xAxisDates.includes(paidAtDate)) {
            data[xAxisDates.indexOf(paidAtDate)] = payment.amount;
            totalDataset.data[xAxisDates.indexOf(paidAtDate)] += payment.amount;
          }
        });

        if (expense.payments?.length) {
          datasets.value.push({
            label: label,
            data: data,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 2,
          });
        }
      });

      datasets.value.push(totalDataset);
    };

    fetchExpenses();

    const chartStyles = computed(() => {
      return {
        height: '400px',
        width: '100%',
        position: 'relative',
      };
    });

    const chartData = computed(() => {
      return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: datasets.value,
      };
    });
    return {
      datasets,
      mychart,
      chartData,
      chartStyles,
    };
  },
});
</script>
