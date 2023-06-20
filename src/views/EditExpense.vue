<template>
  Expense {{ id }}

  <ExpenseForm></ExpenseForm>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import ExpenseForm from '@/components/ExpenseForm.vue';

export default defineComponent({
  setup() {
    const router = useRouter();
    const id = ref(router.currentRoute.value.params.id);
    return { id };
  },
  components: { ExpenseForm },
});
</script>
