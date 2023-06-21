<template>
  <div class="page-manage">
    <section class="grid grid-nogutter">
      <div class="col-12">
        <ExpensesTable></ExpensesTable>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { authStore } from '@/stores/auth';
import ExpensesTable from '@/components/ExpensesTable.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ManageView',

  components: { ExpensesTable },

  setup() {
    const auth = authStore();

    return { user: auth.user };
  },
});
</script>
