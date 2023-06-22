<template>
  <PaymentForm
    v-if="expense"
    :expense="expense"
    :payment="payment"
  ></PaymentForm>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import PaymentForm from '@/components/payments/PaymentForm.vue';
import { useQuery } from '@urql/vue';
import {
  GetPaymentDocument,
  Payment,
  Expense,
  GetExpenseDocument,
} from '@/graphql/generated';

export default defineComponent({
  setup() {
    const router = useRouter();
    const id =
      typeof router.currentRoute.value.params.paymentId === 'string'
        ? router.currentRoute.value.params.paymentId
        : null;

    const payment = ref<Payment | null>(null);

    const fetchPayment = async (id: number) => {
      const query = useQuery({
        query: GetPaymentDocument,
        variables: {
          id,
        },
      });

      const result = await query.executeQuery();

      if (result.data.value?.payment) {
        payment.value = result.data.value?.payment;
      }
    };

    if (id) fetchPayment(parseInt(id));

    const expenseId =
      typeof router.currentRoute.value.params.id === 'string'
        ? router.currentRoute.value.params.id
        : null;
    const expense = ref<Expense | null>(null);

    const fetchExpense = async (expenseId: number) => {
      const query = useQuery({
        query: GetExpenseDocument,
        variables: {
          id: expenseId,
        },
      });

      const result = await query.executeQuery();

      if (result.data.value?.expense) {
        expense.value = result.data.value?.expense;
      }
    };

    if (expenseId) fetchExpense(parseInt(expenseId));

    return { payment, expense };
  },
  components: { PaymentForm },
});
</script>
