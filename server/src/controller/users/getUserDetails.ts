import { Request, Response } from 'express';
import prisma from '../../prisma';

export default async function getUserDetails(req: Request, res: Response) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
    });

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const { hashedPassword, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
}