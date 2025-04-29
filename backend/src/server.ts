import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// TODO: change this in prod vs local
const mongoURI = process.env.MONGO_URI || '';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the build directory path relative to the current file
const buildDir = path.join(__dirname, '../../mecha-reactor/build');

console.log("Build Directory:", buildDir); // Log the build directory path

// API Routes go here - these need to come first
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Serve static files from the React app
app.use('/', express.static(buildDir));

// Catch all other routes and return the index.html file
app.get('/*splat', (req, res) => {
  const indexPath = path.join(buildDir, 'index.html');
  res.sendFile(indexPath);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});