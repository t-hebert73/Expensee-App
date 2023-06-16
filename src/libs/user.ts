class User {
  name: string = '';
  email: string = '';

  constructor(userInfo?: Partial<User>) {
    Object.assign(this, userInfo);
  }
}

export { User };
