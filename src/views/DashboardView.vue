<template>
  <div class="page-dashboard">
    <section class="grid grid-nogutter">
      <div class="col-12 mb-5">
        <Card>
          <template #content>
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
                <InputSwitch v-model="shouldGroupDataByMonth" />
              </label>
            </div>
          </template>
        </Card>
      </div>
      <div class="col-12">
        <AggregateChart :expenses="expenses" :shouldGroupDataByMonth="shouldGroupDataByMonth" />
      </div>

      <div class="col-12 mt-3 mb-5">
        <AggregateAverages :expenses="expenses" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Card from 'primevue/card';
import Calendar from 'primevue/calendar';
import InputSwitch from 'primevue/inputswitch';
import AggregateChart from '../components/aggregates/AggregateChart.vue';
import AggregateAverages from '../components/aggregates/AggregateAverages.vue';
import { defineComponent, ref, watch } from 'vue';
import { useQuery } from '@urql/vue';
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

  components: { Card, Calendar, InputSwitch, AggregateChart, AggregateAverages },

  setup() {
    const expenses = ref<Expense[]>([]);

    const shouldGroupDataByMonth = ref(false);

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

    const selectedDates = ref<Date[] | null>(null);
    watch(
      () => selectedDates.value,
      (selectedDates) => {
        if (!selectedDates || !selectedDates[0] || !selectedDates[1]) return;

        fetchExpenses({
          dateRange: { start: selectedDates[0], end: selectedDates[1] },
        });
      }
    );

    fetchExpenses();

    return { expenses, selectedDates, shouldGroupDataByMonth };
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
</style>
