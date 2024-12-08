"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', userController_1.registerUser);
//@ts-ignore
router.post('/login', userController_1.loginUser);
router.get('/profile/:id', authMiddleware_1.authenticate, userController_1.getUserProfile);
//@ts-ignore
router.put('/profile', authMiddleware_1.authenticate, userController_1.updateUserProfile);
router.get('/users', authMiddleware_1.authenticate, userController_1.getUsers);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map