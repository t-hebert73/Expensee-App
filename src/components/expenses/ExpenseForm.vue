<template>
  <Card>
    <template #title>Editing {{ activeExpense.name }} Expense</template>
    <template #content>
      <Message v-if="validationErrorMsg" severity="error" @close="validationErrorMsg = ''">
        {{ validationErrorMsg }}
      </Message>
      <div class="flex flex-column gap-2">
        <label for="name">Name</label>
        <InputText id="name" type="text" v-model="activeExpense.name" placeholder="ex. Hydro"></InputText>
      </div>
      <div class="flex flex-column gap-2 mt-3">
        <label for="provider">Provider</label>
        <InputText id="provider" type="text" v-model="activeExpense.provider" placeholder="ex. Enbridge"></InputText>
      </div>
      <div class="flex flex-column gap-2 mt-3">
        <label for="name">Category</label>
        <Dropdown
          v-model="activeExpense.category"
          :options="availableCategories"
          optionLabel="name"
          optionValue="value"
          placeholder="Select a Category"
          class="w-full"
        />
      </div>

      <div class="flex flex-column gap-2 mt-3">
        <label>Frequency</label>
        <div class="flex flex-wrap gap-3">
          <div
            v-for="availableFrequency in availableFrequencies"
            :key="availableFrequency.value"
            class="flex align-items-center"
          >
            <RadioButton
              v-model="activeExpense.frequency"
              :inputId="availableFrequency.value"
              :name="availableFrequency.name"
              :value="availableFrequency.value"
            />
            <label :for="availableFrequency.value" class="ml-2">{{ availableFrequency.name }}</label>
          </div>
        </div>
      </div>

      <div class="flex gap-2 mt-5">
        <Button @click="saveExpense" rounded :label="activeExpense.id === '-1' ? 'Create' : 'Save'"></Button>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import Card from 'primevue/card';
import { PropType, defineComponent, ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import Dropdown from 'primevue/dropdown';
import {
  Expense,
  CreateExpenseMutationVariables,
  UpdateExpenseDocument,
  CreateExpenseDocument,
  ExpenseInput,
  UpdateExpenseMutationVariables,
  CreateExpenseMutation,
  UpdateExpenseMutation,
} from '@/graphql/generated';
import Button from 'primevue/button';
import { UseMutationResponse, useMutation } from '@urql/vue';
import Message from 'primevue/message';

import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    InputText,
    Dropdown,
    RadioButton,
    Card,
    Button,
    Message,
  },

  props: {
    expense: {
      type: Object as PropType<Expense | null>,
    },
  },
  setup(props) {
    const activeExpense = ref<Expense>({
      id: '-1',
      name: '',
      category: '',
      createdAt: null,
      provider: '',
      frequency: '',
    });
    const toast = useToast();
    const router = useRouter();
    const validationErrorMsg = ref('');

    watch(
      () => props.expense,
      (expense) => {
        if (expense) activeExpense.value = expense;
      }
    );

    const availableCategories = [
      { name: 'Utility', value: 'Utilities' },
      { name: 'Mortgage', value: 'Mortgages' },
      { name: 'Tax', value: 'Taxes' },
    ];

    const availableFrequencies = [
      { name: 'Weekly', value: 'Weekly' },
      { name: 'Bi-weekly', value: 'Bi-weekly' },
      { name: 'Monthly', value: 'Monthly' },
      { name: 'Bi-monthly', value: 'Bi-monthly' },
      { name: 'Quarterly', value: 'Quarterly' },
      { name: 'Yearly', value: 'Yearly' },
    ];

    const createExpenseMutation = useMutation(CreateExpenseDocument);
    const updateExpenseMutation = useMutation(UpdateExpenseDocument);
    const saveExpense = async () => {
      const { name, provider, category, frequency } = activeExpense.value;

      const expenseInput: ExpenseInput = {
        name,
        provider,
        category,
        frequency,
      };

      const successMsg =
        activeExpense.value.id === '-1'
          ? `Created ${activeExpense.value.name} Expense`
          : `Updated ${activeExpense.value.name} Expense`;

      let mutationVars: CreateExpenseMutationVariables | UpdateExpenseMutationVariables = {
        expenseInput,
      };

      let mutation: UseMutationResponse<CreateExpenseMutation> | UseMutationResponse<UpdateExpenseMutation> =
        createExpenseMutation;

      if (activeExpense.value.id !== '-1') {
        mutationVars = {
          id: parseInt(activeExpense.value.id),
          ...mutationVars,
        };

        mutation = updateExpenseMutation;
      }

      await submitExpense(mutation, mutationVars, successMsg);
    };

    const submitExpense = async (
      mutation: UseMutationResponse<CreateExpenseMutation> | UseMutationResponse<UpdateExpenseMutation>,
      mutationVars: CreateExpenseMutationVariables | UpdateExpenseMutationVariables,
      successMsg: string
    ) => {
      const result = await mutation.executeMutation(mutationVars);

      const toastSeverity = result.error ? 'error' : 'success';
      const toastSummary = result.error ? 'Error' : 'Success';
      const toastDetail = result.error ? result.error.graphQLErrors[0].message : successMsg;

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
        name: 'manage',
      });
    };

    return {
      activeExpense,
      availableCategories,
      availableFrequencies,
      saveExpense,
      validationErrorMsg,
    };
  },
});
</script>

<style lang="sass">
label
  font-weight: 600
</style>
