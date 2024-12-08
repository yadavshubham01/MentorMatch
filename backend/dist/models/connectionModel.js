"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConnectionRequestStatus = exports.getConnectionRequestsByUserId = exports.createConnectionRequest = void 0;
const db_1 = __importDefault(require("../config/db"));
const notificationModel_1 = require("./notificationModel");
const createConnectionRequest = async (senderId, receiverId) => {
    const result = await db_1.default.query(`INSERT INTO connection_requests (sender_id, receiver_id, status)
     VALUES ($1, $2, 'pending') RETURNING id`, [senderId, receiverId]);
    return result.rows[0];
};
exports.createConnectionRequest = createConnectionRequest;
const getConnectionRequestsByUserId = async (userId) => {
    const result = await db_1.default.query(`SELECT * FROM connection_requests
     WHERE receiver_id = $1 AND status = 'pending'`, [userId]);
    return result.rows;
};
exports.getConnectionRequestsByUserId = getConnectionRequestsByUserId;
const updateConnectionRequestStatus = async (requestId, status) => {
    const result = await db_1.default.query(`UPDATE connection_requests SET status = $1 WHERE id = $2 RETURNING *`, [status, requestId]);
    const updatedRequest = result.rows[0];
    if (updatedRequest) {
        // Send notification to the receiver
        const receiverId = updatedRequest.receiver_id;
        const message = status === 'accepted' ? 'Your connection request has been accepted.' : 'Your connection request has been declined.';
        await (0, notificationModel_1.createNotification)(receiverId, message);
    }
    return updatedRequest;
};
exports.updateConnectionRequestStatus = updateConnectionRequestStatus;
//# sourceMappingURL=connectionModel.js.map