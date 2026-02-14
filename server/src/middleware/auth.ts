import {Request, Response, NextFunction} from 'express';
import { User } from '../generated/prisma/browser';
import { verify } from 'jsonwebtoken';

import prisma from '../prisma';

export interface ExpressRequest extends Request {
    user?: User
}

export const authenticate = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
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
        const decode = verify(token, 'JWT_SECRET_KEY') as { email: string };

        const user = await prisma.user.findUnique({
            where: { email: decode.email },
        });

        req.user = user || undefined;
        next();

    } catch (error) {
        req.user = undefined;
        res.status(401).json({ message: 'Invalid token' });
    }

}