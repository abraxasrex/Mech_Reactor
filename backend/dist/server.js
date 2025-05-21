"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const partPositions_1 = __importDefault(require("./routes/partPositions"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? 'YOUR_PRODUCTION_DOMAIN' // Replace this in production
        : 'http://localhost:3001', // React dev server port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express_1.default.json());
// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/mecha_reactor';
mongoose_1.default.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB, at uri: ', mongoURI))
    .catch(err => console.error(`MongoDB connection error at URI ${mongoURI}: `, err));
// Define the build directory path relative to the current file
const buildDir = path_1.default.join(__dirname, '../../mecha-reactor/build');
console.log("Build Directory:", buildDir); // Log the build directory path
// API Routes go here - these need to come first
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend is running!' });
});
app.use('/api/auth', auth_1.default);
app.use('/api/part-positions', partPositions_1.default);
// Serve static files from the React app
app.use('/', express_1.default.static(buildDir));
// Catch all other routes and return the index.html file
app.get('*dont_remove_me', (req, res) => {
    const indexPath = path_1.default.join(buildDir, 'index.html');
    res.sendFile(indexPath);
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
