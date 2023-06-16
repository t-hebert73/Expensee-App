// src/types.ts

import type { GetUsersQuery } from './graphql/generated';

export type Expense = GetUsersQuery['users'][0]['expenses'][0];
export type User = GetUsersQuery['users'][0];
