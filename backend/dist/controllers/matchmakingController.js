"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMentorshipMatches = void 0;
const db_1 = __importDefault(require("../config/db"));
const findMentorshipMatches = async (req, res) => {
    const { userId } = req.user; // Extract user ID from token
    try {
        const userProfile = await db_1.default.user.findUnique({
            where: { id: userId },
            include: { skills: true, interests: true }, // Ensure 'skills' and 'interests' are valid in your Prisma schema
        });
        if (!userProfile) {
            return res.status(404).json({ error: 'User not found' });
        }
        const matches = await db_1.default.user.findMany({
            where: {
                AND: [
                    { NOT: { id: userId } },
                    {
                        OR: [
                            {
                                skills: {
                                    some: {
                                        id: {
                                            in: userProfile.skills.map(skill => skill.id),
                                        },
                                    },
                                },
                            },
                            {
                                interests: {
                                    some: {
                                        id: {
                                            in: userProfile.interests.map(interest => interest.id),
                                        },
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            include: { skills: true, interests: true },
        });
        res.status(200).json(matches);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to find matches' });
    }
};
exports.findMentorshipMatches = findMentorshipMatches;
//# sourceMappingURL=matchmakingController.js.map