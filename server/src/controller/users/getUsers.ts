import { Request, Response } from 'express';
import prisma from '../../prisma';

export default async function getUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany();
    const usersWithoutPassword = users.map(({ hashedPassword, ...user }) => user);
    res.json(usersWithoutPassword);
}