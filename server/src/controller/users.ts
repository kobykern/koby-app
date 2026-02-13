import { Request, Response } from 'express';
import { CreateUserRequest } from '../types/createUser';

export function getUsers(req: Request, res: Response) {
    return [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
    ];
}

export function createUser(req: Request<CreateUserRequest>, res: Response) {
    const { name, email, password } = req.body;


}