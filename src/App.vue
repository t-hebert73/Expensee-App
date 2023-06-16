<template>
  <router-view v-slot="{ Component }">
    <component :is="Component"> </component>
  </router-view>
</template>

<script lang="ts">
import { Client, provideClient, cacheExchange, fetchExchange } from '@urql/vue';

export default {
  name: 'App',

  setup() {
    console.log(import.meta.env.VITE_API_URL);
    const client = new Client({
      url: import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql',
      exchanges: [cacheExchange, fetchExchange],
    });

    provideClient(client);
  },
};
</script>
