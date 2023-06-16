import { ExpenseeApi, type ApiResponse } from './api';
import jwt from './jwt';

class AuthApi extends ExpenseeApi {
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.expenseeFetch(this.apiUrl + 'login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const json: AuthResponse = await response.json();

    jwt.setAccessToken(json.accessToken);
    jwt.setRefreshToken(json.refreshToken);

    const result = {
      data: json,
      response: response,
    };

    return response.ok ? Promise.resolve(result) : Promise.reject(result);
  }
}

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    name: string;
    email: string;
  };
};

const getAuthApi = function () {
  const authApi = new AuthApi();

  return authApi;
};

export { getAuthApi };
