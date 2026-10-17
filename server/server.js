import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import { setupSocket } from './socket/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins in dev for seamless connection
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({ origin: '*' }));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);
app.use(morgan('dev'));

// Setup Socket.IO Collaboration
setupSocket(io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/boards', boardRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Note It API & Whiteboard Server',
    version: '1.0.0',
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Note It Server running on port ${PORT}`);
  console.log(`🎨 Whiteboard Socket.IO engine initialized`);
  console.log(`📝 Notes & Auth API active`);
  console.log(`===============================================`);
});
