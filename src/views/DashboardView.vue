<template>
  <div class="page-signup">
    <section class="grid grid-nogutter">
      <div class="col-10">
        <h1 class="mb-5">Dashboard</h1>

        <div class="mt-5">
          <h2>Current Expenses</h2>

          <Message
            v-if="errorMessage"
            severity="error"
            @close="errorMessage = ''"
          >
            {{ errorMessage }}
          </Message>

          <div class="expenses" v-else>
            <ul>
              <li v-for="expense in expenses" :key="expense.name">
                {{ expense.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { authStore } from '@/stores/auth';
import Message from 'primevue/message';

import { useQuery } from '@urql/vue';
import { GetExpensesDocument, Expense } from '@/graphql/generated';

export default {
  name: 'DashboardView',

  components: { Message },

  setup() {
    const auth = authStore();
    let expenses = ref<Expense[]>([]);
    let errorMessage = ref('');

    const fetchExpenses = async () => {
      try {
        const query = useQuery({
          query: GetExpensesDocument,
        });

        const result = await query.executeQuery();

        if (result.data.value?.expenses) {
          expenses.value = result.data.value?.expenses;
        }


        if (result.error.value) {
          console.log(result.error.value.graphQLErrors[0].extensions?.code);
          errorMessage.value = result.error.value.graphQLErrors[0].message;
        }
          
      } catch (error: any) {
        if (error.data) errorMessage.value = error.data.message;
      }
    };

    fetchExpenses();

    return { user: auth.user, expenses, errorMessage };
  },
};
</script>

<style lang="scss" scoped></style>
