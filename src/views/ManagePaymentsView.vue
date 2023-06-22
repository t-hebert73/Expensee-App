<template>
  <div class="page-manage">
    <section class="grid grid-nogutter">
      <div class="col-12">
        <PaymentsTable v-if="expense" :expense="expense"></PaymentsTable>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import PaymentsTable from '@/components/payments/PaymentsTable.vue';
import { useQuery } from '@urql/vue';
import { GetExpenseWithPaymentsDocument, Expense } from '@/graphql/generated';

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
        query: GetExpenseWithPaymentsDocument,
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
  components: { PaymentsTable },
});
</script>
