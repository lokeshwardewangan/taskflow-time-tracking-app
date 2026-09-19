import express from 'express';
import type { Request, Response } from 'express';
import 'dotenv/config';

const app = express();
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
    try {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});


export default app;