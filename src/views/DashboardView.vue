<template>
  <div class="page-dashboard">
    <section class="grid grid-nogutter">
      <div class="col-12">
        <AggregateChart />
      </div>

      <div class="col-12 mt-3">
        Show Averages.. avg total per month. avg invidivual expense per month.
        average category per month
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { authStore } from '@/stores/auth';
import AggregateChart from '../components/aggregate-chart/AggregateChart.vue';

export default {
  name: 'DashboardView',

  components: { AggregateChart },

  setup() {
    const auth = authStore();

    return { user: auth.user };
  },
};
</script>
