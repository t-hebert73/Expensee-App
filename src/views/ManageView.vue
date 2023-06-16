<template>
  <div class="page-signup">
    <section class="grid grid-nogutter">
      <div class="col-10">
        <h1 class="mb-5">Edit your expenses</h1>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Button from 'primevue/button';
import { authStore } from '@/stores/auth';

export default {
  name: 'DashboardView',

  components: { Button },

  setup() {
    const auth = authStore();

    return { user: auth.user };
  },
};
</script>

<style lang="scss" scoped>

</style>
