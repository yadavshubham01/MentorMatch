"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markNotificationAsRead = exports.getNotifications = exports.createNotification = void 0;
const db_1 = __importDefault(require("../config/db"));
const createNotification = async (req, res) => {
    const { userId, content } = req.body; // Ensure that 'content' is extracted from the request body
    try {
        const notification = await db_1.default.notification.create({
            data: {
                userId: userId, // Assuming this userId is valid and exists in the User table
                content: content, // Match the field name from the schema
            },
        });
        res.status(201).json(notification);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create notification' });
    }
};
exports.createNotification = createNotification;
// Fetch all notifications for a specific user
const getNotifications = async (req, res) => {
    const userId = req.user.userId; // Extract user ID from token
    try {
        const notifications = await db_1.default.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }, // Order notifications by creation date
        });
        res.status(200).json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve notifications' });
    }
};
exports.getNotifications = getNotifications;
// Mark a specific notification as read
const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await db_1.default.notification.update({
            where: { id: Number(id) },
            data: { read: true },
        });
        res.status(200).json(notification);
    }
    catch (error) {
        res.status(404).json({ error: 'Notification not found' });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
// Delete a specific notification
const deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        await db_1.default.notification.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: 'Notification deleted successfully' });
    }
    catch (error) {
        res.status(404).json({ error: 'Notification not found' });
    }
};
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=notificationController.js.map