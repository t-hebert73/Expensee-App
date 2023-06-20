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
  </div>
</template>

<script lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';

import { computed, defineComponent, ref } from 'vue';
import { authStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import jwt from '../libs/jwt';
import { LoginDocument } from '@/graphql/generated';
import { useMutation } from '@urql/vue';

export default defineComponent({
  name: 'LoginView',

  components: { InputText, Button, Message },

  setup() {
    const auth = authStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const jwtObj = jwt;

    const loginMutation = useMutation(LoginDocument);
    let validationErrorMsg = '';

    const login = async () => {
      try {
        await auth.login(loginMutation, email.value, password.value);

        router.push({
          name: 'dashboard',
        });
      } catch (error: any) {
        validationErrorMsg = error.message;
      }
    };

    const errorMessage = computed(() => {
      return auth.alert?.message ? auth.alert.message : validationErrorMsg;
    });

    return {
      email,
      password,
      errorMessage,
      login,
      user: auth.user,
      jwtObj,
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
