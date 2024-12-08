"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/nsg', authMiddleware_1.authenticate, notificationController_1.getNotifications);
router.put('/read/:id', authMiddleware_1.authenticate, notificationController_1.markNotificationAsRead);
router.delete('/:id', authMiddleware_1.authenticate, notificationController_1.deleteNotification);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map