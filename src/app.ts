import express from 'express';
import { config } from 'dotenv';
import userRoutes from '@routes/user.routes';
import { Config } from '@config/config';
import { HttpStatusCode } from '@enum/http.enum';

config();

const app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/user', userRoutes);

app.get('/healthz', (req, res) => {
    res.status(HttpStatusCode.Ok).send('OK');
});

app.listen(Config.PORT, () => {
    console.log('Successfully Running ', Config.PORT);
});

export default app;
