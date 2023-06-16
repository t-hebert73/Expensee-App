import { defineStore } from 'pinia';
import { getAuthApi } from '@/libs/authApi';
import { User } from '@/libs/user';
import jwt from '../libs/jwt';
import router from '../router';

type AuthState = {
  user: User;
};

export const authStore = defineStore('auth', {
  state: (): AuthState => {
    return {
      user: new User(),
    };
  },

  getters: {
    isLoggedIn(state): boolean {
      return state.user.email ? true : false;
    },
  },
  actions: {
    async login(email: string, password: string) {
      const api = getAuthApi();
      const response = await api.login(email, password);

      this.user = new User(response.data.user);
    },

    logout(): void {
      this.user = new User();
      jwt.clearTokens();

      router.push({
        name: 'login',
      });
    },
  },
});
