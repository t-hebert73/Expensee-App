<template>
  <Card>
    <template #title>
      <div class="justify-content-between">
        <Calendar
          v-model="selectedDates"
          selectionMode="range"
          dateFormat="mm/yy"
          view="month"
          :manualInput="false"
          :hideOnRangeSelection="true"
          placeholder="Date Range"
        />
      </div>
    </template>
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
import Calendar from 'primevue/calendar';
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
import { defineComponent, computed, ref, watch } from 'vue';
import {
  Expense,
  GetExpensesWithPaymentsDocument,
  Payment,
  GetExpensesWithPaymentsQueryVariables,
} from '@/graphql/generated';
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
  components: { Card, Chart, Calendar },

  setup() {
    const expenses = ref<Expense[]>([]);
    const selectedDates: any = ref(null);

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

    const queryVariables = ref<GetExpensesWithPaymentsQueryVariables>();

    const query = useQuery({
      query: GetExpensesWithPaymentsDocument,
      variables: queryVariables,
    });

    /**
     * todo:
     *    - build xAxis from api data.
     *    - inputswitch to allow for grouping between month & year (default) vs just month
     */

    const fetchExpenses = async (
      startDate: Date | null = null,
      endDate: Date | null = null
    ) => {
      datasets.value = [];

      const queryStartDate = startDate
        ? moment(startDate).format('YYYY-MM-DD')
        : null;

      const queryStartEnd = endDate
        ? moment(endDate).format('YYYY-MM-DD')
        : null;

      if (queryStartDate && queryStartEnd) {
        queryVariables.value = {
          paidAtDateRange: {
            start: queryStartDate,
            end: queryStartEnd,
          },
        };
      }

      const result = await query.executeQuery();

      expenses.value = result.data.value?.expenses
        ? result.data.value?.expenses
        : [];

      const totalDataset: IDataSet = {
        label: 'Total',
        data: [],
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 2,
      };

      setDefaultDataValuesForDataSet(totalDataset.data);

      expenses.value.forEach((expense, i) => {
        const label: string = expense.name;
        const data: number[] = [];
        const backgroundColor: string = expenseColours[i]
          ? expenseColours[i].backgroundColor
          : 'rgba(201, 203, 207, 0.2)';
        const borderColor: string = expenseColours[i]
          ? expenseColours[i].backgroundColor
          : 'rgb(201, 203, 207)';

        setDefaultDataValuesForDataSet(data);

        expense.payments?.forEach((payment) => {
          setDataValueForDateAtIndex(payment, data);
          setDataValueForDateAtIndex(payment, totalDataset.data);
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

    const setDefaultDataValuesForDataSet = (data: number[]) => {
      xAxisDates.forEach(() => {
        data.push(0);
      });
    };

    const setDataValueForDateAtIndex = (payment: Payment, data: number[]) => {
      const paidAtDate = moment(payment.paidAt).format('MMMM');
      if (!xAxisDates.includes(paidAtDate)) return;

      data[xAxisDates.indexOf(paidAtDate)] += payment.amount;
    };

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

    fetchExpenses();

    watch(
      () => selectedDates.value,
      (selectedDates) => {
        if (!selectedDates[0] || !selectedDates[1]) return;

        fetchExpenses(selectedDates[0], selectedDates[1]);
      }
    );

    return {
      datasets,
      mychart,
      chartData,
      chartStyles,
      selectedDates,
    };
  },
});
</script>
