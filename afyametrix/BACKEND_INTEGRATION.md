# Backend Integration Guide

This document provides comprehensive guidance for integrating AfyaMetrix frontend with a backend API.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Environment Setup](#environment-setup)
- [API Client Configuration](#api-client-configuration)
- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Offline Sync](#offline-sync)
- [File Uploads](#file-uploads)
- [Testing](#testing)
- [Deployment](#deployment)

## Architecture Overview

### Frontend Stack
- **Framework**: Next.js 15 (App Router)
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Custom API client with retry logic
- **Offline Storage**: LocalForage (IndexedDB)
- **Authentication**: JWT-based (configurable)

### Backend Requirements
- RESTful API with JSON responses
- JWT authentication
- File upload support (multipart/form-data)
- CORS configuration for frontend domain
- Rate limiting recommended
- WebSocket support (optional, for real-time features)

### Communication Flow
```
Frontend (Next.js) <-> API Client <-> Backend API <-> Database
                              |
                              v
                     Offline Storage (IndexedDB)
```

## Environment Setup

### 1. Copy Environment File

```bash
cp .env.local.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your backend configuration:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication (if using external service)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# File Storage
AWS_REGION=us-east-1
AWS_S3_BUCKET=afyametrix-photos
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

## API Client Configuration

The API client is located at `lib/api/client.ts` and provides:

- **Automatic authentication** (JWT token injection)
- **Retry logic** for failed requests
- **Error handling** with custom error classes
- **Request/response interceptors**
- **Timeout management**

### Usage Example

```typescript
import { apiClient } from "@/lib/api";

// GET request
const data = await apiClient.get("/users");

// POST request with authentication
const response = await apiClient.post("/cases", payload, {
  requiresAuth: true,
});

// File upload
const formData = new FormData();
formData.append("file", file);
const result = await apiClient.upload("/photos", formData);
```

## Authentication Flow

### 1. Registration Flow

```
User fills signup form
    ↓
POST /auth/signup
    ↓
Backend creates user & sends verification email
    ↓
User clicks verification link
    ↓
POST /auth/verify-email
    ↓
Backend verifies token & returns JWT
    ↓
Frontend stores JWT & redirects to dashboard
```

### 2. Login Flow

```
User enters credentials
    ↓
POST /auth/login
    ↓
Backend validates & returns JWT + user data
    ↓
Frontend stores JWT in localStorage
    ↓
JWT included in all authenticated requests
```

### 3. Token Refresh Flow

```
API request returns 401
    ↓
Frontend calls POST /auth/refresh-token
    ↓
Backend validates refresh token & returns new JWT
    ↓
Retry original request with new token
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/signup
Create new user account.

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+2348012345678",
  "location": "PHC-001",
  "password": "SecurePass123!",
  "role": "CHW"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CHW",
    "location": "PHC-001"
  },
  "message": "Account created successfully",
  "requiresVerification": true
}
```

#### POST /auth/login
Authenticate user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "CHW"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CHW",
    "location": "PHC-001"
  },
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "expiresIn": 86400
}
```

#### POST /auth/verify-email
Verify email address.

**Request:**
```json
{
  "token": "verification_token"
}
```

**Response:**
```json
{
  "message": "Email verified successfully",
  "user": { /* user object */ },
  "token": "jwt_token_here"
}
```

#### POST /auth/forgot-password
Request password reset.

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent",
  "resetTokenSent": true
}
```

#### POST /auth/reset-password
Reset password with token.

**Request:**
```json
{
  "token": "reset_token",
  "newPassword": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "message": "Password reset successfully",
  "success": true
}
```

#### GET /auth/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "CHW",
  "location": "PHC-001"
}
```

### Case Management Endpoints

#### POST /cases
Create single case entry.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "diseaseType": "Cholera",
  "cases": 5,
  "date": "2026-06-28",
  "caseDetails": "3 Case details inserted",
  "comments": "Outbreak in community center",
  "photoIds": ["photo-uuid-1", "photo-uuid-2"]
}
```

**Response:**
```json
{
  "case": {
    "id": "uuid",
    "diseaseType": "Cholera",
    "cases": 5,
    "date": "2026-06-28",
    "worker": "John Doe",
    "status": "synced",
    "caseDetails": "3 Case details inserted",
    "comments": "Outbreak in community center",
    "photos": ["url1", "url2"],
    "createdAt": "2026-06-28T10:30:00Z",
    "updatedAt": "2026-06-28T10:30:00Z"
  },
  "message": "Case created successfully"
}
```

#### POST /cases/bulk
Create multiple case entries.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "entries": [
    {
      "diseaseType": "Cholera",
      "cases": 5,
      "date": "2026-06-28"
    },
    {
      "diseaseType": "Malaria",
      "cases": 8,
      "date": "2026-06-28"
    }
  ]
}
```

**Response:**
```json
{
  "cases": [/* array of created cases */],
  "successCount": 2,
  "failureCount": 0,
  "errors": []
}
```

#### GET /cases
Get all case entries with filters.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): "pending" or "synced"
- `diseaseType` (string): Filter by disease
- `startDate` (string): ISO date
- `endDate` (string): ISO date
- `workerId` (string): Filter by worker

**Response:**
```json
{
  "cases": [/* array of cases */],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

#### GET /cases/:id
Get single case entry.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "diseaseType": "Cholera",
  "cases": 5,
  /* ... other fields ... */
}
```

#### PATCH /cases/:id
Update case entry.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "cases": 7,
  "comments": "Updated count after verification"
}
```

**Response:**
```json
{
  "case": {/* updated case object */},
  "message": "Case updated successfully"
}
```

#### DELETE /cases/:id
Delete case entry.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Case deleted successfully"
}
```

#### POST /cases/photos
Upload photo for case.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file` (File): Image file
- `caseId` (string, optional): Associated case ID

**Response:**
```json
{
  "id": "photo-uuid",
  "url": "https://cdn.example.com/photos/photo-uuid.jpg",
  "filename": "image.jpg",
  "size": 1024000,
  "mimeType": "image/jpeg"
}
```

#### DELETE /cases/photos/:id
Delete photo.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Photo deleted successfully"
}
```

### Dashboard Endpoints

#### GET /dashboard
Get complete dashboard data.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "stats": {
    "todayCases": 47,
    "pendingSync": 3,
    "thisWeek": 218,
    "trend": {
      "value": 15,
      "direction": "up",
      "label": "from yesterday"
    }
  },
  "diseaseBreakdown": [
    {
      "name": "Cholera",
      "count": 48,
      "color": "#7c3aed"
    }
  ],
  "recentEntries": [/* array of recent cases */],
  "alerts": [
    {
      "id": "uuid",
      "type": "warning",
      "title": "Cholera cases up 40%",
      "message": "Port Harcourt Central...",
      "createdAt": "2026-06-28T10:00:00Z",
      "isRead": false
    }
  ]
}
```

#### GET /dashboard/stats
Get statistics only.

**Response:**
```json
{
  "todayCases": 47,
  "pendingSync": 3,
  "thisWeek": 218
}
```

#### GET /dashboard/diseases
Get disease breakdown.

**Response:**
```json
[
  {
    "name": "Cholera",
    "count": 48,
    "color": "#7c3aed"
  }
]
```

#### GET /dashboard/trends
Get trends data for forecasting.

**Query Parameters:**
- `startDate` (required): ISO date
- `endDate` (required): ISO date
- `diseaseType` (optional): Filter by disease
- `location` (optional): Filter by location

**Response:**
```json
{
  "trends": [
    {
      "date": "2026-06-01",
      "count": 15,
      "disease": "Cholera"
    }
  ],
  "forecast": [
    {
      "date": "2026-07-01",
      "predicted": 18,
      "confidence": 0.85
    }
  ]
}
```

#### GET /dashboard/heatmap
Get location-based disease data.

**Query Parameters:**
- `diseaseType` (optional)
- `startDate` (optional)
- `endDate` (optional)

**Response:**
```json
{
  "locations": [
    {
      "latitude": 4.8156,
      "longitude": 7.0498,
      "count": 25,
      "location": "Port Harcourt",
      "disease": "Cholera"
    }
  ]
}
```

## Data Models

### User Model

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "CHW" | "CHL";
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Case Entry Model

```typescript
interface CaseEntry {
  id: string;
  diseaseType: string;
  cases: number;
  date: string;
  worker: string;
  status: "pending" | "synced";
  caseDetails?: string;
  comments?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}
```

## Error Handling

### Error Response Format

All API errors should follow this format:

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": {
      "field": "Additional error details"
    }
  }
}
```

### HTTP Status Codes

- `200 OK`: Successful GET/PATCH request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Frontend Error Handling

The API client automatically handles errors:

```typescript
try {
  await apiClient.post("/cases", data);
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Redirect to login
  } else if (error instanceof NetworkError) {
    // Show offline message
  } else if (error instanceof APIError) {
    // Show error message
    console.error(error.message, error.statusCode);
  }
}
```

## Offline Sync

### Sync Queue Implementation

1. **Store offline actions** in IndexedDB
2. **Monitor connection status**
3. **Auto-sync when online**
4. **Retry failed syncs**

### Sync Flow

```
User creates case offline
    ↓
Store in local IndexedDB
    ↓
Add to sync queue
    ↓
Connection detected
    ↓
Process sync queue
    ↓
POST to /cases for each item
    ↓
Update local status to "synced"
    ↓
Remove from sync queue
```

### Conflict Resolution

- Last-write-wins strategy
- Backend timestamp is authoritative
- Local changes are overwritten on conflict

## File Uploads

### Upload Configuration

Maximum file size: 5MB
Allowed types: JPEG, PNG, WebP, PDF

### Upload Process

```typescript
// 1. Upload photos first
const photoPromises = files.map(file => 
  caseService.uploadPhoto({ file })
);
const photos = await Promise.all(photoPromises);

// 2. Create case with photo IDs
await caseService.createCase({
  diseaseType: "Cholera",
  cases: 5,
  date: "2026-06-28",
  photoIds: photos.map(p => p.id)
});
```

### Storage Recommendations

- **Development**: Local filesystem
- **Production**: AWS S3 / Azure Blob / Cloudinary
- CDN for photo delivery
- Image optimization (thumbnails, compression)

## Testing

### API Integration Tests

```bash
# Start backend API
cd backend && npm start

# Run integration tests
npm run test:integration
```

### Mock API Mode

For testing without backend:

```env
NEXT_PUBLIC_MOCK_API=true
```

### Testing Checklist

- [ ] Authentication flow (signup, login, logout)
- [ ] Case CRUD operations
- [ ] Photo uploads
- [ ] Dashboard data loading
- [ ] Offline sync
- [ ] Error handling
- [ ] Token refresh
- [ ] Rate limiting

## Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables (Production)

Set these in Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://api.yourproduction.com/api
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Backend Requirements

1. **CORS Configuration**
   ```javascript
   app.use(cors({
     origin: 'https://afyametrix.vercel.app',
     credentials: true
   }));
   ```

2. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Higher limits for authenticated users

3. **Security Headers**
   - HTTPS only
   - Secure cookies
   - CSRF protection

4. **Database Indexes**
   - `cases.date`
   - `cases.diseaseType`
   - `cases.status`
   - `cases.worker`
   - `users.email`

### Health Check Endpoint

```
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2026-06-28T10:00:00Z",
  "version": "1.0.0"
}
```

## Support

For questions or issues:
- GitHub Issues: https://github.com/yourusername/Africa_AGT/issues
- Email: support@afyametrix.health
- Documentation: https://docs.afyametrix.health

## License

MIT License - see LICENSE file for details
