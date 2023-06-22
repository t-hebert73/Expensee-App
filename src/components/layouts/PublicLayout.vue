<template>
  <header>
    <div class="grid grid-nogutter align-items-center">
      <div class="col-6 col-offset-2">
        <div class="logo">
          <router-link :to="{ name: 'login' }">
            <img src="@/assets/logo-dark.png" alt="expensee logo" />
          </router-link>
        </div>
      </div>

      <div class="col-2">
        <div class="flex justify-content-end flex-wrap h-full">
          <router-link :to="{ name: 'signup' }" v-slot="{ navigate }">
            <Button @click="navigate" rounded class="p-button-secondary">
              Sign up
            </Button>
          </router-link>

          <router-link :to="{ name: 'login' }" v-slot="{ navigate }">
            <Button @click="navigate" rounded class="p-button-link">
              Sign in
            </Button>
          </router-link>
        </div>
      </div>
    </div>
  </header>

  <div class="page">
    <router-view></router-view>
  </div>

  <Toast position="bottom-right" />
</template>

<script lang="ts">
import Button from 'primevue/button';
import { defineComponent } from 'vue';
import Toast from 'primevue/toast';

export default defineComponent({
  name: 'PublicLayout',
  components: { Button, Toast },
});
</script>

<style lang="scss" scoped>
header {
  .logo {
    padding: 1rem 3.5rem 1rem 0;

    img {
      max-width: 250px;
      max-height: 50px;
      vertical-align: middle;
    }

    a {
      color: var(--vt-c-black);
      display: inline-block;
    }
  }

  .nav-link {
    color: var(--vt-c-black);
    text-decoration: none;
    font-size: 1.1rem;
    padding: 1rem;
    margin-right: 1rem;
    display: inline-block;
  }

  .p-button.p-button-link:enabled {
    color: var(--vt-c-black);
    font-weight: 600;
    margin-left: 1rem;

    &:hover {
      color: var(--vt-c-black);
    }
  }
}

.page {
  min-height: calc(100vh - 72px);
  background-color: var(--vt-c-blue);
  padding: 6rem 0 7.2rem;
}
</style>
