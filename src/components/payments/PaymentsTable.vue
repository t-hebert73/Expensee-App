<template>
  <Card v-if="expense">
    <template #content>
      <div class="flex gap-2 justify-content-between mb-5">
        <div>
          Create, edit and remove your payments for {{ expense.name }} -
          {{ expense.category }}.
        </div>
        <Button
          @click="navigateToCreatePayment"
          rounded
          label="New Payment"
        ></Button>
      </div>
      <DataTable
        :value="payments"
        stripedRows
        tableStyle="width: 100%; border-spacing: 0; border-collapse: initial;"
      >
        <Column field="amount" header="Amount">
          <template #body="slotProps">
            {{ CADFormatter.format(slotProps.data.amount) }}
          </template></Column
        >
        <Column field="paidAt" header="Paid On"></Column>
        <Column field="action" header="Action" style="width: 350px">
          <template #body="{ data, index }">
            <Button
              @click="navigateToEditPayment(data)"
              label="Edit"
              rounded
              size="small"
              class="mr-3"
            ></Button>
            <Button
              @click="deletePayment($event, data, index)"
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
import { ref, defineComponent, PropType } from 'vue';
import { useMutation } from '@urql/vue';
import ConfirmPopup from 'primevue/confirmpopup';
import {
  Expense,
  Payment,
  DeletePaymentDocument,
  DeletePaymentMutationVariables,
} from '@/graphql/generated';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

export default defineComponent({
  name: 'PaymentsTable',

  components: { DataTable, Column, Card, Button, ConfirmPopup },

  props: {
    expense: {
      type: Object as PropType<Expense>,
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();
    const payments = ref<Payment[]>([]);
    const toast = useToast();

    payments.value = props.expense.payments?.length
      ? props.expense.payments
      : [];

    payments.value = payments.value?.sort((a, b) => {
      return a.paidAt < b.paidAt ? -1 : 1;
    });

    const navigateToCreatePayment = () => {
      router.push({
        name: 'create.payment',
        params: {
          id: props.expense.id,
        },
      });
    };

    const navigateToEditPayment = (payment: Payment) => {
      router.push({
        name: 'edit.payment',
        params: {
          id: props.expense.id,
          paymentId: payment.id,
        },
      });
    };

    const deletePaymentMutation = useMutation(DeletePaymentDocument);
    const confirm = useConfirm();

    const deletePayment = async (
      event: any,
      payment: Payment,
      index: number
    ) => {
      confirm.require({
        target: event.currentTarget,
        message: 'Do you want to delete this record?',
        acceptIcon: 'pi pi-trash',
        acceptClass: 'p-button-danger',
        accept: async () => {
          const mutationVars: DeletePaymentMutationVariables = {
            id: parseInt(payment.id),
          };

          const result = await deletePaymentMutation.executeMutation(
            mutationVars
          );

          const toastSeverity = result.error ? 'error' : 'success';
          const toastSummary = result.error ? 'Error' : 'Success';
          const toastDetail = result.error
            ? result.error.graphQLErrors[0].message
            : 'Successfully deleted payment';

          toast.add({
            severity: toastSeverity,
            summary: toastSummary,
            detail: toastDetail,
            life: 5000,
          });

          payments.value.splice(index, 1);
        },
      });
    };

    const CADFormatter = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    });

    return {
      payments,
      navigateToCreatePayment,
      navigateToEditPayment,
      deletePayment,
      CADFormatter,
    };
  },
});
</script>
