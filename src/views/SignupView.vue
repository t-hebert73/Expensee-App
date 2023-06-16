<template>
  <div class="page-signup">
    <section class="grid grid-nogutter">
      <div class="col-4 col-offset-4 p-5 signup-form">
        <h1 class="mb-5">Sign up for an account</h1>

        <form class="">
          <div class="field">
            <label for="name">Name</label>
            <InputText id="name" type="text" />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <InputText id="email" type="email" />
          </div>
          <div class="field">
            <label for="password">Password</label>
            <InputText id="password" type="password" />
          </div>
          <div class="field">
            <label for="confirm_password">Confirm Password</label>
            <InputText id="confirm_password" type="password" />
          </div>

          <Button class="p-button-primary mt-5">Sign up</Button>
        </form>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
  name: 'SignupView',

  components: { InputText, Button },
  data() {
    return {
      email: '',
      password: '',
    };
  },

  async mounted() { },
};
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
