import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import partPositionsRouter from './routes/partPositions';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'YOUR_PRODUCTION_DOMAIN' // Replace this in production
        : 'http://localhost:3001', // React dev server port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/mecha_reactor';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB, at uri: ', mongoURI))
  .catch(err => console.error(`MongoDB connection error at URI ${mongoURI}: `, err));

// Define the build directory path relative to the current file
const buildDir = path.join(__dirname, '../../mecha-reactor/build');

console.log("Build Directory:", buildDir); // Log the build directory path

// API Routes go here - these need to come first
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

app.use('/api/auth', authRouter);
app.use('/api/part-positions', partPositionsRouter);

// Serve static files from the React app
app.use('/', express.static(buildDir));

// Catch all other routes and return the index.html file
app.get('*dont_remove_me', (req, res) => {
  const indexPath = path.join(buildDir, 'index.html');
  res.sendFile(indexPath);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});