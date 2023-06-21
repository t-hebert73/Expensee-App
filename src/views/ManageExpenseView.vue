<template>
  <ExpenseForm :expense="expense"></ExpenseForm>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import ExpenseForm from '@/components/ExpenseForm.vue';
import { useQuery } from '@urql/vue';
import { GetExpenseDocument, Expense } from '@/graphql/generated';

export default defineComponent({
  setup() {
    const router = useRouter();
    const id =
      typeof router.currentRoute.value.params.id === 'string'
        ? router.currentRoute.value.params.id
        : null;

    const expense = ref<Expense | null>(null);

    const fetchExpense = async (id: number) => {
      const query = useQuery({
        query: GetExpenseDocument,
        variables: {
          id,
        },
      });

      const result = await query.executeQuery();

      if (result.data.value?.expense) {
        expense.value = result.data.value?.expense;
      }
    };

    if (id) fetchExpense(parseInt(id));

    return { expense };
  },
  components: { ExpenseForm },
});
</script>
