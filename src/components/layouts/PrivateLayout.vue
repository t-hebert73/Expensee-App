<template>
  <div class="layout-container">
    <div class="layout-sidebar">
      <div class="nav-section logo">
        <router-link :to="{ name: 'dashboard' }">
          <img src="@/assets/logo-light.png" alt="expensee logo" />
        </router-link>
      </div>

      <div class="nav-section">
        <Menu id="overlay_menu2" ref="side-nav" :model="sideNavItems" />
      </div>
    </div>

    <div class="layout-main">
      <header>
        <div class="grid grid-nogutter align-items-center">
          <div class="col-12 p-3">
            <div class="flex justify-content-between flex-wrap h-full">
              <div class="page-title">
                <span>{{ pageTitle }}</span>
              </div>
              <a href="#" @click.prevent="toggle" class="user">
                {{ user.name }}
              </a>
              <Menu
                id="overlay_menu"
                ref="menu"
                :model="dropdownItems"
                :popup="true"
              />
            </div>
          </div>
        </div>
      </header>

      <div class="page">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import type { Ref } from 'vue';
import { authStore } from '@/stores/auth';
import Menu from 'primevue/menu';
import type MenuType from 'primevue/menu/Menu';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PrivateLayout',
  components: { Menu },

  setup() {
    const auth = authStore();
    const router = useRouter();

    const dropdownItems = [
      {
        label: 'Sign out',
        icon: 'pi pi-sign-out',
        command: () => {
          auth.logout();
        },
      },
    ];

    const menu: Ref<MenuType | null> = ref(null);

    const toggle = (event: Event) => {
      if (menu.value !== null) menu.value.toggle(event);
    };

    const sideNavItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-pie',
        command: () => {
          router.push({
            name: 'dashboard',
          });
        },
      },
      {
        label: 'Manage',
        icon: 'pi pi-book',
        command: () => {
          router.push({
            name: 'manage',
          });
        },
      },
    ];

    const pageTitle = computed(() => {
      return router.currentRoute.value.meta.title;
    });

    return {
      user: auth.user,
      dropdownItems,
      toggle,
      menu,
      sideNavItems,
      pageTitle,
    };
  },
});
</script>

<style lang="scss">
.layout-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.layout-sidebar {
  flex-grow: 0;
  flex-shrink: 0;
  width: 300px;
  background-color: var(--vt-c-blue);

  .nav-section {
    color: var(--vt-c-white);

    &.logo {
      padding: 0.7rem 1.5rem;
      border-bottom: 1px solid var(--vt-c-blue-dark);
    }

    img {
      max-width: 100%;
      vertical-align: middle;
    }
  }

  .p-menu {
    margin-top: 1rem;
    background-color: transparent;
    border: none;
    width: 100%;

    .p-menuitem {
      &-link {
        padding: 1.2rem 2rem;

        .p-menuitem-icon {
          margin-right: 1rem;
        }

        .p-menuitem-icon,
        .p-menuitem-text {
          color: white;
          font-size: 1.2rem;
          font-weight: 600;
        }

        &:hover {
          background-color: var(--vt-c-blue-dark);

          .p-menuitem-icon,
          .p-menuitem-text {
            color: white;
          }
        }
      }
    }
  }
}

.layout-main {
  flex-grow: 1;
  flex-shrink: 1;
  background-color: var(--vt-c-soft-white);
  overflow: scroll;
}

header {
  background-color: var(--vt-c-white);

  .page-title {
    font-size: 1.5rem;
  }

  .user {
    color: var(--vt-c-black);
    text-decoration: none;
    font-size: 1rem;
    padding: 0.5rem;
    margin-right: 1rem;
    display: inline-block;
  }
}

.page {
  padding: 2rem;
}
</style>
