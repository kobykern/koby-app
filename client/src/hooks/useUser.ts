// hooks/useUser.ts  ← only state/logic
import { useState, useEffect } from 'react';
import { getMe, getAllUsers } from '../services/user.service';
import { User } from '../types/user';

export function useUser() {
    const [me, setMe] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMe();
    }, []);

    const fetchMe = async () => {
        try {
            setLoading(true);
            const data = await getMe();
            setMe(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { me, users, loading, error, fetchUsers };
}