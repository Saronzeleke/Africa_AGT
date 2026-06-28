# AfyaMetrix API Documentation

Complete API reference for frontend-backend integration.

## Base URL

```
Production: https://api.afyametrix.health/api
Development: http://localhost:8000/api
```

## Authentication

All protected endpoints require JWT authentication.

### Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Token Expiration

- **Access Token**: 24 hours
- **Refresh Token**: 7 days

---

## API Reference

### Authentication

#### 1. Sign Up

Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
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

**Validation Rules:**
- `fullName`: Min 3 characters
- `email`: Valid email format
- `phone`: 10-15 digits
- `password`: Min 8 chars, must include uppercase, lowercase, and number
- `role`: "CHW" or "CHL"

**Success Response (201):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CHW",
    "location": "PHC-001"
  },
  "message": "Account created successfully. Please verify your email.",
  "requiresVerification": true
}
```

**Error Responses:**
- `400`: Invalid request data
- `409`: Email already exists

---

#### 2. Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "CHW"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CHW",
    "location": "PHC-001"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

**Error Responses:**
- `400`: Missing required fields
- `401`: Invalid credentials
- `403`: Email not verified

---

#### 3. Verify Email

Verify user email address with token.

**Endpoint:** `POST /auth/verify-email`

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Success Response (200):**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "CHW"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Invalid or expired token
- `404`: User not found

---

#### 4. Forgot Password

Request password reset email.

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset email sent successfully",
  "resetTokenSent": true
}
```

---

#### 5. Reset Password

Reset password using token from email.

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully",
  "success": true
}
```

---

#### 6. Get Current User

Get authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "CHW",
  "location": "PHC-001",
  "createdAt": "2026-06-28T10:00:00Z"
}
```

---

#### 7. Update Profile

Update user profile information.

**Endpoint:** `PATCH /auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "location": "PHC-002"
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@example.com",
  "name": "John Updated",
  "role": "CHW",
  "location": "PHC-002"
}
```

---

#### 8. Refresh Token

Refresh access token using refresh token.

**Endpoint:** `POST /auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "token": "new_access_token",
  "refreshToken": "new_refresh_token",
  "expiresIn": 86400
}
```

---

### Case Management

#### 9. Create Case

Create a single case entry.

**Endpoint:** `POST /cases`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "diseaseType": "Cholera",
  "cases": 5,
  "date": "2026-06-28",
  "caseDetails": "3 Case details inserted",
  "comments": "Outbreak near water source",
  "photoIds": ["photo-uuid-1", "photo-uuid-2"]
}
```

**Validation Rules:**
- `diseaseType`: Required, valid disease name
- `cases`: Required, positive integer
- `date`: Required, ISO date format
- `photoIds`: Optional, array of photo UUIDs

**Success Response (201):**
```json
{
  "case": {
    "id": "case-uuid",
    "diseaseType": "Cholera",
    "cases": 5,
    "date": "2026-06-28",
    "worker": "John Doe",
    "status": "synced",
    "caseDetails": "3 Case details inserted",
    "comments": "Outbreak near water source",
    "photos": [
      "https://cdn.afyametrix.health/photos/photo1.jpg",
      "https://cdn.afyametrix.health/photos/photo2.jpg"
    ],
    "createdAt": "2026-06-28T10:30:00Z",
    "updatedAt": "2026-06-28T10:30:00Z"
  },
  "message": "Case created successfully"
}
```

**Error Responses:**
- `400`: Invalid data
- `401`: Unauthorized
- `422`: Validation errors

---

#### 10. Create Bulk Cases

Create multiple case entries at once.

**Endpoint:** `POST /cases/bulk`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
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

**Success Response (201):**
```json
{
  "cases": [
    {
      "id": "case-uuid-1",
      "diseaseType": "Cholera",
      "cases": 5,
      "date": "2026-06-28",
      "status": "synced"
    },
    {
      "id": "case-uuid-2",
      "diseaseType": "Malaria",
      "cases": 8,
      "date": "2026-06-28",
      "status": "synced"
    }
  ],
  "successCount": 2,
  "failureCount": 0,
  "errors": []
}
```

---

#### 11. Get Cases

Retrieve case entries with filters and pagination.

**Endpoint:** `GET /cases`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page
- `status` (string): Filter by "pending" or "synced"
- `diseaseType` (string): Filter by disease
- `startDate` (string): ISO date, start of date range
- `endDate` (string): ISO date, end of date range
- `workerId` (string): Filter by worker ID

**Example Request:**
```
GET /cases?page=1&limit=10&diseaseType=Cholera&status=synced
```

**Success Response (200):**
```json
{
  "cases": [
    {
      "id": "case-uuid",
      "diseaseType": "Cholera",
      "cases": 5,
      "date": "2026-06-28",
      "worker": "John Doe",
      "status": "synced",
      "createdAt": "2026-06-28T10:30:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

#### 12. Get Single Case

Get details of a specific case.

**Endpoint:** `GET /cases/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "id": "case-uuid",
  "diseaseType": "Cholera",
  "cases": 5,
  "date": "2026-06-28",
  "worker": "John Doe",
  "status": "synced",
  "caseDetails": "3 Case details inserted",
  "comments": "Outbreak near water source",
  "photos": ["url1", "url2"],
  "createdAt": "2026-06-28T10:30:00Z",
  "updatedAt": "2026-06-28T10:30:00Z"
}
```

**Error Responses:**
- `404`: Case not found
- `403`: Forbidden (CHL can view all, CHW can only view own)

---

#### 13. Update Case

Update an existing case entry.

**Endpoint:** `PATCH /cases/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "cases": 7,
  "comments": "Updated count after verification"
}
```

**Success Response (200):**
```json
{
  "case": {
    "id": "case-uuid",
    "cases": 7,
    "comments": "Updated count after verification",
    "updatedAt": "2026-06-28T11:00:00Z"
  },
  "message": "Case updated successfully"
}
```

**Error Responses:**
- `403`: Cannot edit cases created by other users
- `404`: Case not found

---

#### 14. Delete Case

Delete a case entry.

**Endpoint:** `DELETE /cases/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "message": "Case deleted successfully"
}
```

**Error Responses:**
- `403`: Cannot delete cases created by other users
- `404`: Case not found

---

### Photo Management

#### 15. Upload Photo

Upload a photo for a case.

**Endpoint:** `POST /cases/photos`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file` (File, required): Image file
- `caseId` (string, optional): Associated case ID

**File Requirements:**
- Max size: 5MB
- Allowed types: JPEG, PNG, WebP
- Image will be auto-resized and optimized

**Success Response (201):**
```json
{
  "id": "photo-uuid",
  "url": "https://cdn.afyametrix.health/photos/photo-uuid.jpg",
  "filename": "image.jpg",
  "size": 1024000,
  "mimeType": "image/jpeg",
  "createdAt": "2026-06-28T10:30:00Z"
}
```

**Error Responses:**
- `400`: Invalid file type or size
- `413`: File too large

---

#### 16. Delete Photo

Delete a photo.

**Endpoint:** `DELETE /cases/photos/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "message": "Photo deleted successfully"
}
```

---

### Dashboard

#### 17. Get Dashboard Data

Get complete dashboard data (stats, diseases, recent entries, alerts).

**Endpoint:** `GET /dashboard`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
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
    },
    {
      "name": "Malaria",
      "count": 85,
      "color": "#f97316"
    }
  ],
  "recentEntries": [
    {
      "id": "case-uuid",
      "diseaseType": "Cholera",
      "cases": 5,
      "date": "2026-06-28",
      "worker": "John Doe",
      "status": "synced"
    }
  ],
  "alerts": [
    {
      "id": "alert-uuid",
      "type": "warning",
      "title": "Cholera cases up 40%",
      "message": "Port Harcourt Central sub-county...",
      "disease": "Cholera",
      "location": "Port Harcourt",
      "createdAt": "2026-06-28T10:00:00Z",
      "isRead": false
    }
  ]
}
```

---

#### 18. Get Dashboard Stats

Get statistics only.

**Endpoint:** `GET /dashboard/stats`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "todayCases": 47,
  "pendingSync": 3,
  "thisWeek": 218,
  "trend": {
    "value": 15,
    "direction": "up",
    "label": "from yesterday"
  }
}
```

---

#### 19. Get Disease Breakdown

Get disease statistics.

**Endpoint:** `GET /dashboard/diseases`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
[
  {
    "name": "Cholera",
    "count": 48,
    "color": "#7c3aed"
  },
  {
    "name": "Mpox",
    "count": 32,
    "color": "#a3a300"
  }
]
```

---

#### 20. Get Alerts

Get system alerts and notifications.

**Endpoint:** `GET /dashboard/alerts`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `unreadOnly` (boolean, default: false): Show only unread alerts

**Success Response (200):**
```json
[
  {
    "id": "alert-uuid",
    "type": "warning",
    "title": "Cholera outbreak detected",
    "message": "40% increase in cases...",
    "disease": "Cholera",
    "location": "Port Harcourt",
    "createdAt": "2026-06-28T10:00:00Z",
    "isRead": false
  }
]
```

---

#### 21. Mark Alert as Read

Mark a single alert as read.

**Endpoint:** `PATCH /dashboard/alerts/:id/read`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "message": "Alert marked as read"
}
```

---

#### 22. Get Trends Data

Get trends and forecast data.

**Endpoint:** `GET /dashboard/trends`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (string, required): ISO date
- `endDate` (string, required): ISO date
- `diseaseType` (string, optional): Filter by disease
- `location` (string, optional): Filter by location

**Success Response (200):**
```json
{
  "trends": [
    {
      "date": "2026-06-01",
      "count": 15,
      "disease": "Cholera"
    },
    {
      "date": "2026-06-02",
      "count": 18,
      "disease": "Cholera"
    }
  ],
  "forecast": [
    {
      "date": "2026-07-01",
      "predicted": 20,
      "confidence": 0.85
    }
  ]
}
```

---

#### 23. Get Heatmap Data

Get location-based disease data for mapping.

**Endpoint:** `GET /dashboard/heatmap`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `diseaseType` (string, optional)
- `startDate` (string, optional)
- `endDate` (string, optional)

**Success Response (200):**
```json
{
  "locations": [
    {
      "latitude": 4.8156,
      "longitude": 7.0498,
      "count": 25,
      "location": "Port Harcourt Central",
      "disease": "Cholera"
    },
    {
      "latitude": 4.8242,
      "longitude": 7.0337,
      "count": 15,
      "location": "Diobu",
      "disease": "Cholera"
    }
  ]
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": {
      "field": "Additional error information"
    }
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Server Error |

### Common Error Codes

- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Email not verified
- `VAL_001`: Validation error
- `VAL_002`: Missing required field
- `RES_001`: Resource not found
- `RES_002`: Resource already exists
- `PERM_001`: Insufficient permissions
- `RATE_001`: Rate limit exceeded

---

## Rate Limiting

### Limits

- **Authenticated users**: 100 requests per 15 minutes
- **Unauthenticated users**: 20 requests per 15 minutes
- **Photo uploads**: 10 uploads per minute

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Versioning

API versioning via URL path:

```
/api/v1/cases
/api/v2/cases
```

Current version: **v1**

---

## Support

- **API Issues**: api-support@afyametrix.health
- **Documentation**: https://docs.afyametrix.health
- **Status Page**: https://status.afyametrix.health

---

## Changelog

### v1.0.0 (2026-06-28)
- Initial API release
- Authentication endpoints
- Case management
- Photo uploads
- Dashboard data

---

**Last Updated**: June 28, 2026  
**API Version**: 1.0.0
