<template>
  <div class="page-signup">
    <section class="grid grid-nogutter">
      <div class="col-4 col-offset-4 p-5 signup-form">
        <h1 class="mb-5">Sign up for an account</h1>

        <form class="">
          <Message
            v-if="errorMessage"
            severity="error"
            @close="errorMessage = ''"
          >
            {{ errorMessage }}
          </Message>
          <div class="field">
            <label for="name">Full Name</label>
            <InputText id="name" type="text" v-model="registerData.fullName" />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <InputText id="email" type="email" v-model="registerData.email" />
          </div>
          <div class="field">
            <label for="password">Password</label>
            <InputText
              id="password"
              type="password"
              v-model="registerData.password"
            />
          </div>
          <div class="field">
            <label for="confirm_password">Confirm Password</label>
            <InputText
              id="confirm_password"
              type="password"
              v-model="registerData.confirmPassword"
            />
          </div>

          <Button
            type="submit"
            @click.prevent="register"
            class="p-button-primary mt-5"
            rounded
          >
            Register
          </Button>
        </form>
        <Toast position="top-left" group="tl" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { RegisterDocument } from '@/graphql/generated';
import { useMutation } from '@urql/vue';
import { defineComponent, computed, ref } from 'vue';
import { authStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

export default defineComponent({
  name: 'SignupView',

  components: { InputText, Button, Message, Toast },

  setup() {
    const auth = authStore();
    const router = useRouter();
    const toast = useToast();
    const registerMutation = useMutation(RegisterDocument);
    const validationErrorMsg = ref<string>();

    const registerData = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    const register = async () => {
      try {
        await auth.register(registerMutation, registerData);

        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Account created, you can login',
          life: 5000,
        });

        router.push({
          name: 'login',
        });
      } catch (error: any) {
        validationErrorMsg.value = error.message;
      }
    };

    const errorMessage = computed(() => {
      return auth.alert?.message
        ? auth.alert.message
        : validationErrorMsg.value;
    });

    return {
      registerData,
      errorMessage,
      register,
      user: auth.user,
    };
  },
});
</script>

<style lang="scss" scoped>
.signup-form {
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
