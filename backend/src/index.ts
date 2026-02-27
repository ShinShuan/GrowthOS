import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leadsRouter from './routes/leads';
import pdfRouter from './routes/pdf';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:19006', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/leads', leadsRouter);
app.use('/api/pdf', pdfRouter);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 GrowthOS Backend running on http://localhost:${PORT}`);
});

export default app;
