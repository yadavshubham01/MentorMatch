"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationsByUserId = exports.createNotification = void 0;
const db_1 = __importDefault(require("../config/db"));
const createNotification = async (userId, message) => {
    const result = await db_1.default.query(`INSERT INTO notifications (user_id, message, created_at)
     VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id`, [userId, message]);
    return result.rows[0];
};
exports.createNotification = createNotification;
const getNotificationsByUserId = async (userId) => {
    const result = await db_1.default.query(`SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
    return result.rows;
};
exports.getNotificationsByUserId = getNotificationsByUserId;
//# sourceMappingURL=notificationModel.js.map