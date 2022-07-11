import { defineApi, typedUrl } from '@vue-async/fetch';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
};

export const apiConfig = defineApi({
  getUsers: typedUrl<User[]>`get /users`,
  getUser: typedUrl<User, { id: string | number }>`/user/${'id'}`,
  addUser: typedUrl<User, any, Partial<Omit<User, 'id'>>>`post /user`,
});

export type ApiConfig = typeof apiConfig;
