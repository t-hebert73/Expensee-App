<template>
  <div class="page-signup">
    <section class="grid grid-nogutter">
      <div class="col-12">
        <AggregateChart />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { authStore } from '@/stores/auth';
import AggregateChart from '../components/AggregateChart.vue';

export default {
  name: 'DashboardView',

  components: { AggregateChart },

  setup() {
    const auth = authStore();

    return { user: auth.user };
  },
};
</script>
