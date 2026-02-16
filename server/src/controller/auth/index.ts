import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import { verify } from 'jsonwebtoken';
import { CreateUserRequest } from '../../types/createUser';
import { generateAccessToken, generateRefreshToken, revokeToken, isTokenRevoked } from '../../config/jwt';
import prisma from '../../prisma';

// ------------ //
// REGISTRATION //
// ------------ //
export async function register(req: Request<CreateUserRequest>, res: Response) {
    try {
        const { name, email } = req.body;
        const hashedPassword = await hash(req.body.password, 10);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const { password: _password, ...userWithoutPassword } = user;

        res.status(201).json({
            ...userWithoutPassword,
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user),
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: 'Error creating user' });
    }
}

// ------------ //
//     LOGIN    //
// ------------ //
export async function login(req: Request<CreateUserRequest>, res: Response) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: req.body.email },
        });

        if (!user) {
            res.status(401).json({ message: 'Email or Password is incorrect' });
            return;
        }

        const isPasswordValid = await compare(req.body.password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Email or Password is incorrect' });
            return;
        }

        const { password: _password, name: _name, ...userWithoutPassword } = user;

        res.json({
            ...userWithoutPassword,
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user),
        });
    } catch (error) {
        res.status(401).json({ message: 'Email or Password is incorrect' });
    }
}

// ------------ //
//   REFRESH    //
// ------------ //
export async function refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token required' });
        return;
    }

    // PRODUCTION TODO: change to `if (await isTokenRevoked(refreshToken))`
    // when switching to Redis (see config/jwt.ts for details)
    if (isTokenRevoked(refreshToken)) {
        res.status(401).json({ message: 'Token has been revoked' });
        return;
    }

    try {
        const decoded = verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: number; email: string };

        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
        });

        if (!user) {
            res.status(401).json({ message: 'User no longer exists' });
            return;
        }

        // PRODUCTION TODO: change to `await revokeToken(refreshToken)`
        // when switching to Redis (see config/jwt.ts for details)
        revokeToken(refreshToken);

        res.json({
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user),
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
}

// ------------ //
//    LOGOUT    //
// ------------ //
export async function logout(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (refreshToken) {
        // PRODUCTION TODO: change to `await revokeToken(refreshToken)`
        // when switching to Redis (see config/jwt.ts for details)
        revokeToken(refreshToken);
    }

    res.json({ message: 'Logged out successfully' });
}