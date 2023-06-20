<template>
  <Card>
    <template #content>
      <DataTable
        :value="expenses"
        stripedRows
        tableStyle="width: 100%; border-spacing: 0; border-collapse: initial;"
      >
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="provider" header="Provider"></Column>
        <Column field="frequency" header="Frequency"></Column>
        <Column field="action" header="Action" style="width: 350px">
          <template #body="{ data }">
            <Button
              @click="navigateToEditExpense(data)"
              label="Edit"
              rounded
              size="small"
              class="mr-3"
            ></Button>
            <Button
              @click="navigateToEditPayments(data)"
              severity="success"
              label="Payments"
              rounded
              size="small"
              class="mr-3"
            ></Button>
            <Button
              @click="deleteExpense(data)"
              severity="danger"
              rounded
              icon="pi pi-trash"
              label="Remove"
              size="small"
            ></Button>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { useQuery } from '@urql/vue';
import { GetExpensesDocument, Expense } from '@/graphql/generated';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ExpensesTable',

  components: { DataTable, Column, Card, Button },

  setup() {
    const router = useRouter();
    const expenses = ref<Expense[]>([]);

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

    const navigateToEditExpense = (expense: Expense) => {
      router.push({
        name: 'edit.expense',
        params: {
          id: expense.id,
        },
      });
    };
    const navigateToEditPayments = (expense: Expense) => {
      console.log(expense.id);
    };
    const deleteExpense = (expense: Expense) => {
      console.log(expense.id);
    };

    return {
      expenses,
      navigateToEditExpense,
      navigateToEditPayments,
      deleteExpense,
    };
  },
});
</script>
