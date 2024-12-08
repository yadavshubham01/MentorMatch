"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectConnectionRequest = exports.acceptConnectionRequest = exports.getConnectionRequests = exports.sendConnectionRequest = void 0;
const db_1 = __importDefault(require("../config/db"));
function isErrorWithMessage(error) {
    return error instanceof Error;
}
const sendConnectionRequest = async (req, res) => {
    const { receiverId } = req.body;
    const senderId = req.user.userId;
    try {
        const connection = await db_1.default.connection.create({
            data: {
                sender: {
                    connect: { id: senderId },
                },
                receiver: {
                    connect: { id: receiverId },
                },
                status: 'pending',
            },
        });
        const notifications = await db_1.default.notification.create({
            data: {
                userId: receiverId, // Receiver gets the notification
                content: `User ${senderId} has sent you a connection request.`,
            },
        });
        res.status(201).json({ connection, notifications });
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
exports.sendConnectionRequest = sendConnectionRequest;
const getConnectionRequests = async (req, res) => {
    const userId = req.user.userId; // Extract user ID from token
    try {
        const requests = await db_1.default.connection.findMany({
            where: {
                receiverId: userId,
                status: 'pending', // Only get pending connection requests
            },
            include: {
                sender: true, // Include sender information
            },
        });
        res.status(200).json(requests);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve connection requests' });
    }
};
exports.getConnectionRequests = getConnectionRequests;
const acceptConnectionRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await db_1.default.connection.update({
            where: { id: Number(id) },
            data: { status: 'accepted' },
        });
        res.status(200).json(connection);
    }
    catch (error) {
        res.status(404).json({ error: 'Connection request not found' });
    }
};
exports.acceptConnectionRequest = acceptConnectionRequest;
const rejectConnectionRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await db_1.default.connection.update({
            where: { id: Number(id) },
            data: { status: 'rejected' },
        });
        res.status(200).json(connection);
    }
    catch (error) {
        res.status(404).json({ error: 'Connection request not found' });
    }
};
exports.rejectConnectionRequest = rejectConnectionRequest;
//# sourceMappingURL=connectionController.js.map