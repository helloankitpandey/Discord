import express from 'express';
import {
    createUser,
    deleteUser,
    getAllUser,
    getSingleUser,
    updateUser,
} from '@controllers/user.controller';
import { zodValidation } from 'middleware/zod.middleware';
import { createDto, getDto, updateDto } from 'dto/user.dto';

const userRoutes = express.Router();

// create a new user
userRoutes.post('/', zodValidation(createDto), createUser);
// get all user
userRoutes.get('/', getAllUser);
// get user by id
userRoutes.get('/:id', zodValidation(getDto), getSingleUser);
// update user
userRoutes.put('/:id', zodValidation(updateDto), updateUser);
// delete user
userRoutes.delete('/:id', zodValidation(getDto), deleteUser);

export default userRoutes;
