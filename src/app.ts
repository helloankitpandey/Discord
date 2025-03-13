import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import userRoutes from '@routes/user.routes';
import { Config } from '@config/config';

config();

export const app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/user', userRoutes);

app.listen(Config.PORT, () => {
    console.log('Successfully Running ', Config.PORT);
});
