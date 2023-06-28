<template>
  <div class="flex justify-content-between">
    <Calendar
      v-model="selectedDates"
      selectionMode="range"
      dateFormat="mm/yy"
      view="month"
      :manualInput="false"
      :hideOnRangeSelection="true"
      placeholder="Date Range"
    />
    <div class="text-2xl text-900">{{ title }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import Calendar from 'primevue/calendar';
import moment from 'moment';

export default defineComponent({
  name: 'DateRangeSelector',

  emits: ['datesSelected'],

  components: { Calendar },

  setup(_, { emit }) {
    const selectedDates = ref<Date[] | null>(null);

    watch(
      () => selectedDates.value,
      (selectedDates) => {
        if (!selectedDates || !selectedDates[0] || !selectedDates[1]) return;

        const selected = {
          start: moment(selectedDates[0]).format('YYYY-MM-DD'),
          end: moment(selectedDates[1]).format('YYYY-MM-DD'),
        };
        emit('datesSelected', selected);
      }
    );

    const title = computed(() => {
      if (!selectedDates.value || !selectedDates.value[0] || !selectedDates.value[1]) return 'All Data';
      return `${moment(selectedDates.value[0]).format('MMM D0 YYYY')} to ${moment(selectedDates.value[1]).format(
        'MMM D0 YYYY'
      )}`;
    });

    return { selectedDates, title };
  },
});
</script>
