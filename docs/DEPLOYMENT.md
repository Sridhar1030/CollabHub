# CollabHub Deployment Guide

## Overview

This guide covers different deployment strategies for CollabHub, from local development to production environments. CollabHub consists of three main components that can be deployed independently or together.

## Prerequisites

### System Requirements
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher  
- **Git**: v2.0.0 or higher
- **Operating System**: Linux, macOS, or Windows
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: Minimum 1GB free space

### Dependencies
- **EC2 Instance**: Access to the Git server (currently `http://13.200.241.196:3000`)
- **Network**: Internet connectivity for API calls
- **Ports**: 3000 (frontend), 5000 (backend)

## Local Development Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/Sridhar1030/CollabHub.git
cd CollabHub
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../collabFrontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. VS Code Extension Setup
```bash
cd ../extension/collabhub-conflict-detection
npm install
```

To test the extension:
1. Open the extension folder in VS Code
2. Press `F5` to start debugging
3. A new VS Code window will open with the extension loaded

### 5. Verify Installation
- Navigate to `http://localhost:3000`
- Test API endpoints at `http://localhost:5000/api/test`
- Test VS Code extension commands in the command palette

## Production Deployment

### Option 1: Traditional Server Deployment

#### 1. Server Preparation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm git nginx

# CentOS/RHEL
sudo yum install nodejs npm git nginx
```

#### 2. Application Deployment
```bash
# Clone and setup
git clone https://github.com/Sridhar1030/CollabHub.git
cd CollabHub

# Backend deployment
cd backend
npm install --production
npm install -g pm2
pm2 start server.js --name "collabhub-backend"

# Frontend build and deployment
cd ../collabFrontend
npm install
npm run build
```

#### 3. Nginx Configuration
Create `/etc/nginx/sites-available/collabhub`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/CollabHub/collabFrontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/collabhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. Process Management
```bash
# Start services
pm2 start server.js --name "collabhub-backend"
pm2 startup
pm2 save

# Monitor services
pm2 status
pm2 logs collabhub-backend
```

### Option 2: Docker Deployment

#### 1. Create Dockerfiles

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

USER node

CMD ["npm", "run", "dev"]
```

**Frontend Dockerfile** (`collabFrontend/Dockerfile`):
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Frontend Nginx Config** (`collabFrontend/nginx.conf`):
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }
    }
}
```

#### 2. Docker Compose Setup

Create `docker-compose.yml` in the root directory:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - EC2_API_URL=http://13.200.241.196:3000
    volumes:
      - ./backend/logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/test"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./collabFrontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  backend_logs:
```

#### 3. Deploy with Docker Compose
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3

# Stop services
docker-compose down
```

### Option 3: Kubernetes Deployment

#### 1. Kubernetes Manifests

**Namespace** (`k8s/namespace.yaml`):
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: collabhub
```

**Backend Deployment** (`k8s/backend-deployment.yaml`):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: collabhub-backend
  namespace: collabhub
spec:
  replicas: 3
  selector:
    matchLabels:
      app: collabhub-backend
  template:
    metadata:
      labels:
        app: collabhub-backend
    spec:
      containers:
      - name: backend
        image: collabhub/backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: EC2_API_URL
          value: "http://13.200.241.196:3000"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/test
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: collabhub-backend-service
  namespace: collabhub
spec:
  selector:
    app: collabhub-backend
  ports:
  - port: 5000
    targetPort: 5000
  type: ClusterIP
```

**Frontend Deployment** (`k8s/frontend-deployment.yaml`):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: collabhub-frontend
  namespace: collabhub
spec:
  replicas: 2
  selector:
    matchLabels:
      app: collabhub-frontend
  template:
    metadata:
      labels:
        app: collabhub-frontend
    spec:
      containers:
      - name: frontend
        image: collabhub/frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: collabhub-frontend-service
  namespace: collabhub
spec:
  selector:
    app: collabhub-frontend
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

**Ingress** (`k8s/ingress.yaml`):
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: collabhub-ingress
  namespace: collabhub
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - collabhub.yourdomain.com
    secretName: collabhub-tls
  rules:
  - host: collabhub.yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: collabhub-backend-service
            port:
              number: 5000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: collabhub-frontend-service
            port:
              number: 80
```

#### 2. Deploy to Kubernetes
```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy applications
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Check deployment status
kubectl get pods -n collabhub
kubectl get services -n collabhub
kubectl get ingress -n collabhub
```

## Cloud Platform Deployments

### AWS Deployment

#### 1. Using AWS ECS
```bash
# Create ECR repositories
aws ecr create-repository --repository-name collabhub/backend
aws ecr create-repository --repository-name collabhub/frontend

# Build and push images
docker build -t collabhub/backend ./backend
docker tag collabhub/backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/collabhub/backend:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/collabhub/backend:latest

# Create ECS task definition and service
aws ecs create-cluster --cluster-name collabhub
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json
aws ecs create-service --cluster collabhub --service-name collabhub-backend --task-definition collabhub-backend
```

#### 2. Using AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize and deploy
eb init collabhub
eb create collabhub-prod
eb deploy
```

### Google Cloud Platform

#### 1. Using Cloud Run
```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/collabhub-backend ./backend
gcloud builds submit --tag gcr.io/PROJECT-ID/collabhub-frontend ./collabFrontend

# Deploy to Cloud Run
gcloud run deploy collabhub-backend --image gcr.io/PROJECT-ID/collabhub-backend --platform managed
gcloud run deploy collabhub-frontend --image gcr.io/PROJECT-ID/collabhub-frontend --platform managed
```

### Azure Deployment

#### 1. Using Azure Container Instances
```bash
# Create resource group
az group create --name collabhub-rg --location eastus

# Create container instances
az container create --resource-group collabhub-rg --name collabhub-backend --image collabhub/backend:latest --cpu 1 --memory 1
az container create --resource-group collabhub-rg --name collabhub-frontend --image collabhub/frontend:latest --cpu 1 --memory 1
```

## Environment Configuration

### Environment Variables

#### Backend Environment Variables
```bash
# Production environment
NODE_ENV=production
PORT=5000
EC2_API_URL=http://13.200.241.196:3000
EC2_IP=13.200.241.196
EC2_USER=git
PEM_PATH=/path/to/key.pem

# Development environment
NODE_ENV=development
PORT=5000
DEBUG=true
```

#### Frontend Environment Variables
```bash
# Production
VITE_API_URL=https://api.collabhub.com
VITE_WS_URL=wss://api.collabhub.com

# Development
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

### Configuration Management

Create environment-specific configuration files:

**Production Config** (`.env.production`):
```bash
NODE_ENV=production
PORT=5000
EC2_API_URL=http://13.200.241.196:3000
LOG_LEVEL=info
```

**Development Config** (`.env.development`):
```bash
NODE_ENV=development
PORT=5000
EC2_API_URL=http://13.200.241.196:3000
LOG_LEVEL=debug
DEBUG=true
```

## SSL/TLS Configuration

### Using Let's Encrypt with Certbot
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Using Custom SSL Certificate
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Your location blocks here
}
```

## Monitoring and Logging

### Production Monitoring Setup
```bash
# Install monitoring tools
npm install -g pm2
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

### Docker Logging
```yaml
# In docker-compose.yml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Backup and Recovery

### Database Backup (if implemented)
```bash
# Example for PostgreSQL
pg_dump collabhub > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump collabhub > $BACKUP_DIR/collabhub_$TIMESTAMP.sql
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

### File System Backup
```bash
# Create backup
tar -czf collabhub_backup_$(date +%Y%m%d).tar.gz /path/to/CollabHub

# Restore backup
tar -xzf collabhub_backup_20240101.tar.gz -C /path/to/restore/
```

## Troubleshooting

### Common Deployment Issues

#### 1. Port Already in Use
```bash
# Find process using port
sudo lsof -i :5000
sudo netstat -tulpn | grep :5000

# Kill process
sudo kill -9 <PID>
```

#### 2. Permission Issues
```bash
# Fix ownership
sudo chown -R $USER:$USER /path/to/CollabHub

# Fix permissions
chmod +x /path/to/scripts/*
```

#### 3. Node.js Version Issues
```bash
# Install Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use specific Node version
nvm install 18
nvm use 18
```

#### 4. EC2 Connection Issues
```bash
# Test EC2 connectivity
curl -v http://13.200.241.196:3000

# Check firewall rules
sudo ufw status
sudo iptables -L
```

### Health Checks

#### Application Health
```bash
# Backend health check
curl http://localhost:5000/api/test

# Frontend health check
curl http://localhost:3000

# Docker health check
docker-compose ps
```

#### System Health
```bash
# System resources
free -h
df -h
top

# Network connectivity
ping google.com
netstat -an | grep LISTEN
```

## Performance Optimization

### Production Optimizations

#### 1. Enable Compression
```nginx
# In nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript;
```

#### 2. Caching Headers
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### 3. Node.js Optimizations
```javascript
// In production
process.env.NODE_ENV = 'production';

// Enable cluster mode
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    require('./server.js');
}
```

## Security Considerations

### Production Security Checklist
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure proper CORS policies
- [ ] Implement rate limiting
- [ ] Use strong authentication mechanisms
- [ ] Regular security updates
- [ ] Firewall configuration
- [ ] Regular backups
- [ ] Monitor for security vulnerabilities
- [ ] Use environment variables for secrets
- [ ] Implement proper logging

### Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## Conclusion

This deployment guide provides multiple options for deploying CollabHub, from simple local development to enterprise-grade production deployments. Choose the deployment strategy that best fits your infrastructure requirements and scaling needs.

For additional support, refer to the troubleshooting section or the project's issue tracker.