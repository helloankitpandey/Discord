import { HttpStatusCode } from '../enum/http.enum';
import { PrismaClient } from '@prisma/client';
// import kafkProducer from 'util/kafka.util';

const prisma = new PrismaClient();

// crated user
export const createUser = async (req: any, res: any) => {
    try {
        const { name, password, email, phoneNo, bio } = req.body;
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: email,
                        isDeleted: false,
                    },
                    {
                        phoneNo: phoneNo,
                        isDeleted: false,
                    },
                ],
            },
        });

        if (existingUser) {
            return res
                .status(HttpStatusCode.BadRequest)
                .json({ error: 'User already exists' });
        }

        const user = await prisma.user.create({
            data: { name, password, email, phoneNo, bio },
        });
        // await kafkProducer(KafkaTopic.user)(user.id, JSON.stringify(user));
        res.status(HttpStatusCode.Created).json(user);
    } catch (error) {
        res.status(HttpStatusCode.BadRequest).json({
            error: error.message,
        });
    }
};

// get All user
export const getAllUser = async (req: any, res: any) => {
    try {
        const user = await prisma.user.findMany({
            where: { isDeleted: false },
        });
        res.status(HttpStatusCode.Ok).json({ data: [...user] });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(HttpStatusCode.InternalServerError).json({
            error: error.message,
        });
    }
};

// get single user by ID
export const getSingleUser = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id, isDeleted: false },
        });
        if (!user)
            return res
                .status(HttpStatusCode.NotFound)
                .json({ error: 'User not found' });
        res.status(HttpStatusCode.Ok).json(user);
    } catch (error) {
        res.status(HttpStatusCode.InternalServerError).json({
            error: error.message,
        });
    }
};

// updated user by their id
export const updateUser = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { name, password, email, phoneNo, bio } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { id, isDeleted: false },
        });

        if (!existingUser) {
            res.status(HttpStatusCode.NotFound).json({
                error: 'User not found',
            });
            return;
        }
        const user = await prisma.user.update({
            where: { id },
            data: { name, password, email, phoneNo, bio },
        });
        res.status(HttpStatusCode.Accepted).json(user);
    } catch (error) {
        res.status(HttpStatusCode.BadRequest).json({
            error: error.message,
        });
    }
};

// deleteUser by id
export const deleteUser = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const existingUser = await prisma.user.findUnique({
            where: { id, isDeleted: false },
        });

        if (!existingUser) {
            return res
                .status(HttpStatusCode.NotFound)
                .json({ error: 'User not found' });
        }
        await prisma.user.update({
            where: { id },
            data: { isDeleted: true },
        });

        res.status(HttpStatusCode.NoContent).json({
            message: 'User deleted Succesfully',
        });
    } catch (error) {
        res.status(HttpStatusCode.InternalServerError).json({
            error: error.message,
        });
    }
};
