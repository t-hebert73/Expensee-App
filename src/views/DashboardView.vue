<template>
  <div class="page-signup">
    <section class="grid grid-nogutter">
      <div class="col-12">
        <div class="mt-5">
          <AggregateChart />
        </div>

        <div class="mt-5">
          <ExpensesTable></ExpensesTable>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { authStore } from '@/stores/auth';
import AggregateChart from '../components/AggregateChart.vue';
import ExpensesTable from '@/components/ExpensesTable.vue';

export default {
  name: 'DashboardView',

  components: { AggregateChart, ExpensesTable },

  setup() {
    const auth = authStore();

    return { user: auth.user };
  },
};
</script>

<style lang="scss" scoped></style>
