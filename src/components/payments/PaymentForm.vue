<template>
  <Card>
    <template #title>Editing Payment for {{ expense.name }}</template>
    <template #content>
      <Message
        v-if="validationErrorMsg"
        severity="error"
        @close="validationErrorMsg = ''"
      >
        {{ validationErrorMsg }}
      </Message>
      <div class="flex flex-column gap-2">
        <label for="amount">Amount</label>
        <InputNumber
          id="amount"
          v-model="activePayment.amount"
          inputId="minmaxfraction"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          placeholder="ex. 99.98"
        />
      </div>

      <div class="flex flex-column gap-2 mt-3">
        <label for="paid_on">Paid On</label>
        <Calendar
          id="paid_on"
          v-model="activePayment.paidAt"
          dateFormat="yy-mm-dd"
          showIcon
          @update:modelValue="formatDate"
        />
      </div>

      <div class="flex gap-2 mt-5">
        <Button
          @click="savePayment"
          rounded
          :label="activePayment.id === '-1' ? 'Create' : 'Save'"
        ></Button>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import Card from 'primevue/card';
import { PropType, defineComponent, ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import {
  Payment,
  CreatePaymentMutationVariables,
  UpdatePaymentDocument,
  CreatePaymentDocument,
  PaymentInput,
  UpdatePaymentMutationVariables,
  CreatePaymentMutation,
  UpdatePaymentMutation,
  Expense,
} from '@/graphql/generated';
import Button from 'primevue/button';
import { UseMutationResponse, useMutation } from '@urql/vue';
import Message from 'primevue/message';

import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    InputNumber,
    Card,
    Button,
    Message,
    Calendar,
  },

  props: {
    expense: {
      type: Object as PropType<Expense>,
      required: true,
    },
    payment: {
      type: Object as PropType<Payment | null>,
    },
  },
  setup(props) {
    const activePayment = ref<Payment>({
      id: '-1',
      amount: 0,
      paidAt: null,
      createdAt: null,
    });
    const toast = useToast();
    const router = useRouter();
    const validationErrorMsg = ref('');

    activePayment.value = props.payment ? props.payment : activePayment.value;

    const createPaymentMutation = useMutation(CreatePaymentDocument);
    const updatePaymentMutation = useMutation(UpdatePaymentDocument);

    const savePayment = async () => {
      const { amount, paidAt } = activePayment.value;

      const successMsg =
        activePayment.value.id === '-1' ? `Created Payment` : `Updated Payment`;

      const paymentInput: PaymentInput = {
        amount,
        paidAt,
      };

      const createPaymentMutationVars: CreatePaymentMutationVariables = {
        expenseId: parseInt(props.expense.id),
        paymentInput,
      };

      const updatePaymentMutationVars: UpdatePaymentMutationVariables = {
        paymentInput,
        id: parseInt(activePayment.value.id),
      };

      const mutation:
        | UseMutationResponse<CreatePaymentMutation>
        | UseMutationResponse<UpdatePaymentMutation> =
        activePayment.value.id === '-1'
          ? createPaymentMutation
          : updatePaymentMutation;

      const mutationVars =
        activePayment.value.id === '-1'
          ? createPaymentMutationVars
          : updatePaymentMutationVars;

      await submitPayment(mutation, mutationVars, successMsg);
    };

    const submitPayment = async (
      mutation:
        | UseMutationResponse<CreatePaymentMutation>
        | UseMutationResponse<UpdatePaymentMutation>,
      mutationVars:
        | CreatePaymentMutationVariables
        | UpdatePaymentMutationVariables,
      successMsg: string
    ) => {
      const result = await mutation.executeMutation(mutationVars);

      const toastSeverity = result.error ? 'error' : 'success';
      const toastSummary = result.error ? 'Error' : 'Success';
      const toastDetail = result.error
        ? result.error.graphQLErrors[0].message
        : successMsg;

      toast.add({
        severity: toastSeverity,
        summary: toastSummary,
        detail: toastDetail,
        life: 5000,
      });

      if (!result.error) {
        onSuccessfulAction();
      }
    };

    const onSuccessfulAction = () => {
      router.push({
        name: 'manage.payments',
        params: {
          id: props.expense.id,
        },
      });
    };

    const formatDate = (modelDateValue: any) => {
      activePayment.value.paidAt = new Date(modelDateValue)
        .toISOString()
        .split('T')[0];
    };

    return {
      activePayment,
      savePayment,
      validationErrorMsg,
      formatDate,
    };
  },
});
</script>

<style lang="sass">
label
  font-weight: 600
</style>
