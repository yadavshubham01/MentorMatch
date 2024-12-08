"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const matchmakingController_1 = require("../controllers/matchmakingController");
const router = (0, express_1.Router)();
//@ts-ignore
router.get('/matches', authMiddleware_1.authenticate, matchmakingController_1.findMentorshipMatches);
exports.default = router;
//# sourceMappingURL=matchmakingRoutes.js.map