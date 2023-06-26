<template>
  <Card>
    <template #content>
      <Chart
        v-if="chartData.datasets.length"
        type="line"
        :data="chartData"
        :style="chartStyles"
        :options="{ responsive: true, maintainAspectRatio: false }"
      />
      <p class="text-center mt-5 mb-5" v-else>No data available for selected time period.</p>
    </template>
  </Card>
</template>

<script lang="ts">
import Card from 'primevue/card';
import Chart from 'primevue/chart';
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
import { defineComponent, computed, ref, watch, PropType } from 'vue';
import { Expense, Payment } from '@/graphql/generated';
import moment, { Moment } from 'moment';
import { expenseGraphColours } from './definitions';

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale);

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

  props: {
    expenses: {
      type: Array as PropType<Expense[]>,
      required: true,
    },
    shouldGroupDataByMonth: {
      type: Boolean,
      required: true,
    },
  },

  setup(props) {
    const xAxisDates = ref<string[]>([]);
    const dateFormat = computed(() => {
      return props.shouldGroupDataByMonth ? 'MMMM' : 'MMMM YYYY';
    });

    const datasets = ref<IDataSet[]>([]);

    const parseExpenseData = () => {
      if (props.expenses?.length === 0) return;

      resetGraphData();
      buildXAxis();

      const totalDataset: IDataSet = {
        label: 'Total',
        data: [],
        backgroundColor: expenseGraphColours.total.backgroundColor,
        borderColor: expenseGraphColours.total.borderColor,
        borderWidth: 2,
      };

      setDefaultDataValuesForDataSet(totalDataset.data);

      props.expenses.forEach((expense, i) => {
        parseDataSet(expense, totalDataset, i);
      });

      // only include the total dataset if we have at least two other datasets
      if (datasets.value.length < 2) return;

      datasets.value.push(totalDataset);
    };

    const buildXAxis = () => {
      let earliestPaidAtDate: Moment = moment();
      let latestPaidAtDate: Moment = moment();

      props.expenses.forEach((expense) => {
        expense.payments?.forEach((payment) => {
          const paymentPaidAt = moment(payment.paidAt);

          if (paymentPaidAt < earliestPaidAtDate) earliestPaidAtDate = paymentPaidAt;
          if (paymentPaidAt > latestPaidAtDate) latestPaidAtDate = paymentPaidAt;
        });
      });

      const dateIncrement: Moment = earliestPaidAtDate.startOf('month');

      while (dateIncrement < latestPaidAtDate.endOf('month')) {
        if (shouldAddToXAxisDates(dateIncrement)) xAxisDates.value.push(dateIncrement.format(dateFormat.value));

        dateIncrement.add(1, 'month');
      }

      if (!props.shouldGroupDataByMonth) return;

      xAxisDates.value.sort((a, b) => {
        return moment(`${a} 01 2023`) > moment(`${b} 01 2023`) ? 1 : -1;
      });
    };

    const shouldAddToXAxisDates = (dateIncrement: moment.Moment) => {
      if (!props.shouldGroupDataByMonth) return true;

      if (!xAxisDates.value.includes(dateIncrement.format(dateFormat.value))) return true;

      return false;
    };

    const resetGraphData = () => {
      datasets.value = [];
      xAxisDates.value = [];
    };

    const parseDataSet = (expense: Expense, totalDataset: IDataSet, i: number) => {
      if (!expense.payments?.length) return;

      const label: string = expense.name;
      const data: number[] = [];
      const backgroundColor: string = expenseGraphColours.additional[i]
        ? expenseGraphColours.additional[i].backgroundColor
        : expenseGraphColours.default.backgroundColor;
      const borderColor: string = expenseGraphColours.additional[i]
        ? expenseGraphColours.additional[i].backgroundColor
        : expenseGraphColours.default.borderColor;

      setDefaultDataValuesForDataSet(data);

      expense.payments?.forEach((payment) => {
        setDataValueForDateAtIndex(payment, data);
        setDataValueForDateAtIndex(payment, totalDataset.data);
      });

      datasets.value.push({
        label,
        data,
        backgroundColor,
        borderColor,
        borderWidth: 2,
      });
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

    watch(
      () => props.expenses,
      () => {
        parseExpenseData();
      }
    );

    watch(
      () => props.shouldGroupDataByMonth,
      () => {
        parseExpenseData();
      }
    );

    return {
      datasets,
      chartData,
      chartStyles,
    };
  },
});
</script>
