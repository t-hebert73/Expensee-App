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
              <li v-for="expense in expenses" :key="expense.title">
                {{ expense.title }}
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
import { getExpenseeApi } from '@/libs/api';
import Message from 'primevue/message';

import type Expense from '../../../shared-types/Expense';

export default {
  name: 'DashboardView',

  components: { Message },

  setup() {
    const auth = authStore();
    let expenses = ref<Expense[]>([]);
    let errorMessage = ref('');

    const fetchExpenses = async () => {
      try {
        const api = getExpenseeApi();

        const response = await api.fetchExpenses();
        expenses.value = response.data;
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
