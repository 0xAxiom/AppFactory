/**
 * Agent Server Entry Point
 *
 * HTTP server that exposes the AI agent via REST API.
 * Follows Rig-aligned patterns for agent architecture.
 */

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { z } from 'zod';
import { logger } from './lib/logger.js';
import { AppError, handleError } from './lib/errors.js';
import { agentDefinition, processInput } from './agent/definition.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: Date.now() - start,
    });
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    agent: agentDefinition.name,
    version: agentDefinition.version,
    timestamp: new Date().toISOString(),
  });
});

// Process endpoint schema
const ProcessRequestSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  context: z.record(z.string()).optional(),
});

// Process endpoint
app.post('/process', async (req, res) => {
  try {
    // Validate input
    const parsed = ProcessRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Invalid request body',
        400,
        parsed.error.errors
      );
    }

    const { input, context } = parsed.data;

    // Process the input
    const result = await processInput(input, context);

    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const appError = handleError(error);
    res.status(appError.statusCode).json({
      success: false,
      error: {
        code: appError.code,
        message: appError.message,
        details: appError.details,
      },
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Global error handler
app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error('unhandled_error', {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  }
);

// Graceful shutdown
const shutdown = () => {
  logger.info('shutdown', { message: 'Shutting down gracefully...' });
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
app.listen(PORT, () => {
  logger.info('startup', {
    message: `Agent server started`,
    port: PORT,
    agent: agentDefinition.name,
  });
  console.log(`
====================================
  Agent: ${agentDefinition.name}
  Version: ${agentDefinition.version}
  Port: ${PORT}
====================================

Endpoints:
  GET  /health   - Health check
  POST /process  - Process input

Example:
  curl -X POST http://localhost:${PORT}/process \\
    -H "Content-Type: application/json" \\
    -d '{"input": "Hello!"}'
  `);
});
