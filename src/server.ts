import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db';
import userRoutes from './modules/users/user.routes';
import recursoRoutes from './modules/recursos/recurso.routes';
import estadisticaRoutes from './modules/estadisticas/estadistica.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/recursos', recursoRoutes);
app.use('/api/estadisticas', estadisticaRoutes);

// Basic health check route
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Welcome to the Digital Community Library API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Database test connection route
app.get('/test-db', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT 1 as test');
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to database',
      error: error.message
    });
  }
});


// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
