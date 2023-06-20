<template>
  <Card>
    <template #title><h4>Current Expenses</h4></template>
    <template #content>
      <DataTable :value="expenses" tableStyle="width: 100%;">
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="provider" header="Provider"></Column>
        <Column field="frequency" header="Freqency"></Column>
      </DataTable>
    </template>
  </Card>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useQuery } from '@urql/vue';
import { GetExpensesDocument, Expense } from '@/graphql/generated';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';

export default {
  name: 'ExpensesTable',

  components: { DataTable, Column, Card },

  setup() {
    let expenses = ref<Expense[]>([]);

    const fetchExpenses = async () => {
      const query = useQuery({
        query: GetExpensesDocument,
      });

      const result = await query.executeQuery();

      if (result.data.value?.expenses) {
        expenses.value = result.data.value?.expenses;
      }
    };

    fetchExpenses();

    return { expenses };
  },
};
</script>
