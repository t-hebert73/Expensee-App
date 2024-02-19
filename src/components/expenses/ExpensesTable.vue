<template>
  <Card>
    <template #content>
      <div class="flex gap-2 justify-content-between mb-5">
        <div>Create, edit and remove your expenses.</div>
        <div>
          <Button @click="navigateToCreateExpense" rounded label="New Expense" icon="pi pi-plus-circle"></Button>
          <Button
            class="ml-3"
            @click="navigateToImportPayments"
            rounded
            severity="warning"
            label="Import Payments"
            icon="pi pi-upload"
          ></Button>
        </div>
      </div>
      <DataTable :value="expenses" stripedRows tableStyle="width: 100%; border-spacing: 0; border-collapse: initial;">
        <Column field="counter" style="width: 100px">
          <template #body="{ index }"> {{ index + 1 }}</template>
        </Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="provider" header="Provider"></Column>
        <Column field="frequency" header="Frequency"></Column>
        <Column field="action" header="Action" style="width: 350px">
          <template #body="{ data, index }">
            <Button @click="navigateToEditExpense(data)" label="Edit" rounded size="small" class="mr-3"></Button>
            <Button
              @click="navigateToEditPayments(data)"
              severity="success"
              label="Payments"
              rounded
              size="small"
              class="mr-3"
            ></Button>
            <Button
              @click="deleteExpense($event, data, index)"
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
  <ConfirmPopup></ConfirmPopup>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { useQuery, useMutation } from '@urql/vue';
import ConfirmPopup from 'primevue/confirmpopup';
import {
  GetExpensesDocument,
  Expense,
  DeleteExpenseDocument,
  DeleteExpenseMutationVariables,
} from '@/graphql/generated';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

export default defineComponent({
  name: 'ExpensesTable',

  components: { DataTable, Column, Card, Button, ConfirmPopup },

  setup() {
    const router = useRouter();
    const expenses = ref<Expense[]>([]);
    const toast = useToast();

    const fetchExpenses = async () => {
      const query = useQuery({
        query: GetExpensesDocument,
      });

      const result = await query.executeQuery();

      if (result.data.value?.expenses) {
        expenses.value = result.data.value?.expenses.sort((a, b) => {
          return a.name < b.name ? -1 : 1;
        });
      }
    };

    fetchExpenses();

    const navigateToCreateExpense = () => {
      router.push({
        name: 'create.expense',
      });
    };

    const navigateToImportPayments = () => {
      router.push({
        name: 'import.payments',
      });
    };

    const navigateToEditExpense = (expense: Expense) => {
      router.push({
        name: 'edit.expense',
        params: {
          id: expense.id,
        },
      });
    };
    const navigateToEditPayments = (expense: Expense) => {
      router.push({
        name: 'manage.payments',
        params: {
          id: expense.id,
        },
      });
    };

    const deleteExpenseMutation = useMutation(DeleteExpenseDocument);
    const confirm = useConfirm();

    const deleteExpense = async (event: any, expense: Expense, index: number) => {
      confirm.require({
        target: event.currentTarget,
        message: 'Do you want to delete this record?',
        acceptIcon: 'pi pi-trash',
        acceptClass: 'p-button-danger',
        accept: async () => {
          const mutationVars: DeleteExpenseMutationVariables = {
            id: parseInt(expense.id),
          };

          const result = await deleteExpenseMutation.executeMutation(mutationVars);

          const toastSeverity = result.error ? 'error' : 'success';
          const toastSummary = result.error ? 'Error' : 'Success';
          const toastDetail = result.error ? result.error.graphQLErrors[0].message : 'Successfully deleted expense';

          toast.add({
            severity: toastSeverity,
            summary: toastSummary,
            detail: toastDetail,
            life: 5000,
          });

          expenses.value.splice(index, 1);
        },
      });
    };

    return {
      expenses,
      navigateToCreateExpense,
      navigateToImportPayments,
      navigateToEditExpense,
      navigateToEditPayments,
      deleteExpense,
    };
  },
});
</script>
