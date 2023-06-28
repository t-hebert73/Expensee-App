<template>
  <div class="page-dashboard">
    <section class="grid grid-nogutter">
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
        <AggregateAverages :expenses="expenses" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Card from 'primevue/card';
import AggregateChart from '../components/aggregates/AggregateChart.vue';
import AggregateAverages from '../components/aggregates/AggregateAverages.vue';
import { defineComponent, ref } from 'vue';
import { useQuery } from '@urql/vue';
import DateRangeSelector from '@/components/DateRangeSelector.vue';
import moment from 'moment';
import { Expense, GetExpensesWithPaymentsDocument, GetExpensesWithPaymentsQueryVariables } from '@/graphql/generated';

type IFetchExpensesParams = {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
};

export default defineComponent({
  name: 'DashboardView',

  components: { Card, DateRangeSelector, AggregateChart, AggregateAverages },

  setup() {
    const expenses = ref<Expense[]>([]);

    const queryVariables = ref<GetExpensesWithPaymentsQueryVariables>();
    const query = useQuery({
      query: GetExpensesWithPaymentsDocument,
      variables: queryVariables,
    });

    const fetchExpenses = async (fetchParams?: IFetchExpensesParams) => {
      setupQueryVariables(fetchParams);
      const result = await query.executeQuery();

      expenses.value = result.data.value?.expenses ?? [];
    };

    const setupQueryVariables = (fetchParams?: IFetchExpensesParams) => {
      const apiExpectedDateFormat = 'YYYY-MM-DD';
      const queryStartDate = fetchParams?.dateRange.start
        ? moment(fetchParams.dateRange.start).format(apiExpectedDateFormat)
        : null;

      const queryEndDate = fetchParams?.dateRange.end
        ? moment(fetchParams.dateRange.end).format(apiExpectedDateFormat)
        : null;

      if (!queryStartDate || !queryEndDate) return;

      queryVariables.value = {
        paidAtDateRange: {
          start: queryStartDate,
          end: queryEndDate,
        },
      };
    };

    fetchExpenses();

    const onDateRangeSelected = (dates: any) => {
      fetchExpenses({
        dateRange: { start: dates.start, end: dates.end },
      });
    };

    return { expenses, onDateRangeSelected };
  },
});
</script>
