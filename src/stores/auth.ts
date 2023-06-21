import { defineStore } from 'pinia';
import jwt from '../libs/jwt';
import router from '../router';
import {
  User,
  LoginMutationVariables,
  LoginInput,
  LoginMutation,
} from '@/graphql/generated';
import { UseMutationResponse } from '@urql/vue';

type IAlert = {
  message: string;
};

type AuthState = {
  user: User;
  alert: IAlert | null;
};

const userDefault: User = {
  id: '-1',
  email: '',
  name: '',
  createdAt: '',
};

export const authStore = defineStore('auth', {
  state: (): AuthState => {
    return {
      user: {
        ...userDefault,
      },
      alert: null,
    };
  },

  getters: {
    isLoggedIn(state): boolean {
      return state.user.id !== '-1' ? true : false;
    },
  },
  actions: {
    async login(
      loginMutation: UseMutationResponse<LoginMutation>,
      inputEmail: string,
      inputPassword: string
    ) {
      const loginInput: LoginInput = {
        email: inputEmail,
        password: inputPassword,
      };
      const loginVars: LoginMutationVariables = {
        loginInput: loginInput,
      };

      const result = await loginMutation.executeMutation(loginVars);

      if (result.error) {
        throw new Error(result.error.graphQLErrors[0].message);
      }

      if (
        !result.data?.login?.jwt?.access ||
        !result.data?.login?.jwt?.refresh
      ) {
        throw new Error('Something went wrong');
      }

      this.alert = null;
      jwt.setAccessToken(result.data?.login?.jwt?.access);
      jwt.setRefreshToken(result.data?.login?.jwt?.refresh);

      const user = result.data?.login?.user ?? {};

      this.user = {
        ...user,
      };
    },

    forceLogout(): void {
      this.alert = {
        message: 'Your session has expired, please relogin.',
      };

      setTimeout(() => {
        this.alert = null;
      }, 20000);

      this.logout();
    },

    logout(): void {
      this.user = {
        ...userDefault,
      };
      jwt.clearTokens();

      router.push({
        name: 'login',
      });
    },
  },
});
