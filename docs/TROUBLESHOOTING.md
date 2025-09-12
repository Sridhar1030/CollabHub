# CollabHub Troubleshooting Guide

This guide provides solutions to common issues you might encounter while developing, deploying, or using CollabHub.

## Table of Contents
- [Common Development Issues](#common-development-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [VS Code Extension Issues](#vs-code-extension-issues)
- [Deployment Issues](#deployment-issues)
- [Network and Connectivity Issues](#network-and-connectivity-issues)
- [Performance Issues](#performance-issues)
- [Security Issues](#security-issues)
- [Debugging Tools and Techniques](#debugging-tools-and-techniques)

## Common Development Issues

### Issue: "Port already in use" Error

**Problem:** Error message like `EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Find process using the port
sudo lsof -i :5000
# or
sudo netstat -tulpn | grep :5000

# Kill the process (replace PID with actual process ID)
sudo kill -9 <PID>

# On Windows, use:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Prevention:**
- Always stop development servers properly (Ctrl+C)
- Use different ports for different services
- Create cleanup scripts in package.json

### Issue: Node Version Compatibility

**Problem:** `Unsupported Node.js version` or compatibility errors

**Solution:**
```bash
# Check current Node version
node --version

# Install Node Version Manager (NVM)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal and install/use correct version
nvm install 18
nvm use 18
nvm alias default 18
```

### Issue: NPM Package Installation Failures

**Problem:** NPM install fails with permission errors or package conflicts

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Fix npm permissions (Linux/Mac)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# On Windows, run as administrator
# Or use Yarn instead of NPM
npm install -g yarn
yarn install
```

### Issue: Environment Variables Not Loading

**Problem:** Environment variables from `.env` files not being read

**Solutions:**
```bash
# Ensure dotenv is installed and configured
npm install dotenv

# In your main file (server.js), add at the top:
require('dotenv').config();

# Check file naming (.env, .env.development, .env.production)
# Ensure files are in the correct directory
# Check that variables don't have spaces around =
# Correct: API_URL=http://localhost:5000
# Incorrect: API_URL = http://localhost:5000
```

## Backend Issues

### Issue: Express Server Won't Start

**Problem:** Server crashes on startup or doesn't respond

**Diagnostic Steps:**
```bash
# Check if all required dependencies are installed
npm list

# Verify environment variables
node -e "console.log(process.env)"

# Check for syntax errors
node -c server.js

# Run with debugging
DEBUG=* npm run dev
```

**Common Solutions:**
```javascript
// Ensure proper error handling in server.js
const express = require('express');
const app = express();

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
```

### Issue: EC2 Connection Failures

**Problem:** Backend can't connect to EC2 Git server

**Diagnostic Commands:**
```bash
# Test EC2 connectivity
curl -v http://13.200.241.196:3000
ping 13.200.241.196

# Check DNS resolution
nslookup 13.200.241.196

# Test with different timeout settings
curl --connect-timeout 10 --max-time 30 http://13.200.241.196:3000
```

**Solutions:**
```javascript
// Add timeout and retry logic to axios calls
const axios = require('axios');

const axiosConfig = {
  timeout: 10000, // 10 seconds
  retry: 3,
  retryDelay: 1000
};

const apiClient = axios.create(axiosConfig);

// Add retry interceptor
apiClient.interceptors.response.use(null, (error) => {
  const config = error.config;
  
  if (!config || !config.retry) return Promise.reject(error);
  
  config.__retryCount = config.__retryCount || 0;
  
  if (config.__retryCount >= config.retry) {
    return Promise.reject(error);
  }
  
  config.__retryCount += 1;
  
  const delay = config.retryDelay || 1000;
  return new Promise(resolve => setTimeout(resolve, delay))
    .then(() => apiClient(config));
});
```

### Issue: Authentication Middleware Errors

**Problem:** Authentication fails with valid credentials

**Debugging Steps:**
```javascript
// Add detailed logging to auth middleware
const authenticateUser = (req, res, next) => {
  console.log('Auth headers:', req.headers);
  console.log('Auth method:', req.method);
  console.log('Auth path:', req.path);
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No authorization header found');
    return res.status(401).json({ error: 'No authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('Extracted token:', token);
  
  if (!USER_KEYS[token]) {
    console.log('Invalid token:', token);
    console.log('Valid tokens:', Object.keys(USER_KEYS));
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  console.log('Authentication successful');
  next();
};
```

## Frontend Issues

### Issue: API Calls Failing with CORS Errors

**Problem:** Browser blocks API requests due to CORS policy

**Solution:**
```javascript
// Backend: Ensure CORS is properly configured
const cors = require('cors');

// For development (allow all origins)
app.use(cors());

// For production (specific origins)
const corsOptions = {
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### Issue: React Component Not Re-rendering

**Problem:** Component doesn't update when state changes

**Common Causes and Solutions:**
```javascript
// Problem: Mutating state directly
const [items, setItems] = useState([]);
items.push(newItem); // Wrong!

// Solution: Create new array
setItems([...items, newItem]); // Correct

// Problem: Missing dependencies in useEffect
useEffect(() => {
  fetchData(userId);
}, []); // Missing userId dependency

// Solution: Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]); // Correct
```

### Issue: Vite Build Failures

**Problem:** Build process fails during production build

**Common Solutions:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Check for TypeScript errors (if using TS)
npx tsc --noEmit

# Build with detailed output
npm run build -- --debug

# Check for environment variable issues
# Ensure all VITE_ prefixed variables are set
```

**Build Configuration Issues:**
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
```

### Issue: TailwindCSS Styles Not Applied

**Problem:** Tailwind classes don't work in components

**Solutions:**
```javascript
// Check tailwind.config.js content paths
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure this matches your file structure
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// Ensure Tailwind is imported in your CSS
// In src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

// Check PostCSS configuration
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## VS Code Extension Issues

### Issue: Extension Not Loading

**Problem:** Extension doesn't activate in VS Code

**Diagnostic Steps:**
```bash
# Check extension logs
# VS Code -> Help -> Toggle Developer Tools -> Console

# Verify package.json configuration
{
  "activationEvents": ["onStartupFinished"],
  "main": "./extension.js",
  "engines": {
    "vscode": "^1.85.0"
  }
}

# Test extension in development mode
# Open extension folder in VS Code
# Press F5 to launch Extension Development Host
```

### Issue: Git Commands Failing in Extension

**Problem:** Extension can't execute Git commands

**Solutions:**
```javascript
// Check if workspace is a Git repository
const { exec } = require('child_process');
const vscode = require('vscode');

async function isGitRepository() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    throw new Error('No workspace folder open');
  }

  return new Promise((resolve) => {
    exec('git rev-parse --git-dir', { 
      cwd: workspaceFolder.uri.fsPath 
    }, (error) => {
      resolve(!error);
    });
  });
}

// Enhanced Git command execution with error handling
function executeGitCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Git command failed: ${command}`);
        console.error(`Error: ${error.message}`);
        console.error(`Stderr: ${stderr}`);
        reject(new Error(`Git command failed: ${error.message}`));
        return;
      }
      resolve(stdout.trim());
    });
  });
}
```

### Issue: Extension Commands Not Appearing

**Problem:** Extension commands don't show up in Command Palette

**Solutions:**
```json
// Verify package.json contributes section
{
  "contributes": {
    "commands": [
      {
        "command": "collabhub.showBranch",
        "title": "CollabHub: Show Current Branch",
        "category": "CollabHub"
      }
    ]
  }
}
```

```javascript
// Ensure commands are properly registered in activate function
function activate(context) {
  const showBranchCommand = vscode.commands.registerCommand(
    'collabhub.showBranch',
    async () => {
      try {
        // Command implementation
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    }
  );
  
  context.subscriptions.push(showBranchCommand);
}
```

## Deployment Issues

### Issue: Docker Build Failures

**Problem:** Docker image build process fails

**Common Solutions:**
```dockerfile
# Use specific Node version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Expose port
EXPOSE 5000

CMD ["npm", "start"]
```

**Build debugging:**
```bash
# Build with no cache to see all steps
docker build --no-cache -t collabhub/backend .

# Build with verbose output
docker build --progress=plain -t collabhub/backend .

# Check intermediate layers
docker build --target <stage-name> -t debug-image .
docker run -it debug-image sh
```

### Issue: Environment Variables in Production

**Problem:** Environment variables not working in production

**Solutions:**
```bash
# For Docker deployments
docker run -e NODE_ENV=production -e PORT=5000 collabhub/backend

# For docker-compose
# docker-compose.yml
services:
  backend:
    environment:
      - NODE_ENV=production
      - EC2_API_URL=${EC2_API_URL}
    env_file:
      - .env.production

# For Kubernetes
kubectl create secret generic collabhub-secrets \
  --from-literal=ec2-api-url=http://13.200.241.196:3000
```

### Issue: SSL Certificate Problems

**Problem:** HTTPS not working or certificate errors

**Solutions:**
```bash
# Check certificate validity
openssl x509 -in certificate.crt -text -noout

# Verify certificate chain
openssl verify -CAfile ca-bundle.crt certificate.crt

# Test SSL connection
openssl s_client -connect yourdomain.com:443

# Let's Encrypt renewal
sudo certbot renew --dry-run
```

## Network and Connectivity Issues

### Issue: Firewall Blocking Connections

**Problem:** Services can't communicate due to firewall rules

**Diagnostic Commands:**
```bash
# Check open ports
sudo netstat -tulpn | grep LISTEN

# Test port connectivity
telnet localhost 5000
nc -zv localhost 5000

# Check firewall status (Ubuntu/Debian)
sudo ufw status

# Check iptables rules
sudo iptables -L
```

**Solutions:**
```bash
# Ubuntu/Debian firewall
sudo ufw allow 5000
sudo ufw allow 3000

# CentOS/RHEL firewall
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload

# Add iptables rule
sudo iptables -A INPUT -p tcp --dport 5000 -j ACCEPT
```

### Issue: DNS Resolution Problems

**Problem:** Cannot resolve hostnames

**Diagnostic Steps:**
```bash
# Test DNS resolution
nslookup google.com
dig google.com

# Check DNS configuration
cat /etc/resolv.conf

# Test different DNS servers
nslookup google.com 8.8.8.8
```

## Performance Issues

### Issue: Slow API Response Times

**Problem:** API endpoints are responding slowly

**Diagnostic Steps:**
```bash
# Test API response time
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/test

# curl-format.txt content:
#     time_namelookup:  %{time_namelookup}\n
#        time_connect:  %{time_connect}\n
#     time_appconnect:  %{time_appconnect}\n
#    time_pretransfer:  %{time_pretransfer}\n
#       time_redirect:  %{time_redirect}\n
#  time_starttransfer:  %{time_starttransfer}\n
#                     ----------\n
#          time_total:  %{time_total}\n
```

**Solutions:**
```javascript
// Add request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
};

app.use(requestLogger);

// Implement caching for frequently accessed data
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

const getCachedData = async (key, fetchFunction) => {
  let data = cache.get(key);
  if (!data) {
    data = await fetchFunction();
    cache.set(key, data);
  }
  return data;
};
```

### Issue: High Memory Usage

**Problem:** Application consuming too much memory

**Monitoring:**
```bash
# Monitor memory usage
top -p $(pgrep node)
htop

# Node.js specific memory analysis
node --inspect server.js
# Then open Chrome DevTools -> Memory tab
```

**Solutions:**
```javascript
// Implement garbage collection monitoring
if (global.gc) {
  setInterval(() => {
    global.gc();
    console.log('Memory usage:', process.memoryUsage());
  }, 60000);
}

// Limit concurrent operations
const pLimit = require('p-limit');
const limit = pLimit(5); // Max 5 concurrent operations

const promises = urls.map(url => 
  limit(() => fetchData(url))
);
```

## Security Issues

### Issue: Unauthorized Access

**Problem:** Users accessing protected resources without authentication

**Enhanced Security Measures:**
```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api', limiter);

// Input validation
const { body, validationResult } = require('express-validator');

app.post('/api/repositories',
  body('username').isAlphanumeric().isLength({ min: 3, max: 20 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Continue processing
  }
);

// Security headers
const helmet = require('helmet');
app.use(helmet());
```

## Debugging Tools and Techniques

### Backend Debugging

**Using VS Code Debugger:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "program": "${workspaceFolder}/backend/server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

**Using Node.js Inspector:**
```bash
# Start with inspector
node --inspect server.js

# Connect with Chrome DevTools
# Open chrome://inspect in Chrome browser
```

### Frontend Debugging

**React Developer Tools:**
- Install React DevTools browser extension
- Use Components and Profiler tabs
- Enable "Highlight updates" for performance analysis

**Network Debugging:**
```javascript
// Axios request/response interceptors
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);
```

### General Debugging Tips

1. **Use meaningful error messages:**
   ```javascript
   throw new Error(`Failed to fetch repositories for user ${username}: ${error.message}`);
   ```

2. **Implement structured logging:**
   ```javascript
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.json()
     ),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

3. **Use debugging breakpoints:**
   ```javascript
   debugger; // This will pause execution in browser dev tools
   ```

## Getting Additional Help

If you're still experiencing issues after trying these solutions:

1. **Check the GitHub Issues** for similar problems
2. **Create a detailed issue report** with:
   - Error messages
   - Steps to reproduce
   - Environment details
   - Relevant code snippets
3. **Join our Discord community** for real-time help
4. **Consult the documentation** for additional context

Remember to always include specific error messages and environment details when seeking help!