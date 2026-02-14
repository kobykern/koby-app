import { Request, Response } from 'express';
import { CreateUserRequest } from '../types/createUser';
import { hash } from 'bcrypt';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { User } from '../generated/prisma/client';

import prisma from '../prisma';

// ------------ //
//      JWT     //
// ------------ //
const generateJwt = (user: User): string => {
    return sign({email: user.email}, 'JWT_SECRET_KEY');
}

// ------------ //
//     LOGIN    //
// ------------ //
export async function loginUser(req: Request<CreateUserRequest>, res: Response) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: req.body.email },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        // Remove password from the response //
        const { password: _password, name: _name, ...userWithoutPassword } = user;
        res.json({ ...userWithoutPassword, token: generateJwt(user) });

    } catch (error) {
        res.json({ message: 'Email or Password is incorrect', error });
    }
}

// ------------ //
// REGISTRATION //
// ------------ //
export async function createUser(req: Request<CreateUserRequest>, res: Response) {
    const { name, email } = req.body;
    const hashedPassword = await hash(req.body.password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // Remove password from the response //
    const {password: _password, ...userWithoutPassword} = user;

    res.status(201).json({...userWithoutPassword, token: generateJwt(user)});
}



// ------------ //
//  USER LOGIC  //
// ------------ //

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
        return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
}