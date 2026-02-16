# Koby App — Client

React Native + Expo mobile app with JWT authentication.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) app installed on your phone
- The [server](../server/README.md) running locally

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the `client/` directory:

```env
EXPO_PUBLIC_BACKEND_API_URL=http://YOUR_LOCAL_IP:8000
```

Find your local IP:

**Windows:**
```bash
ipconfig
```

**Mac/Linux:**
```bash
ifconfig
```

Use the **IPv4 address** from your Wi-Fi adapter (e.g., `192.168.1.52`).

> ⚠️ Do NOT use `localhost` or `127.0.0.1` — your phone can't reach your PC with those.

### 3. Start the Expo dev server

```bash
npx expo start --clear
```

### 4. Open on your device

- Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS)
- Make sure your phone and PC are on the **same Wi-Fi network**

## Troubleshooting

### App can't reach the server

1. Confirm the server is running: open `http://YOUR_LOCAL_IP:8000` in your phone's browser
2. If it doesn't load, add a Windows Firewall rule (run as admin):

```bash
netsh advfirewall firewall add rule name="Node Express 8000" dir=in action=allow protocol=TCP localport=8000
```

3. Make sure `.env` has the correct IP — restart Expo after changes:

```bash
npx expo start --clear
```

### Environment variables not loading

Expo requires env vars to be prefixed with `EXPO_PUBLIC_`. After changing `.env`, always restart with `--clear`:

```bash
npx expo start --clear
```

## Project Structure

```
client/
├── App.tsx              ← Navigation setup
├── screens/
│   ├── LoginScreen.tsx  ← Login form
│   ├── RegisterScreen.tsx ← Registration form
│   └── HomeScreen.tsx   ← Main screen (authenticated)
├── utils/
│   └── api.ts           ← Token storage, fetchWithAuth, logout
├── types/
│   └── ui.ts            ← Shared UI types
└── .env                 ← Backend API URL
```

## Auth Flow

1. **Login/Register** → server returns `accessToken` (15m) + `refreshToken` (7d)
2. **Tokens stored** in AsyncStorage
3. **API calls** use `fetchWithAuth()` which auto-refreshes expired tokens
4. **Logout** revokes refresh token on server and clears local storage
5. **Session expired** (7+ days inactive) → redirects to login