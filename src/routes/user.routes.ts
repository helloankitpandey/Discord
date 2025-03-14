import express from 'express';
import {
    createUser,
    deleteUser,
    getAllUser,
    getSingleUser,
    login,
    updateUser,
} from '@controllers/user.controller';
import { zodValidation } from 'middleware/zod.middleware';
import { createDto, getDto, loginDto, updateDto } from 'dto/user.dto';

const userRoutes = express.Router();

// create a new user
userRoutes.post('/create', zodValidation(createDto), createUser);
// login new user
userRoutes.post('/login', zodValidation(loginDto), login);
// get all user
userRoutes.get('/all', getAllUser);
// get user by id
userRoutes.get('/:id', zodValidation(getDto), getSingleUser);
// update user
userRoutes.put('/:id', zodValidation(updateDto), updateUser);
// delete user
userRoutes.delete('/:id', zodValidation(getDto), deleteUser);

export default userRoutes;
