<template>
  <router-view v-slot="{ Component }">
    <component :is="Component"> </component>
    <Toast />
  </router-view>
</template>

<script lang="ts">
import { Client, provideClient, cacheExchange, fetchExchange } from '@urql/vue';
import { authExchange } from '@urql/exchange-auth';
import jwt from './libs/jwt';
import { authStore } from './stores/auth';
import Toast from 'primevue/toast';

export default {
  name: 'App',

  components: { Toast },

  setup() {
    const auth = authStore();

    const client = new Client({
      url: import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql',
      exchanges: [
        cacheExchange,
        authExchange(async (utils) => {
          return {
            addAuthToOperation(operation) {
              const token = jwt.getAccessToken();
              if (!token) return operation;
              return utils.appendHeaders(operation, {
                Authorization: `Bearer ${token}`,
              });
            },
            didAuthError(error) {
              return error.graphQLErrors.some(
                (e) => e.extensions?.code === 'FORBIDDEN'
              );
            },
            async refreshAuth() {
              auth.forceLogout();
            },
          };
        }),
        fetchExchange,
      ],
    });

    provideClient(client);
  },
};
</script>
