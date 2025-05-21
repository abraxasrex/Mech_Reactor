"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// Register a new user
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.User.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return res.status(400).json({
                error: 'User with this email or username already exists'
            });
        }
        // Create new user
        const user = new User_1.User({ username, email, password });
        yield user.save();
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: 'Error creating user' });
    }
}));
// Login user
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Find user
        const user = yield User_1.User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }
        // Check password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    }
    catch (error) {
        res.status(400).json({ error: 'Error logging in' });
    }
}));
// Get current user
router.get('/me', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
}));
// Logout (client-side only, just need to remove token)
router.post('/logout', auth_1.auth, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});
exports.default = router;
