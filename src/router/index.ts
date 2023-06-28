import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import { authStore } from '@/stores/auth';

const PublicLayout = () =>
  import(
    /* webpackChunkName: 'public' */ '@/components/layouts/PublicLayout.vue'
  );
const PrivateLayout = () =>
  import(
    /* webpackChunkName: 'private' */ '@/components/layouts/PrivateLayout.vue'
  );

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      redirect: { name: 'login' },
    },
    {
      path: '',
      component: PublicLayout,
      meta: {
        requiresAuth: false,
        redirectIfAuth: true,
      },
      children: [
        {
          name: 'login',
          path: '/login',
          component: LoginView,
        },
        {
          name: 'signup',
          path: '/signup',
          component: SignupView,
        },
      ],
    },
    {
      path: '',
      component: PrivateLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: {
            title: 'Dashboard',
          },
        },
        {
          path: '/manage',
          name: 'manage',
          component: () => import('@/views/ManageExpensesView.vue'),
          meta: {
            title: 'Manage Expenses',
          },
        },
        {
          path: '/manage/new',
          name: 'create.expense',
          component: () => import('@/views/ManageExpenseView.vue'),
          meta: {
            title: 'Create Expense',
          },
        },
        {
          path: '/manage/:id',
          name: 'edit.expense',
          component: () => import('@/views/ManageExpenseView.vue'),
          meta: {
            title: 'Edit Expense',
          },
        },
        {
          path: '/manage/:id/payments',
          name: 'manage.payments',
          component: () => import('@/views/ManagePaymentsView.vue'),
          meta: {
            title: 'Manage Payments',
          },
        },
        {
          path: '/manage/:id/payments/new',
          name: 'create.payment',
          component: () => import('@/views/ManagePaymentView.vue'),
          meta: {
            title: 'Create Payment',
          },
        },
        {
          path: '/manage/:id/payments/:paymentId',
          name: 'edit.payment',
          component: () => import('@/views/ManagePaymentView.vue'),
          meta: {
            title: 'Edit Payment',
          },
        },
        {
          path: '/expenses/:id',
          name: 'view.expense',
          component: () => import('@/views/ExpenseDetailsView.vue'),
          meta: {
            title: 'View Expense',
          },
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'login' } },
  ],
});

router.beforeEach(async (to, from) => {
  const auth = authStore();

  if (to.meta.requiresAuth) {
    if (!auth.isLoggedIn) {
      return { name: 'login' };
    }
  } else {
    if (to.meta.redirectIfAuth && auth.isLoggedIn) {
      return { name: 'dashboard' };
    }
  }
});

export default router;
