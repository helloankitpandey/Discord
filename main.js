import { omit } from 'lodash';

const body = {
    name: 'John Doe',
    password: '12345678',
    email: 'XXXXXXXXXXXXXXXXX',
};

const users = omit(body, ['password']);
console.log(users);
