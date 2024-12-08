"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const connectionRoutes_1 = __importDefault(require("./routes/connectionRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const matchmakingRoutes_1 = __importDefault(require("./routes/matchmakingRoutes"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Register routes
app.use('/api/users', authRoutes_1.default);
app.use('/api/connections', connectionRoutes_1.default);
app.use('/api', notificationRoutes_1.default);
app.use('/api', matchmakingRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map