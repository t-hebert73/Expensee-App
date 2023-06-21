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
  payments?: Maybe<Array<Payment>>;
  provider: Scalars['String'];
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
  createPayment: Payment;
  login: LoginResult;
  register: RegisterResult;
  updateExpense: Expense;
  updatePayment: Payment;
};


export type MutationCreateExpenseArgs = {
  expenseInput: ExpenseInput;
};


export type MutationCreatePaymentArgs = {
  paymentInput: PaymentInput;
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};


export type MutationUpdateExpenseArgs = {
  expenseInput: ExpenseInput;
  id: Scalars['Int'];
};


export type MutationUpdatePaymentArgs = {
  id: Scalars['Int'];
  paymentInput: UpdatePaymentInput;
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float'];
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  paidAt: Scalars['Date'];
};

export type PaymentInput = {
  amount: Scalars['Float'];
  expenseId: Scalars['Int'];
  paidAt: Scalars['Date'];
};

export type Query = {
  __typename?: 'Query';
  expense: Expense;
  expenses: Array<Expense>;
};


export type QueryExpenseArgs = {
  id: Scalars['Int'];
};


export type QueryExpensesArgs = {
  category?: InputMaybe<Scalars['String']>;
};

export type RegisterInput = {
  confirmPassword: Scalars['String'];
  email: Scalars['String'];
  fullName: Scalars['String'];
  password: Scalars['String'];
};

/** Status of registration */
export type RegisterResult = {
  __typename?: 'RegisterResult';
  status: Scalars['String'];
};

export type UpdatePaymentInput = {
  amount: Scalars['Float'];
  paidAt: Scalars['Date'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Date'];
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type GetExpensesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExpensesQuery = { __typename?: 'Query', expenses: Array<{ __typename?: 'Expense', id: string, name: string, frequency: string, category: string, provider: string, createdAt: any }> };

export type GetExpenseQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetExpenseQuery = { __typename?: 'Query', expense: { __typename?: 'Expense', id: string, name: string, frequency: string, category: string, provider: string, createdAt: any } };

export type CreateExpenseMutationVariables = Exact<{
  expenseInput: ExpenseInput;
}>;


export type CreateExpenseMutation = { __typename?: 'Mutation', createExpense: { __typename?: 'Expense', id: string } };

export type UpdateExpenseMutationVariables = Exact<{
  id: Scalars['Int'];
  expenseInput: ExpenseInput;
}>;


export type UpdateExpenseMutation = { __typename?: 'Mutation', updateExpense: { __typename?: 'Expense', id: string } };

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResult', user: { __typename?: 'User', id: string, name: string, email: string, createdAt: any }, jwt: { __typename?: 'JwtToken', access: string, refresh: string } } };


export const GetExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getExpenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetExpensesQuery, GetExpensesQueryVariables>;
export const GetExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetExpenseQuery, GetExpenseQueryVariables>;
export const CreateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expenseInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"expenseInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expenseInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateExpenseMutation, CreateExpenseMutationVariables>;
export const UpdateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expenseInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"expenseInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expenseInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateExpenseMutation, UpdateExpenseMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"loginInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"jwt"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"refresh"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;