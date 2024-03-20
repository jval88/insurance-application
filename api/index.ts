import express, { Request, Response } from 'express';
import routes from './routes';
import cors from 'cors';

const PORT = 5000;

const app = express();

app.use(cors());

app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
    res.json({ message: 'pong' });
});

app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
