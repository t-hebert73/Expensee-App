<template>
  <div class="col-12 mb-3">
    <Card>
      <template #content>
        <div class="flex justify-content-around align-items-center">
          <div class="name text-2xl text-900 text-left" style="width: 33%">
            {{ expense?.name }}<CategoryTag v-if="expense" :expense="expense"></CategoryTag>
          </div>
          <div class="frequency text-xl text-900 text-center" style="width: 33%">{{ expense?.frequency }}</div>
          <div class="text-2xl text-900 provider text-right" style="width: 33%">{{ expense?.provider }}</div>
        </div>
      </template>
    </Card>
  </div>
  <div class="col-12 mb-5">
    <Card>
      <template #content>
        <DateRangeSelector @datesSelected="onDateRangeSelected"></DateRangeSelector>
      </template>
    </Card>
  </div>
  <div class="col-12">
    <AggregateChart :expenses="expenses" />
  </div>
  <div class="col-12 mt-3 mb-5">
    <AggregateAverages :expenses="expenses" :hide-category="true" />
  </div>
  <div class="col-12 mt-3 mb-5">
    <PaymentsTable v-if="expense" :expense="expense"></PaymentsTable>
  </div>
</template>

<script lang="ts">
import Card from 'primevue/card';
import CategoryTag from '../components/CategoryTag.vue';
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuery } from '@urql/vue';
import { GetExpenseWithPaymentsDocument, Expense, GetExpenseWithPaymentsQueryVariables } from '@/graphql/generated';
import AggregateChart from '../components/aggregates/AggregateChart.vue';
import AggregateAverages from '../components/aggregates/AggregateAverages.vue';
import DateRangeSelector from '@/components/DateRangeSelector.vue';
import { useToast } from 'primevue/usetoast';
import PaymentsTable from '@/components/payments/PaymentsTable.vue';

export default defineComponent({
  components: { AggregateChart, AggregateAverages, Card, CategoryTag, DateRangeSelector, PaymentsTable },
  setup() {
    const router = useRouter();
    const id =
      typeof router.currentRoute.value.params.id === 'string' ? parseInt(router.currentRoute.value.params.id) : -1;

    const toast = useToast();

    const expense = ref<Expense | null>(null);
    const queryVariables: GetExpenseWithPaymentsQueryVariables = {
      id: id,
    };

    const query = useQuery({
      query: GetExpenseWithPaymentsDocument,
      variables: queryVariables,
    });

    const fetchExpense = async () => {
      const result = await query.executeQuery();

      if (result.data.value?.expense) {
        expense.value = result.data.value?.expense;
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load data',
          life: 5000,
        });
      }
    };

    if (id) fetchExpense();

    const expenses = computed(() => {
      return expense.value ? [expense.value] : [];
    });

    const onDateRangeSelected = (dates: any) => {
      queryVariables.paidAtDateRange = dates;
      fetchExpense();
    };

    return { expense, expenses, onDateRangeSelected };
  },
});
</script>
