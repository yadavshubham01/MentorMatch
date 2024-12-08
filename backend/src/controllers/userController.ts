import { Request, Response } from 'express';
import prisma from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../utils/validators';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


function isErrorWithMessage(error: unknown): error is Error {
  return error instanceof Error;
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    registerSchema.parse(req.body);
    const { email, password, name, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role },
    });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({user,token});
  } catch (error) {
    if (isErrorWithMessage(error)) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    loginSchema.parse(req.body);
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (error) {
    if (isErrorWithMessage(error)) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const profile = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {
          skills: true,  // Include related skills
          interests: true,  // Include related interests
        },
      });
  
      if (!profile) {
        throw new Error('Profile not found');
      }
  
      res.status(200).json(profile);
    } catch (error) {
      if (isErrorWithMessage(error)) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  };
  

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
      const { userId } = (req as any).user;
      const { name, role, bio, skills, interests } = req.body;
  
      // Update the user profile
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          role,
          bio,
          skills: {
            deleteMany: {}, // Clears existing skills
            create: skills.map((skill: string) => ({ name: skill })),
          },
          interests: {
            connectOrCreate: interests.map((interest: string) => ({
                where: { name: interest }, // Assuming `name` is a unique field
                create: { name: interest },
              })),
          },
        },
        include: {
          skills: true,
          interests: true,
        },
      });
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  };
  
  
export const getUsers = async (req: Request, res: Response) => {
    try {
      const { role, skills, interests } = req.query;
  
      const filters: any = {};
      if (role) {
        filters.role = role;
      }
  
      const users = await prisma.user.findMany({
        where: filters,
        include: {
          skills: true, // Include related skills
          interests: true, // Include related interests
        },
      });
  
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
};
  

  