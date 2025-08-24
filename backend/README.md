# CollabHub Backend

An Express.js server providing REST API endpoints for Git repository management, file operations, and real-time collaboration features. Acts as a middleware layer between the frontend and EC2-hosted Git server.

## 🌟 Features

- **RESTful API**: Clean, well-structured API endpoints
- **Repository Management**: List and access Git repositories
- **File Operations**: Browse repository files and retrieve content
- **Commit Tracking**: Access commit history and diffs
- **Authentication**: User key-based authentication system
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Cross-origin resource sharing configuration

## 🏗️ Architecture

### Project Structure
```
backend/
├── config/
│   └── constants.js           # Application configuration
├── controllers/
│   ├── repositoryController.js # Repository operations
│   ├── logController.js       # Commit log operations
│   ├── codebaseController.js  # File tree operations
│   ├── commitController.js    # Commit diff operations
│   └── file.controller.js     # File content operations
├── middleware/
│   └── auth.js               # Authentication middleware
├── routes/
│   ├── index.js              # Main route aggregator
│   ├── repositories.js       # Repository routes
│   ├── logs.js               # Log routes
│   ├── codebase.js           # Codebase routes
│   └── commits.js            # Commit routes
└── server.js                 # Application entry point
```

### API Architecture Pattern
The backend follows the MVC (Model-View-Controller) pattern with:
- **Routes**: Handle HTTP request routing
- **Controllers**: Contain business logic
- **Middleware**: Handle cross-cutting concerns (auth, logging)
- **Services**: Communicate with external services (EC2)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm package manager
- Access to EC2 Git server

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Configuration
Create environment files for different environments:

**.env.development**:
```bash
NODE_ENV=development
PORT=5000
EC2_API_URL=http://13.200.241.196:3000
EC2_IP=13.200.241.196
EC2_USER=git
DEBUG=true
LOG_LEVEL=debug
```

**.env.production**:
```bash
NODE_ENV=production
PORT=5000
EC2_API_URL=http://13.200.241.196:3000
EC2_IP=13.200.241.196
EC2_USER=git
LOG_LEVEL=info
```

## 📡 API Endpoints

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://api.yourdomain.com/api`

### Endpoint Overview
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/test` | Health check | No |
| GET | `/repositories/:username` | Get user repositories | No |
| GET | `/log/:username/:repo` | Get commit history | No |
| GET | `/codebase/:username/:repo` | Get file tree | No |
| GET | `/codebase/file/:username/:repo/*` | Get file content | No |
| GET | `/commit-diff/:username/:repo/:hash` | Get commit diff | Yes |

### Authentication
The API uses simple user key authentication:
```javascript
// Current user keys (config/constants.js)
const USER_KEYS = {
  sridhar: "abc123",
  testuser: "xyz789"
};

// Usage in requests
Authorization: Bearer abc123
```

### Error Responses
All endpoints return consistent error responses:
```json
{
  "error": "Error description",
  "code": "ERROR_CODE", // Optional
  "details": {} // Optional additional details
}
```

## 🔧 Configuration

### Core Configuration (config/constants.js)
```javascript
const path = require("path");

const USER_KEYS = {
  sridhar: "abc123",
  testuser: "xyz789"
};

const EC2_API_URL = "http://13.200.241.196:3000";
const EC2_USER = "git";
const EC2_IP = "13.200.241.196";
const PEM_PATH = path.resolve(__dirname, "../newCollabHub.pem");
const PORT = process.env.PORT || 5000;

module.exports = {
  USER_KEYS,
  EC2_USER,
  EC2_IP,
  PEM_PATH,
  PORT,
  EC2_API_URL
};
```

### Server Configuration (server.js)
```javascript
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🛠️ Development

### Available Scripts
```json
{
  "scripts": {
    "dev": "node server.js",
    "start": "NODE_ENV=production node server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### Development Server
Start the development server with hot reload:
```bash
# Using nodemon for auto-restart
npm install -g nodemon
nodemon server.js

# Or using the dev script
npm run dev
```

### API Testing
Use tools like Postman, Insomnia, or curl for testing:
```bash
# Health check
curl http://localhost:5000/api/test

# Get repositories
curl http://localhost:5000/api/repositories/sridhar

# Authenticated request
curl -H "Authorization: Bearer abc123" \
     http://localhost:5000/api/commit-diff/sridhar/repo/hash123
```

## 🔒 Authentication & Security

### Current Authentication System
```javascript
// middleware/auth.js
const { USER_KEYS } = require('../config/constants');

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!USER_KEYS[token]) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.user = token;
  next();
};

module.exports = { authenticateUser };
```

### Security Enhancements
For production deployment, consider implementing:
- JWT token-based authentication
- Rate limiting middleware
- Input validation and sanitization
- HTTPS enforcement
- Security headers (helmet.js)

```javascript
// Enhanced security setup
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);
```

## 📊 Logging & Monitoring

### Development Logging
Basic console logging is implemented:
```javascript
// In controllers
console.log(`Fetching repositories for username: ${username}`);
console.error('Error fetching repositories:', error);
```

### Production Logging Setup
For production, implement structured logging:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'collabhub-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

## 🧪 Testing

### Testing Framework Setup
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Example API Test
```javascript
// __tests__/repositories.test.js
const request = require('supertest');
const app = require('../server');

describe('Repository API', () => {
  test('GET /api/repositories/:username should return repositories', async () => {
    const response = await request(app)
      .get('/api/repositories/testuser')
      .expect(200);

    expect(response.body).toHaveProperty('repositories');
    expect(Array.isArray(response.body.repositories)).toBe(true);
  });

  test('GET /api/repositories/:username should handle invalid user', async () => {
    await request(app)
      .get('/api/repositories/invaliduser')
      .expect(404);
  });
});
```

### Integration Testing
```javascript
// __tests__/integration.test.js
const request = require('supertest');
const app = require('../server');

describe('Integration Tests', () => {
  test('Full workflow: repositories -> logs -> files', async () => {
    // Get repositories
    const repoResponse = await request(app)
      .get('/api/repositories/testuser')
      .expect(200);

    // Get logs for first repository
    const firstRepo = repoResponse.body.repositories[0];
    const logResponse = await request(app)
      .get(`/api/log/testuser/${firstRepo.name}`)
      .expect(200);

    // Get file tree
    await request(app)
      .get(`/api/codebase/testuser/${firstRepo.name}`)
      .expect(200);
  });
});
```

## 📦 Deployment

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files for better caching
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001
USER backend

EXPOSE 5000

CMD ["npm", "start"]
```

### Environment Variables for Deployment
```bash
# Required environment variables
NODE_ENV=production
PORT=5000
EC2_API_URL=http://13.200.241.196:3000
EC2_IP=13.200.241.196
EC2_USER=git

# Optional
LOG_LEVEL=info
```

### Process Management (PM2)
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name collabhub-backend

# Create ecosystem file
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'collabhub-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};

# Deploy with ecosystem
pm2 start ecosystem.config.js --env production
```

## 🔍 Debugging

### Development Debugging
```bash
# Enable debug mode
DEBUG=* npm run dev

# Using Node.js inspector
node --inspect server.js

# Using VS Code debugger
# Create .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/server.js",
  "env": {
    "NODE_ENV": "development"
  }
}
```

### Common Issues
1. **Port conflicts**: Use `lsof -i :5000` to find conflicting processes
2. **EC2 connectivity**: Test with `curl http://13.200.241.196:3000`
3. **CORS issues**: Verify CORS configuration for frontend domain
4. **Authentication failures**: Check user keys and header format

## 🔄 EC2 Integration

The backend acts as a proxy to the EC2 Git server:

### Request Flow
```
Frontend → Backend API → EC2 Git Server → Response
```

### EC2 Communication Pattern
```javascript
// Example controller method
const axios = require('axios');
const { EC2_API_URL } = require('../config/constants');

const getRepositories = async (req, res) => {
  const { username } = req.params;
  
  try {
    // Proxy request to EC2
    const response = await axios.get(`${EC2_API_URL}/repositories/${username}`);
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: `User '${username}' not found` });
    }
    res.status(500).json({ error: error.message });
  }
};
```

## 🤝 Contributing

### Development Guidelines
1. Follow the MVC pattern
2. Use async/await for asynchronous operations
3. Implement proper error handling
4. Add tests for new endpoints
5. Update API documentation

### Code Style
- Use descriptive function and variable names
- Add JSDoc comments for complex functions
- Follow consistent error handling patterns
- Use middleware for cross-cutting concerns

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [API Design Guidelines](https://github.com/microsoft/api-guidelines)

## 🐛 Troubleshooting

For common issues and solutions, see the [Troubleshooting Guide](../docs/TROUBLESHOOTING.md).

### Quick Debug Commands
```bash
# Check server health
curl http://localhost:5000/api/test

# Monitor logs
tail -f logs/combined.log

# Check process status
ps aux | grep node

# Test EC2 connectivity
curl -v http://13.200.241.196:3000
```