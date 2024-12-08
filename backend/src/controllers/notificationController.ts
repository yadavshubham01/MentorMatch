import { Request, Response } from 'express';
import prisma from '../config/db';



export const createNotification = async (req: Request, res: Response) => {
  const { userId, content } = req.body; // Ensure that 'content' is extracted from the request body

  try {
    const notification = await prisma.notification.create({
      data: {
        userId: userId, // Assuming this userId is valid and exists in the User table
        content: content, // Match the field name from the schema
      },
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};


// Fetch all notifications for a specific user
export const getNotifications = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId; // Extract user ID from token
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }, // Order notifications by creation date
      });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve notifications' });
    }
  };
  
  // Mark a specific notification as read
  export const markNotificationAsRead = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const notification = await prisma.notification.update({
        where: { id: Number(id) },
        data: { read: true },
      });
      res.status(200).json(notification);
    } catch (error) {
      res.status(404).json({ error: 'Notification not found' });
    }
  };
  
  // Delete a specific notification
  export const deleteNotification = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.notification.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(404).json({ error: 'Notification not found' });
    }
  };
  