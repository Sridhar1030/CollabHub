# CollabHub API Documentation

## Overview

The CollabHub backend provides a RESTful API for managing Git repositories, tracking commits, browsing codebases, and retrieving file content. The API acts as a proxy to an EC2-hosted Git server while providing authentication and logging capabilities.

**Base URL:** `http://localhost:5000/api`

## Authentication

Most endpoints require authentication using user keys. The authentication is handled via the `authenticateUser` middleware.

### Headers
```
Content-Type: application/json
Authorization: Bearer <user_key>
```

### User Keys
User keys are configured in `backend/config/constants.js`:
- `sridhar`: `abc123`
- `testuser`: `xyz789`

## API Endpoints

### 1. Repositories

#### Get User Repositories
Retrieve all repositories for a specific user.

**Endpoint:** `GET /repositories/:username`

**Parameters:**
- `username` (string, required): The username to fetch repositories for

**Response:**
```json
{
  "repositories": [
    {
      "name": "repo1",
      "description": "Repository description",
      "lastModified": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/repositories/sridhar
```

### 2. Logs

#### Get Repository Commit Logs
Retrieve commit history for a specific repository.

**Endpoint:** `GET /log/:username/:repo`

**Parameters:**
- `username` (string, required): Repository owner username
- `repo` (string, required): Repository name

**Response:**
```json
{
  "commits": [
    {
      "hash": "abc123",
      "author": "John Doe",
      "date": "2024-01-01T00:00:00Z",
      "message": "Initial commit"
    }
  ]
}
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/log/sridhar/my-repo
```

### 3. Codebase

#### Get File Tree
Retrieve the directory structure of a repository.

**Endpoint:** `GET /codebase/:username/:repo`

**Parameters:**
- `username` (string, required): Repository owner username
- `repo` (string, required): Repository name

**Response:**
```json
{
  "tree": [
    {
      "name": "src",
      "type": "directory",
      "children": [
        {
          "name": "index.js",
          "type": "file",
          "size": 1024
        }
      ]
    }
  ]
}
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/codebase/sridhar/my-repo
```

#### Get File Content
Retrieve the content of a specific file in a repository.

**Endpoint:** `GET /codebase/file/:username/:repo/*`

**Parameters:**
- `username` (string, required): Repository owner username
- `repo` (string, required): Repository name
- `*` (string, required): File path within the repository

**Response:**
```json
{
  "content": "file content here",
  "encoding": "utf-8"
}
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/codebase/file/sridhar/my-repo/src/index.js
```

### 4. Commits

#### Get Commit Diff
Retrieve the diff/changes for a specific commit.

**Endpoint:** `GET /commit-diff/:username/:repo/:hash`

**Authentication:** Required

**Parameters:**
- `username` (string, required): Repository owner username
- `repo` (string, required): Repository name
- `hash` (string, required): Commit hash

**Response:**
```json
{
  "diff": "diff content here",
  "files": [
    {
      "filename": "src/index.js",
      "status": "modified",
      "additions": 5,
      "deletions": 2
    }
  ]
}
```

**Example:**
```bash
curl -X GET \
  -H "Authorization: Bearer abc123" \
  http://localhost:5000/api/commit-diff/sridhar/my-repo/abc123def456
```

### 5. Health Check

#### Test Endpoint
Simple endpoint to verify API connectivity.

**Endpoint:** `GET /test`

**Response:**
```
testing
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/test
```

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

### Error Response Format
```json
{
  "error": "Error message description"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS Configuration

CORS is enabled for all origins. Review and restrict origins for production deployment.

## Backend Architecture

The backend uses:
- **Express.js**: Web framework
- **Axios**: HTTP client for EC2 API calls
- **Custom middleware**: Authentication and logging
- **Controller pattern**: Organized route handlers

### EC2 Integration

The backend acts as a proxy to an EC2-hosted Git server:
- **EC2 URL**: `http://13.200.241.196:3000`
- **Connection**: Direct HTTP calls via Axios
- **Authentication**: User key validation before proxying requests

## Configuration

### Environment Variables
- `PORT`: Server port (default: 5000)
- `EC2_API_URL`: EC2 Git server URL
- `EC2_IP`: EC2 instance IP address
- `PEM_PATH`: Path to EC2 PEM file

### Constants
Configuration is managed in `backend/config/constants.js`:
```javascript
const USER_KEYS = {
    sridhar: "abc123",
    testuser: "xyz789"
};
const EC2_API_URL = "http://13.200.241.196:3000";
const PORT = 5000;
```

## Development

### Starting the Server
```bash
cd backend
npm install
npm run dev
```

### Testing the API
Use the provided examples above or import the API collection into your preferred API testing tool.

## Security Considerations

1. **Authentication**: Implement stronger authentication mechanisms for production
2. **HTTPS**: Use HTTPS in production
3. **Input Validation**: Add request validation middleware
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **CORS**: Restrict CORS origins in production
6. **Error Handling**: Avoid exposing sensitive information in error messages

## Future Enhancements

- OpenAPI/Swagger documentation
- Request/response validation
- API versioning
- Caching layer
- WebSocket support for real-time features
- Database integration for user management