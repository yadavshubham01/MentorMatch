import { Request, Response } from 'express';
import prisma from '../config/db';

function isErrorWithMessage(error: unknown): error is Error {
    return error instanceof Error;
  }

export const sendConnectionRequest = async (req: Request, res: Response) => {
  const { receiverId } = req.body;
  const senderId = (req as any).user.userId;
  
  
  try {
   
    const connection = await prisma.connection.create({
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
    const notifications= await prisma.notification.create({
        data: {
          userId: receiverId, // Receiver gets the notification
          content: `User ${senderId} has sent you a connection request.`,
        },
      });
    res.status(201).json({connection,notifications});
  } catch (error) {
    if (isErrorWithMessage(error)) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
  }
};

export const getConnectionRequests = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId; // Extract user ID from token
  
    try {
      const requests = await prisma.connection.findMany({
        where: {
          receiverId: userId,
          status: 'pending', // Only get pending connection requests
        },
        include: {
          sender: true, // Include sender information
        },
      });
  
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve connection requests' });
    }
  };

export const acceptConnectionRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const connection = await prisma.connection.update({
      where: { id: Number(id) },
      data: { status: 'accepted' },
    });
    res.status(200).json(connection);
  } catch (error) {
    res.status(404).json({ error: 'Connection request not found' });
  }
};

export const rejectConnectionRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const connection = await prisma.connection.update({
      where: { id: Number(id) },
      data: { status: 'rejected' },
    });
    res.status(200).json(connection);
  } catch (error) {
    res.status(404).json({ error: 'Connection request not found' });
  }
};
