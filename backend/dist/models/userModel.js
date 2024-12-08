"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfilesByCriteria = exports.getProfileByUserId = exports.createProfile = exports.findUserByEmail = exports.createUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const createUser = async (email, passwordHash, role) => {
    const result = await db_1.default.query(`INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id`, [email, passwordHash, role]);
    return result.rows[0];
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    const result = await db_1.default.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
};
exports.findUserByEmail = findUserByEmail;
const createProfile = async (userId, name, role, skills, interests) => {
    const result = await db_1.default.query(`INSERT INTO profiles (user_id, name, role, skills, interests) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`, [userId, name, role, skills, interests]);
    return result.rows[0];
};
exports.createProfile = createProfile;
const getProfileByUserId = async (userId) => {
    const result = await db_1.default.query(`SELECT * FROM profiles WHERE user_id = $1`, [userId]);
    return result.rows[0];
};
exports.getProfileByUserId = getProfileByUserId;
const getProfilesByCriteria = async (role, skills, interests) => {
    const result = await db_1.default.query(`SELECT id, name, role, skills, interests
       FROM profiles
       WHERE role != $1
         AND (skills && $2 OR interests && $3)`, [role, skills, interests]);
    return result.rows;
};
exports.getProfilesByCriteria = getProfilesByCriteria;
//# sourceMappingURL=userModel.js.map