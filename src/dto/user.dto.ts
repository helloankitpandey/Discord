import { z } from 'zod';

export const createDto = z.object({
    body: z.object({
        name: z.string().min(3).max(255),
        password: z.string().min(8).max(255),
        email: z.string().email(),
        phoneNo: z.string().min(10).max(15),
        bio: z.string().min(10).max(255),
    }),
});

export const updateDto = z.object({
    body: z.object({
        name: z.string().min(3).max(255),
        password: z.string().min(8).max(255),
        email: z.string().email(),
        phoneNo: z.string().min(10).max(15),
        bio: z.string().min(10).max(255),
    }),
    params: z.object({
        id: z.string().min(3).max(255),
    }),
});

export const getDto = z.object({
    params: z.object({
        id: z.string().min(3).max(255),
    }),
});
