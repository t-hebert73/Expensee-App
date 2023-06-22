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
import ExpensesTable from '@/components/ExpensesTable.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ManageView',

  components: { ExpensesTable },

  setup() {
    return {};
  },
});
</script>
