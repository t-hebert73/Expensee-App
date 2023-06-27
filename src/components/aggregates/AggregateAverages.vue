<template>
  <Card class="aggregate-averages">
    <template #title>
      <div class="flex justify-content-between">
        <div class="text-2xl text-900">Average cost per month</div>
        <label class="group-data-switch">
          <span>Group data by category</span>
          <InputSwitch v-model="shouldGroupDataByCategory" />
        </label>
      </div>
    </template>
    <template #content>
      <div
        class="flex justify-content-between align-items-center data-item p-4"
        v-for="dataset in averagesDataSet"
        :key="dataset.name"
      >
        <div class="flex align-items-center">
          <div class="">
            <div class="name text-xl text-900">
              {{ dataset.name }}
            </div>
            <div class="flex provider text-600 align-items-center">
              {{ dataset.expense?.provider }}
              <CategoryTag v-if="dataset.expense" :expense="dataset.expense"></CategoryTag>
            </div>
          </div>
        </div>
        <div class="value text-2xl font-bold text-900">
          {{ CADFormatter.format(dataset.value) }}
        </div>
      </div>

      <p class="text-center mt-5 mb-5" v-if="!averagesDataSet.length">No data available for selected time period.</p>
    </template>
  </Card>
</template>

<script lang="ts">
import Card from 'primevue/card';
import CategoryTag from '../CategoryTag.vue';
import InputSwitch from 'primevue/inputswitch';
import { Expense } from '@/graphql/generated';
import { PropType, defineComponent, watch, ref } from 'vue';
import { frequenciesMap } from './definitions';

type IAvgDataSet = {
  name: string;
  value: number;
  expense?: Expense;
};

type IFrequencyPayment = {
  expense: Expense;
  payment: number;
};

type ICategoryDataSet = {
  name: string;
  payments: IFrequencyPayment[];
};
export default defineComponent({
  name: 'AggregateAverages',

  components: { Card, CategoryTag, InputSwitch },

  props: {
    expenses: {
      type: Array as PropType<Expense[]>,
      required: true,
    },
  },

  setup(props) {
    const shouldGroupDataByCategory = ref(false);

    const parseExpenseData = () => {
      if (props.expenses?.length === 0) return;

      averagesDataSet.value = [];

      const funcToCall = shouldGroupDataByCategory.value ? parseByCategory : parseByExpense;
      funcToCall();

      calculateTotal();
    };

    const parseByExpense = () => {
      props.expenses.forEach((expense) => {
        if (!expense.payments?.length) return;

        const paymentValues: number[] = [];

        expense.payments?.forEach((payment) => {
          const paymentAmount = normalizePaymentAmountWithFrequency(payment.amount, expense.frequency);
          paymentValues.push(paymentAmount);
        });

        const avgValue = paymentValues.reduce((accumulator, val) => accumulator + val) / paymentValues.length;

        averagesDataSet.value.push({
          name: expense.name,
          value: avgValue,
          expense: expense,
        });
      });
    };

    const parseByCategory = () => {
      const categoriesDataSet: ICategoryDataSet[] = [];

      props.expenses.forEach((expense) => {
        const categoryDataSet = categoriesDataSet.find((dataset) => dataset.name === expense.category) ?? {
          name: expense.category,
          payments: [],
        };

        expense.payments?.forEach((payment) => {
          const paymentAmount = normalizePaymentAmountWithFrequency(payment.amount, expense.frequency);
          categoryDataSet.payments.push({
            expense: expense,
            payment: paymentAmount,
          });
        });

        const categoryDataSetIndex = categoriesDataSet.findIndex((dataset) => dataset.name === expense.category);
        const indexToUse = categoryDataSetIndex === -1 ? categoriesDataSet.length : categoryDataSetIndex;

        categoriesDataSet[indexToUse] = categoryDataSet;
      });

      categoriesDataSet.forEach((dataset: ICategoryDataSet) => {
        let avgs = 0;

        props.expenses.forEach((expense) => {
          const payments = dataset.payments
            .filter((frequencyPayment) => frequencyPayment.expense.name === expense.name)
            .map((frequencyPayment) => frequencyPayment.payment);

          const avgValue = payments.length
            ? payments.reduce((accumulator, val) => accumulator + val) / payments.length
            : 0;

          avgs += avgValue;
        });

        averagesDataSet.value.push({
          name: dataset.name,
          value: avgs,
        });
      });
    };

    const normalizePaymentAmountWithFrequency = (paymentAmount: number, frequency: string) => {
      const modifier = frequenciesMap.find((freq) => freq.name === frequency)?.modifier ?? 12;

      return (paymentAmount * modifier) / 12;
    };

    const calculateTotal = () => {
      const totalAvgValue = averagesDataSet.value
        .map((dataset) => dataset.value)
        .reduce((accumulator, val) => accumulator + val);

      averagesDataSet.value.push({
        name: 'Total',
        value: totalAvgValue,
      });

      averagesDataSet.value.sort((a, b) => {
        if (b.name === 'Total') return 2;
        return a.value > b.value ? -1 : 1;
      });
    };

    watch(
      () => props.expenses,
      () => {
        parseExpenseData();
      }
    );

    watch(
      () => shouldGroupDataByCategory.value,
      () => {
        parseExpenseData();
      }
    );

    const averagesDataSet = ref<IAvgDataSet[]>([]);

    const CADFormatter = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    });

    return { shouldGroupDataByCategory, averagesDataSet, CADFormatter };
  },
});
</script>

<style lang="sass" scoped>

.group-data-switch
  font-size: 1rem
  align-self: center
  display: flex

  span
    display: inline-block
    vertical-align: super
    margin-right: 15px
    font-weight: 600
.data-item
  border-bottom: 1px solid #dee2e6

  &:last-child
    border-bottom: none
</style>
