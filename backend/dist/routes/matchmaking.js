"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userModel_1 = require("../models/userModel");
const router = express_1.default.Router();
//@ts-ignore
router.get("/matches", authMiddleware_1.authenticateToken, async (req, res) => {
    const user = req.user;
    try {
        const currentUser = await (0, userModel_1.getProfileByUserId)(user.id);
        if (!currentUser) {
            return res.status(404).json({ error: "Profile not found" });
        }
        const matches = await (0, userModel_1.getProfilesByCriteria)(currentUser.role, currentUser.skills, currentUser.interests);
        res.json(matches);
    }
    catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=matchmaking.js.map