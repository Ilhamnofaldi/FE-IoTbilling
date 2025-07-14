# Auth Middleware Documentation

## Overview
Middleware autentikasi berbasis token untuk aplikasi IoT Admin. Middleware ini mengelola autentikasi pengguna menggunakan access token dan refresh token.

## API Endpoint
- **Login**: `POST http://34.101.143.2:3000/api/auth/login`
- **Refresh Token**: `POST http://34.101.143.2:3000/api/auth/refresh`

## Request/Response Format

### Login Request
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Login Response
```json
{
  "message": "string",
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "type": "string"
    },
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

## Usage

### 1. AuthContext
Context yang mengelola state autentikasi global:
```typescript
const { user, accessToken, refreshToken, login, logout } = useAuth()
```

### 2. AuthMiddleware
Class untuk mengelola request dengan token:
```typescript
import AuthMiddleware from './authMiddleware'

// Authenticated request
const response = await AuthMiddleware.authenticatedFetch('/api/data', {
  method: 'GET'
})

// Check authentication status
const isAuth = AuthMiddleware.isAuthenticated()
```

### 3. useAuthenticatedFetch Hook
Hook untuk melakukan authenticated fetch:
```typescript
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch'

const { authenticatedFetch } = useAuthenticatedFetch()
const response = await authenticatedFetch('/api/data')
```

### 4. ProtectedRoute Component
Komponen untuk melindungi route yang memerlukan autentikasi:
```typescript
import ProtectedRoute from '../components/ProtectedRoute'

<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

## Features

1. **Automatic Token Management**: Token disimpan di localStorage
2. **Auto Refresh**: Token otomatis di-refresh jika expired
3. **Route Protection**: Halaman dilindungi dengan ProtectedRoute
4. **Error Handling**: Redirect otomatis ke login jika autentikasi gagal
5. **Logout Management**: Pembersihan token saat logout

## Token Storage
- Access Token: `localStorage.getItem('accessToken')`
- Refresh Token: `localStorage.getItem('refreshToken')`

## Error Handling
- 401 Unauthorized: Otomatis mencoba refresh token
- Refresh gagal: Redirect ke halaman login
- Network error: Error di-throw ke caller