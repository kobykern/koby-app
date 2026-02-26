import { Request, Response } from 'express';
import prisma from '../../prisma';

declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}

export default async function getMyDetails(req: Request, res: Response) {
    const user = await prisma.user.findUnique({
        where: { id: Number(req.user!.id) },
    });

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const { hashedPassword, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
}