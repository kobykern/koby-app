import { Request, Response } from 'express';
import prisma from '../../prisma';

declare global {
    namespace Express {
        interface Request {
            user?: { id: number };
        }
    }
}

export async function getMyDetails(req: Request, res: Response) {
    const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
    });

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
}

export async function getUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany();
    const usersWithoutPassword = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPassword);
}

export async function getUserDetails(req: Request, res: Response) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
    });

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
}