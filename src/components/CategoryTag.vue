<template>
  <Tag v-if="expense.category" class="ml-3" :value="expense.category" :severity="severity"></Tag>
</template>

<script lang="ts">
import Tag from 'primevue/tag';
import { Expense } from '@/graphql/generated';
import { PropType, computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'CategoryTag',

  components: { Tag },

  props: {
    expense: {
      type: Object as PropType<Expense>,
      required: true,
    },
  },

  setup(props) {
    const colourMap = [
      {
        category: 'Utilities',
        severity: 'primary',
      },
      {
        category: 'Mortgages',
        severity: 'danger',
      },
      {
        category: 'Taxes',
        severity: 'warning',
      },
      {
        category: 'Insurances',
        severity: 'success',
      },
    ];

    const severity = computed(() => {
      return colourMap.find((colour) => colour.category === props.expense.category)?.severity;
    });

    return { severity };
  },
});
</script>
