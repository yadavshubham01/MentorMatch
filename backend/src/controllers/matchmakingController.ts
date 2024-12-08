import { Request, Response } from 'express';
import prisma from '../config/db';

export const findMentorshipMatches = async (req: Request, res: Response) => {
  const { userId } = (req as any).user; // Extract user ID from token
  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: { skills: true, interests: true }, // Ensure 'skills' and 'interests' are valid in your Prisma schema
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    const matches = await prisma.user.findMany({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to find matches' });
  }
};
