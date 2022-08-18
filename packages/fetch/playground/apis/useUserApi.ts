import { defineRegistApi, typedUrl } from '@vue-async/fetch';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
};

export const useUserApi = defineRegistApi('user', {
  apis: {
    getUsers: typedUrl<User[]>`get /users`,
    getUser: typedUrl<User, { id: string | number }>`/user/${'id'}`,
    addUser: typedUrl<User, any, Partial<Omit<User, 'id'>>>`post /user`,
  },
  prefix: 'http://localhost:7009',
});
