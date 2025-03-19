import { AnyZodObject, z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const zodValidation =
    (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
            return;
        } catch (error) {
            res.status(400).json({
                error: error.message,
            });
            return;
        } finally {
            // console.log('finally');
        }
    };
