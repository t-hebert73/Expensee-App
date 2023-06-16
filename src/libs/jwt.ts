interface IJwtTokens {
  accessToken: null | string;
  refreshToken: null | string;
}

class Jwt {
  apiKey: string;
  tokens: IJwtTokens;

  constructor() {
    this.apiKey = import.meta.env.VITE_API_KEY ?? '';
    this.tokens = {
      accessToken: window.localStorage.getItem('accessToken') ?? null,
      refreshToken: window.localStorage.getItem('refreshToken') ?? null,
    };
  }

  setAccessToken(token: string) {
    window.localStorage.setItem('accessToken', token);
  }

  getAccessToken() {
    return window.localStorage.getItem('accessToken');
  }

  setRefreshToken(token: string) {
    window.localStorage.setItem('refreshToken', token);
  }

  getRefreshToken() {
    return window.localStorage.getItem('refreshToken');
  }

  clearTokens() {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  }
}

export default new Jwt();
