"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.updateUserProfile = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validators_1 = require("../utils/validators");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
function isErrorWithMessage(error) {
    return error instanceof Error;
}
const registerUser = async (req, res) => {
    try {
        validators_1.registerSchema.parse(req.body);
        const { email, password, name, role } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await db_1.default.user.create({
            data: { email, password: hashedPassword, name, role },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ user, token });
    }
    catch (error) {
        if (isErrorWithMessage(error)) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        validators_1.loginSchema.parse(req.body);
        const { email, password } = req.body;
        const user = await db_1.default.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    }
    catch (error) {
        if (isErrorWithMessage(error)) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};
exports.loginUser = loginUser;
const getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const profile = await db_1.default.user.findUnique({
            where: { id: Number(id) },
            include: {
                skills: true,
                interests: true,
            },
        });
        if (!profile) {
            throw new Error('Profile not found');
        }
        res.status(200).json(profile);
    }
    catch (error) {
        if (isErrorWithMessage(error)) {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { name, role, bio, skills, interests } = req.body;
        const skillData = skills.map((skill) => ({
            name: skill.name,
        }));
        const interestData = interests.map((interest) => ({
            where: { name: interest.name },
            create: { name: interest.name },
        }));
        const updatedUser = await db_1.default.user.update({
            where: { id: userId },
            data: {
                name,
                role,
                bio,
                skills: {
                    deleteMany: {},
                    create: skillData,
                },
                interests: {
                    connectOrCreate: interestData,
                },
            },
            include: {
                skills: true,
                interests: true,
            },
        });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
};
exports.updateUserProfile = updateUserProfile;
const getUsers = async (req, res) => {
    try {
        const { role, skills, interests } = req.query;
        const filters = {};
        if (role) {
            filters.role = role;
        }
        const users = await db_1.default.user.findMany({
            where: filters,
            include: {
                skills: true, // Include related skills
                interests: true, // Include related interests
            },
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
};
exports.getUsers = getUsers;
//# sourceMappingURL=userController.js.map