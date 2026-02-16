import { sign } from 'jsonwebtoken';
import { User } from '../generated/prisma/client';

export const generateAccessToken = (user: User): string => {
    return sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: User): string => {
    return sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};

// ============================================================
// TOKEN BLACKLIST
// ============================================================
// Currently using an in-memory Set for revoked refresh tokens.
// This has two limitations:
//
// 1. Server restart clears the blacklist — logged-out tokens
//    become valid again until they naturally expire.
//
// 2. Does not scale — if you run multiple server instances
//    (e.g., behind a load balancer), each instance has its
//    own Set, so a token revoked on one instance is still
//    accepted by another.
//
// PRODUCTION TODO: Replace with Redis
// ---------------------------------------------------------------
// 1. Install Redis client:
//    npm install ioredis
//
// 2. Create a Redis connection (e.g., src/config/redis.ts):
//    import Redis from 'ioredis';
//    const redis = new Redis(process.env.REDIS_URL);
//    export default redis;
//
// 3. Replace revokeToken():
//    export async function revokeToken(token: string): Promise<void> {
//        // Use the token's remaining TTL so it auto-cleans from Redis
//        const decoded = decode(token) as { exp: number };
//        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
//        if (ttl > 0) {
//            await redis.set(`revoked:${token}`, '1', 'EX', ttl);
//        }
//    }
//
// 4. Replace isTokenRevoked():
//    export async function isTokenRevoked(token: string): Promise<boolean> {
//        const result = await redis.get(`revoked:${token}`);
//        return result !== null;
//    }
//
// 5. Update controller/auth.ts to await the now-async functions:
//    if (await isTokenRevoked(refreshToken)) { ... }
//    await revokeToken(refreshToken);
//
// 6. Add REDIS_URL to .env:
//    REDIS_URL=redis://localhost:6379
//
// 7. Add Redis to docker-compose.yml:
//    services:
//      redis:
//        image: redis:7-alpine
//        ports:
//          - '6379:6379'
//        restart: unless-stopped
// ============================================================

const revokedTokens = new Set<string>();

export function revokeToken(token: string): void {
    revokedTokens.add(token);
}

export function isTokenRevoked(token: string): boolean {
    return revokedTokens.has(token);
}