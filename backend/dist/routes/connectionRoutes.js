"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connectionController_1 = require("../controllers/connectionController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/send', authMiddleware_1.authenticate, connectionController_1.sendConnectionRequest);
router.put('/accepted/:id', connectionController_1.acceptConnectionRequest);
router.put('/rejected/:id', connectionController_1.rejectConnectionRequest);
router.get('/requests', authMiddleware_1.authenticate, connectionController_1.getConnectionRequests);
exports.default = router;
//# sourceMappingURL=connectionRoutes.js.map