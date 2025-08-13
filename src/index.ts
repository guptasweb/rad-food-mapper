// Core imports and API documentation setup
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { router as apiRouter } from './routes';
import swaggerUi from 'swagger-ui-express';
import openapi from '../openapi.json';

// Initialize the Express app and global middleware
const app = express();
app.use(cors());
app.use(express.json());

// Mount application routes and API docs
app.use('/api', apiRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi as any));

// Lightweight health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Centralized error handler to return JSON errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start the HTTP server unless running in test mode
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

// Export the app for testing
export default app;

