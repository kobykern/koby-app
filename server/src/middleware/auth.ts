import { Request, Response, NextFunction } from 'express';
import { User } from '../generated/prisma/browser';
import { verify } from 'jsonwebtoken';
import prisma from '../prisma';

export interface ExpressRequest extends Request {
    user?: User & { id: string };
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.headers.authorization) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token not found' });
        return;
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET!) as { id: number; email: string };

        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
        });

        if (!user) {
            res.status(401).json({ message: 'User no longer exists' });
            return;
        }

        req.user = { ...user, id: String(user.id) };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};