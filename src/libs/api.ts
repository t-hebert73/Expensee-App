import jwt from './jwt';
import { authStore } from '../stores/auth';
import type Expense from '../../../shared-types/Expense';

const maxRefreshRetries = 2;
class ExpenseeApi {
  apiUrl: String;
  jsonResponse: any = undefined;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL;
  }

  async expenseeFetch(
    url: string,
    fetchOptions: RequestInit
  ): Promise<Response> {
    const options = fetchOptions;
    options.headers = {
      'Content-Type': 'application/json',
    };
    if (jwt.getAccessToken()) {
      options.headers.authorization = 'Bearer ' + jwt.getAccessToken();
    }
    return await fetch(url, options);
  }

  async authorizedFetch(call: Function, retryIndex = 0): Promise<Response> {
    const response = await call();

    if (retryIndex >= maxRefreshRetries)
      return Promise.reject({
        data: 'Max retries hit.',
      });

    if (response.status === 401 && retryIndex < maxRefreshRetries) {
      const json: ErrorResponse = await response.json();
      this.jsonResponse = json;
      if (this.jsonResponse.message === 'Token expired.') {
        const refreshResponse = await this.expenseeFetch(
          this.apiUrl + 'token',
          {
            method: 'POST',
            body: JSON.stringify({
              token: jwt.getRefreshToken(),
            }),
          }
        );

        const json: TokenResponse | ErrorResponse = await refreshResponse.json();
        if ('accessToken' in json) jwt.setAccessToken(json.accessToken);

        if (refreshResponse.status === 403) {
          this.jsonResponse = json;

          const auth = authStore();
          auth.logout();

          return refreshResponse;
        }

        this.jsonResponse = undefined;

        return await this.authorizedFetch(call, retryIndex + 1);
      }
    }

    return response;
  }

  async fetchExpenses(): Promise<ApiResponse<Expense[]>> {
    const response = await this.authorizedFetch(async () =>
      this.expenseeFetch(this.apiUrl + 'expenses', {
        method: 'GET',
      })
    );

    if (this.jsonResponse === undefined) {
      const json: Expense[] = await response.json();
      this.jsonResponse = json;
    }

    const result = {
      data: this.jsonResponse,
      response: response,
    };

    return response.ok ? Promise.resolve(result) : Promise.reject(result);
  }
}

interface ApiResponse<T> {
  data: T;
  meta?: any;
  response: Response;
}

interface ErrorResponse {
  message: string;
}

interface TokenResponse {
  accessToken: string;
}

const getExpenseeApi = function () {
  const expenseeApi = new ExpenseeApi();

  return expenseeApi;
};

export { ExpenseeApi, type ApiResponse, getExpenseeApi };
