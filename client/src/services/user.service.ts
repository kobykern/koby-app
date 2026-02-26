import { fetchWithAuth } from '../utils/api';

export async function getMe() {
    const res = await fetchWithAuth('/api/users/me');
    return res.json();
}

export async function getAllUsers() {
    const res = await fetchWithAuth('/api/users');
    return res.json();
}