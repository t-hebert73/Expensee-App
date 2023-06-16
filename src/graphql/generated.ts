import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type Expense = {
  __typename?: 'Expense';
  category: Scalars['String'];
  createdAt: Scalars['Date'];
  frequency: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  payments: Array<Payment>;
  provider: Scalars['String'];
  user: User;
};

export type ExpenseInput = {
  category: Scalars['String'];
  frequency: Scalars['String'];
  name: Scalars['String'];
  provider: Scalars['String'];
};

/** Jwt token */
export type JwtToken = {
  __typename?: 'JwtToken';
  access: Scalars['String'];
  refresh: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

/** Resulting jwt and user information */
export type LoginResult = {
  __typename?: 'LoginResult';
  jwt: JwtToken;
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  createExpense: Expense;
  login: LoginResult;
  updateExpense: Expense;
};


export type MutationCreateExpenseArgs = {
  expenseInput: ExpenseInput;
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationUpdateExpenseArgs = {
  expenseInput: ExpenseInput;
  id: Scalars['Int'];
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float'];
  createdAt: Scalars['Date'];
  expense: Expense;
  id: Scalars['ID'];
  paidAt: Scalars['Date'];
};

export type Query = {
  __typename?: 'Query';
  expenses: Array<Expense>;
  users: Array<User>;
};


export type QueryExpensesArgs = {
  category?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Date'];
  email: Scalars['String'];
  expenses: Array<Expense>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name: string, email: string, createdAt: any, expenses: Array<{ __typename?: 'Expense', category: string, frequency: string, name: string, provider: string }> }> };


export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"expenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;