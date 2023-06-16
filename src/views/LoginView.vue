<template>
  <div class="page-login">
    <section class="grid grid-nogutter">
      <div class="col-4 col-offset-4 p-5 login-form">
        <h1 class="mb-5">Sign in</h1>

        <form class="">
          <Message
            v-if="errorMessage"
            severity="error"
            @close="errorMessage = ''"
          >
            {{ errorMessage }}
          </Message>
          <div class="field">
            <label for="email">Email</label>
            <InputText id="email" type="email" v-model="email" />
          </div>
          <div class="field">
            <label for="password">Password</label>
            <InputText id="password" type="password" v-model="password" />
          </div>

          <div>
            {{ jwtObj.tokens }}
          </div>

          <Button
            type="submit"
            @click.prevent="login"
            class="p-button-primary mt-5"
          >
            Sign in
          </Button>
        </form>
      </div>
    </section>

    <section class="grid grid-nogutter" v-if="data">
      <div
        class="col-4 col-offset-4 p-5"
        v-for="user in data.users"
        :key="user.email"
      >
        <h3>{{ user.name }}</h3>
        <div>id: {{ user.id }}</div>
        <div>created: {{ user.createdAt }}</div>
        <div class="mt-5">
          <h5>Expenses</h5>
          <div
            class="expense"
            v-for="expense in user.expenses"
            :key="'exp' + expense.name"
          >
            {{ expense.name }} - {{ expense.category }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';

import { defineComponent, ref } from 'vue';
import { authStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import jwt from '../libs/jwt';
import { useQuery } from '@urql/vue';
import { GetUsersDocument } from '@/graphql/generated';

export default defineComponent({
  name: 'LoginView',

  components: { InputText, Button, Message },

  setup() {
    const auth = authStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    let errorMessage = ref('');
    const jwtObj = jwt;

    const login = async () => {
      try {
        await auth.login(email.value, password.value);

        router.push({
          name: 'dashboard',
        });
      } catch (error: any) {
        errorMessage.value = error.data.message;
      }
    };

    const result = useQuery({
      query: GetUsersDocument,
    });

    return {
      email,
      password,
      errorMessage,
      login,
      user: auth.user,
      jwtObj,
      data: result.data,
    };
  },
});
</script>

<style lang="scss" scoped>
.login-form {
  background-color: white;
  box-shadow: 0 2px 1px -1px #0003, 0 1px 1px 0 #00000024, 0 1px 3px 0 #0000001f;
  border-radius: 6px;
}

.field * {
  display: block;
  width: 95%;
}

.right-inner {
  padding: 2rem;
  text-align: center;
}

img {
  max-width: 100%;
}
</style>
