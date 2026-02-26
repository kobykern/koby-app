import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;

export async function storeTokens(accessToken: string, refreshToken: string) {
    if (!accessToken || !refreshToken) {
        throw new Error('Missing tokens from server response');
    }
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
}

export async function clearTokens() {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
}

export async function logout() {
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    try {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });
    } catch (error) {
        console.error('Logout API error:', error);
    }

    await clearTokens();
}

export async function fetchWithAuth(path: string, options: RequestInit = {}): Promise<Response> {
    let accessToken = await AsyncStorage.getItem('accessToken');

    let response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            ...options.headers,
        },
    });

    if (response.status === 401) {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!refreshToken) {
            throw new Error('SESSION_EXPIRED');
        }

        const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
            await clearTokens();
            throw new Error('SESSION_EXPIRED');
        }

        const tokens = await refreshResponse.json();
        await storeTokens(tokens.accessToken, tokens.refreshToken);

        response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokens.accessToken}`,
                ...options.headers,
            },
        });
    }

    return response;
}