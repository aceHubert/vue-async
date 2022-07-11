import { defineApi, typedUrl } from '@vue-async/fetch';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
};

export const apiConfig = defineApi({
  getUsers: typedUrl<User[]>`/Users`,
  timeout: typedUrl<string>`/timeout`,
  error400: typedUrl<string>`/error`,
});

export type ApiConfig = typeof apiConfig;
