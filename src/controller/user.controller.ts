import { publishMessage } from 'util/nats.util';
import { HttpStatusCode } from '../enum/http.enum';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Config } from '@config/config';

const prisma = new PrismaClient();

export const createUser = async (req: any, res: any) => {
    try {
        const { name, password, email, phoneNo, bio } = req.body;
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: email,
                    },
                    {
                        phoneNo: phoneNo,
                    },
                ],
            },
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        if (existingUser) {
            if (existingUser.isDeleted) {
                const update_user = await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        isDeleted: false,
                        name,
                        password: hashedPassword,
                        email,
                        phoneNo,
                        bio,
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNo: true,
                        bio: true,
                    },
                });

                return res
                    .status(HttpStatusCode.Ok)
                    .json({ user: update_user });
            } else {
                return res
                    .status(HttpStatusCode.BadRequest)
                    .json({ error: 'User already exists' });
            }
        }
        const user = await prisma.user.create({
            data: { name, password: hashedPassword, email, phoneNo, bio },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                bio: true,
            },
        });
        if (Config.NODE_ENV === 'test')
            await publishMessage('user.created', JSON.stringify({ user }));
        res.status(HttpStatusCode.Created).json({ user });
    } catch (error) {
        res.status(HttpStatusCode.BadRequest).json({
            error: error.message,
        });
    }
};

export const login = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findFirst({
            where: { email, isDeleted: false },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                bio: true,
                password: true,
            },
        });
        if (!user) {
            return res
                .status(HttpStatusCode.NotFound)
                .json({ error: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(HttpStatusCode.Unauthorized)
                .json({ error: 'Invalid password' });
        }
        user.password = '';
        res.status(HttpStatusCode.Ok).json({ user });
    } catch (error) {
        res.status(HttpStatusCode.InternalServerError).json({
            error: error.message,
        });
    }
};

export const getAllUser = async (req: any, res: any) => {
    try {
        const user = await prisma.user.findMany({
            where: { isDeleted: false },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                bio: true,
            },
        });
        res.status(HttpStatusCode.Ok).json({ data: user });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(HttpStatusCode.InternalServerError).json({
            error: error.message,
        });
    }
};

export const getSingleUser = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id, isDeleted: false },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                bio: true,
            },
        });
        if (!user)
            return res
                .status(HttpStatusCode.NotFound)
                .json({ error: 'User not found' });
        res.status(HttpStatusCode.Ok).json({ user });
    } catch (error) {
        res.status(HttpStatusCode.InternalServerError).json({
            error: error.message,
        });
    }
};

export const updateUser = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { name, password, email, phoneNo, bio } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { id, isDeleted: false },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                bio: true,
            },
        });
        if (!existingUser) {
            res.status(HttpStatusCode.NotFound).json({
                error: 'User not found',
            });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updated = {
            id,
            name,
            password: hashedPassword,
            email,
            phoneNo,
            bio,
        };
        const user = await prisma.user.update({
            where: { id },
            data: updated,
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                bio: true,
            },
        });
        res.status(HttpStatusCode.Accepted).json({ user });
    } catch (error) {
        res.status(HttpStatusCode.BadRequest).json({
            error: error.message,
        });
    }
};

export const deleteUser = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const existingUser = await prisma.user.findUnique({
            where: { id, isDeleted: false },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNo: true,
                bio: true,
            },
        });

        if (!existingUser) {
            return res
                .status(HttpStatusCode.NotFound)
                .json({ error: 'User not found' });
        }
        const user = await prisma.user.update({
            where: { id },
            data: { isDeleted: true },
        });

        res.status(HttpStatusCode.Ok).json({
            message: 'User deleted Succesfully',
        });

        await publishMessage('user.deleted', JSON.stringify({ user }));
    } catch (error) {
        res.status(HttpStatusCode.InternalServerError).json({
            error: error.message,
        });
    }
};
