# FollowMyLead20 API Documentation

## Authentication

### Login
```http
POST /api/login
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "your_password"
}
```

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "username": "user",
        "email": "user@example.com"
    }
}
```

### Authentication Headers
All protected routes require the following header:
```http
Authorization: Bearer <your_token>
```

## Protected Routes

### Get All Leads
```http
GET /api/leads
```

**Response:**
```json
[
    {
        "id": 1,
        "name": "John Smith",
        "email": "john@example.com",
        "phone": "123-456-7890",
        "company": "Tech Corp",
        "status": "new",
        "notes": "Potential client",
        "created_at": "2024-01-01T00:00:00Z"
    }
]
```

### Create Lead
```http
POST /api/leads
```

**Request Body:**
```json
{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "company": "Tech Corp",
    "status": "new",
    "notes": "Potential client"
}
```

### Upload CSV
```http
POST /api/upload-csv
```

**Request:**
- Content-Type: multipart/form-data
- File field name: "file"
- File type: .csv
- CSV format: name,email,company

**Response:**
```json
{
    "message": "Successfully imported X leads",
    "leads_created": 10
}
```

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Valid token but insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error |

## Error Response Format
```json
{
    "error": "Error message description"
}
```

## Best Practices

1. **Token Management**
   - Store tokens securely (e.g., in HttpOnly cookies or secure local storage)
   - Tokens expire after 24 hours
   - Include token in every request to protected endpoints

2. **CSV Upload**
   - Maximum file size: 10MB
   - Required columns: name, email, company
   - UTF-8 encoding recommended

3. **Rate Limiting**
   - 100 requests per minute per IP
   - 1000 requests per hour per user

4. **Data Validation**
   - Email must be valid format
   - Phone numbers should be in format: XXX-XXX-XXXX
   - Status must be one of: ["new", "contacted", "qualified", "lost", "converted"]

## Testing the API

### cURL Examples

1. Login:
```bash
curl -X POST http://localhost:5002/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

2. Get Leads:
```bash
curl http://localhost:5002/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

3. Create Lead:
```bash
curl -X POST http://localhost:5002/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "company": "Tech Corp"
  }'
```

4. Upload CSV:
```bash
curl -X POST http://localhost:5002/api/upload-csv \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@leads.csv"
```
