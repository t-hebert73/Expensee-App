<template>
  <Card>
    <template #title v-if="chartData.datasets.length">
      <div class="flex justify-content-between">
        <Calendar
          v-model="selectedDates"
          selectionMode="range"
          dateFormat="mm/yy"
          view="month"
          :manualInput="false"
          :hideOnRangeSelection="true"
          placeholder="Date Range"
        />
        <label class="group-data-switch">
          <span>Group data by month</span>
          <InputSwitch v-model="groupWithIgnoringYear" />
        </label>
      </div>
    </template>
    <template #content>
      <Chart
        v-if="chartData.datasets.length"
        type="line"
        :data="chartData"
        :style="chartStyles"
        :options="{ responsive: true, maintainAspectRatio: false }"
      />
      <div v-else>
        A graph awaits you when you have expenses with payments! Be sure to
        <RouterLink class="p-button p-button-text p-0" :to="{ name: 'manage' }"
          >add some</RouterLink
        >
        and keep the payments up to date!
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Calendar from 'primevue/calendar';
import InputSwitch from 'primevue/inputswitch';
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
import moment, { Moment } from 'moment';
import { RouterLink } from 'vue-router';

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
  components: { Card, Chart, Calendar, InputSwitch, RouterLink },

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
    const xAxisDates = ref<string[]>([]);
    const groupWithIgnoringYear = ref(false);
    const dateFormat = computed(() => {
      return groupWithIgnoringYear.value ? 'MMMM' : 'MMMM YYYY';
    });

    const datasets = ref<IDataSet[]>([]);

    const mychart = ref(null);

    const queryVariables = ref<GetExpensesWithPaymentsQueryVariables>();

    const query = useQuery({
      query: GetExpensesWithPaymentsDocument,
      variables: queryVariables,
    });

    const fetchExpenses = async (
      startDate: Date | null = null,
      endDate: Date | null = null
    ) => {
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

      parseExpenseDataForGraph();
    };

    const parseExpenseDataForGraph = () => {
      if (expenses.value.length === 0) return;

      datasets.value = [];
      xAxisDates.value = [];
      let earliestDate: Moment = moment();
      let latestDate: Moment = moment();

      expenses.value.forEach((expense) => {
        expense.payments?.forEach((payment) => {
          const paymentPaidAt = moment(payment.paidAt);

          if (paymentPaidAt < earliestDate) earliestDate = paymentPaidAt;
          if (paymentPaidAt > latestDate) latestDate = paymentPaidAt;
        });
      });

      const incrementingDate: Moment = earliestDate.startOf('month');

      while (incrementingDate < latestDate.endOf('month')) {
        if (groupWithIgnoringYear.value) {
          if (
            !xAxisDates.value.includes(
              incrementingDate.format(dateFormat.value)
            )
          )
            xAxisDates.value.push(incrementingDate.format(dateFormat.value));
        } else {
          xAxisDates.value.push(incrementingDate.format(dateFormat.value));
        }

        incrementingDate.add(1, 'month');
      }

      if (groupWithIgnoringYear.value) {
        xAxisDates.value.sort((a, b) => {
          return moment(`${a} 01 2023`) > moment(`${b} 01 2023`) ? 1 : -1;
        });
      }

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
      xAxisDates.value.forEach(() => {
        data.push(0);
      });
    };

    const setDataValueForDateAtIndex = (payment: Payment, data: number[]) => {
      const paidAtDate = moment(payment.paidAt).format(dateFormat.value);
      if (!xAxisDates.value.includes(paidAtDate)) return;

      data[xAxisDates.value.indexOf(paidAtDate)] += payment.amount;
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
        labels: xAxisDates.value,
        datasets: datasets.value,
      };
    });

    fetchExpenses();

    watch(
      () => selectedDates.value,
      (selectedDates) => {
        if (!selectedDates[0] || !selectedDates[1]) return;

        console.log('selected');
        fetchExpenses(selectedDates[0], selectedDates[1]);
      }
    );

    watch(
      () => groupWithIgnoringYear.value,
      () => {
        parseExpenseDataForGraph();
      }
    );

    return {
      datasets,
      mychart,
      chartData,
      chartStyles,
      selectedDates,
      groupWithIgnoringYear,
    };
  },
});
</script>

<style lang="sass" scoped>
.group-data-switch
  font-size: 1rem

  span
    display: inline-block
    vertical-align: top
    margin-right: 15px
    font-weight: 600
</style>
