# CollabHub Architecture Documentation

## System Overview

CollabHub is a distributed real-time Git collaboration platform consisting of three main components that work together to provide seamless development team collaboration. The architecture follows a microservices pattern with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   VS Code       │    │   Frontend      │    │   Backend       │
│   Extension     │◄──►│   (React)       │◄──►│   (Express)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌────────▼────────┐             │
         │              │                 │             │
         └─────────────►│   WebSocket     │◄────────────┘
                        │   Server        │
                        │                 │
                        └─────────────────┘
                                 │
                        ┌────────▼────────┐
                        │                 │
                        │   EC2 Git       │
                        │   Server        │
                        │                 │
                        └─────────────────┘
```

## Component Architecture

### 1. Frontend (React Application)

**Technology Stack:**
- React 18
- Vite (Build tool)
- TailwindCSS (Styling)
- React Router DOM (Routing)
- Axios (HTTP Client)

**Architecture Pattern:** Component-based architecture with hooks

**Key Components:**
```
src/
├── components/
│   ├── RepositoryTabs.jsx      # Repository navigation
│   ├── CommitLog.jsx          # Commit history display
│   ├── CodebaseFiles.jsx      # File browser
│   └── ...
├── pages/
│   └── Dashboard.jsx          # Main application dashboard
├── services/
│   └── api.js                 # API communication layer
└── utils/
    └── helpers.js             # Utility functions
```

**Responsibilities:**
- User interface rendering
- User interaction handling
- API communication with backend
- Real-time update display
- Repository file browsing
- Commit history visualization

### 2. Backend (Express.js Server)

**Technology Stack:**
- Express.js
- Node.js
- Axios (EC2 communication)
- Custom middleware

**Architecture Pattern:** MVC (Model-View-Controller) with middleware

**Structure:**
```
backend/
├── controllers/               # Business logic
│   ├── repositoryController.js
│   ├── logController.js
│   ├── codebaseController.js
│   ├── commitController.js
│   └── file.controller.js
├── routes/                    # API route definitions
│   ├── repositories.js
│   ├── logs.js
│   ├── codebase.js
│   └── commits.js
├── middleware/                # Custom middleware
│   └── auth.js               # Authentication middleware
├── config/                   # Configuration
│   └── constants.js          # Application constants
└── server.js                 # Application entry point
```

**Responsibilities:**
- API endpoint management
- Authentication and authorization
- Request/response handling
- EC2 Git server communication
- Error handling and logging
- CORS configuration

### 3. VS Code Extension

**Technology Stack:**
- VS Code Extension API
- Node.js
- Child Process (Git command execution)

**Architecture Pattern:** Event-driven with command registration

**Structure:**
```
extension/collabhub-conflict-detection/
├── extension.js              # Main extension logic
├── package.json             # Extension manifest
├── test/                    # Extension tests
└── .vscode/                 # VS Code configuration
```

**Responsibilities:**
- Real-time file change detection
- Git branch monitoring
- Conflict detection
- User activity tracking
- Integration with CollabHub server
- VS Code UI integration

## Data Flow

### 1. Repository Access Flow
```
User Request → Frontend → Backend API → EC2 Git Server → Response
     ↑                                                      ↓
     └──────────────── UI Update ←────────────────────────────┘
```

### 2. Real-time Collaboration Flow
```
File Change (VS Code) → Extension → WebSocket → Frontend Update
                                       ↓
                              Backend Notification
```

### 3. Authentication Flow
```
Frontend Request → Backend Middleware → User Key Validation
      ↓                                        ↓
   401 Error ←─── Authentication Failed ───────┘
      ↓                                        ↓
API Response ←── Continue to Controller ←── Success
```

## Communication Patterns

### HTTP REST API
- **Frontend ↔ Backend**: Standard REST API calls
- **Backend ↔ EC2**: Proxied HTTP requests
- **Content-Type**: application/json
- **Authentication**: Bearer token (user keys)

### WebSocket (Planned)
- **Real-time updates**: File changes, conflict notifications
- **Event-driven**: Publish/subscribe pattern
- **Bidirectional**: Extension ↔ Frontend communication

## Security Architecture

### Authentication Layer
```
Request → API Gateway → Auth Middleware → Route Handler
    ↓           ↓              ↓              ↓
   401    →   Headers   →   Validate   →   Continue
```

**Current Implementation:**
- Simple user key authentication
- Hardcoded user credentials
- Middleware-based validation

**Recommended Enhancements:**
- JWT token-based authentication
- OAuth2 integration
- Role-based access control (RBAC)
- API key management

### Data Security
- **Transmission**: HTTP (upgrade to HTTPS recommended)
- **Storage**: No sensitive data stored locally
- **Validation**: Basic input validation (needs enhancement)

## Scalability Considerations

### Current Limitations
1. **Single EC2 Instance**: Single point of failure
2. **No Load Balancing**: Limited concurrent user support
3. **In-Memory State**: No persistent state management
4. **No Caching**: Repeated API calls to EC2

### Scalability Solutions

#### Horizontal Scaling
```
Load Balancer
     │
┌────┴────┬────────┬────────┐
│ Backend │ Backend │ Backend │
│ Node 1  │ Node 2  │ Node 3  │
└─────────┴────────┴────────┘
     │         │         │
     └─────────┼─────────┘
               │
        ┌──────▼──────┐
        │   Database  │
        │   Cluster   │
        └─────────────┘
```

#### Caching Layer
```
Frontend → Backend → Redis Cache → EC2 Git Server
                        ↓
                   Cache Hit/Miss
```

#### Microservices Architecture
```
API Gateway
     │
┌────┴────┬─────────┬──────────┬────────────┐
│ Auth    │ Repo    │ File     │ Real-time  │
│ Service │ Service │ Service  │ Service    │
└─────────┴─────────┴─────────┴────────────┘
```

## Performance Considerations

### Current Performance Profile
- **API Response Time**: 200-500ms (dependent on EC2)
- **File Loading**: Synchronous, no streaming
- **Memory Usage**: Low (stateless design)
- **Concurrent Users**: Limited by EC2 capacity

### Optimization Strategies
1. **Caching**: Implement Redis for frequently accessed data
2. **CDN**: Use CDN for static assets
3. **Database**: Add database layer for metadata
4. **Streaming**: Implement file streaming for large files
5. **Compression**: Enable gzip compression

## Monitoring and Logging

### Current Logging
- Basic console logging
- Error tracking in controllers
- No structured logging

### Recommended Monitoring Stack
```
Application → Winston Logger → Elasticsearch → Kibana Dashboard
     ↓              ↓               ↓              ↓
Metrics → Prometheus → Grafana → Alert Manager
```

## Development Environment

### Local Development Setup
```
Frontend (Port 3000) ← → Backend (Port 5000) ← → EC2 (Port 3000)
        ↑                        ↑
   Vite Dev Server      Express.js Server
```

### Docker Setup (Recommended)
```yaml
version: '3.8'
services:
  frontend:
    build: ./collabFrontend
    ports: ["3000:3000"]
  
  backend:
    build: ./backend
    ports: ["5000:5000"]
    environment:
      - EC2_API_URL=http://ec2-instance:3000
  
  redis:
    image: redis:alpine
    ports: ["6379:6379"]
```

## Deployment Architecture

### Current Deployment
- Manual deployment
- Single instance deployment
- No CI/CD pipeline

### Recommended Deployment Pipeline
```
GitHub → CI/CD Pipeline → Docker Registry → Kubernetes Cluster
   ↓           ↓               ↓               ↓
Code Push → Build & Test → Push Images → Rolling Deploy
```

## Future Architecture Enhancements

### Phase 1: Stability & Security
- Implement proper authentication (JWT)
- Add HTTPS support
- Implement proper error handling
- Add input validation

### Phase 2: Scalability
- Database integration
- Caching layer (Redis)
- Load balancing
- API rate limiting

### Phase 3: Advanced Features
- WebSocket implementation
- Real-time collaboration features
- Microservices architecture
- Advanced monitoring

### Phase 4: Enterprise Features
- SSO integration
- Advanced security features
- Multi-tenant support
- Enterprise monitoring

## Technology Decisions

### Why React?
- **Component reusability**: Modular UI components
- **Large ecosystem**: Rich library support
- **Developer experience**: Excellent tooling
- **Performance**: Virtual DOM optimization

### Why Express.js?
- **Simplicity**: Minimal, unopinionated framework
- **Flexibility**: Easy to extend and customize
- **Community**: Large community and ecosystem
- **Performance**: Fast and lightweight

### Why VS Code Extension?
- **Native integration**: Seamless developer experience
- **API access**: Full access to VS Code APIs
- **User adoption**: Large VS Code user base
- **Development efficiency**: Built-in debugging tools

## Conclusion

The current architecture provides a solid foundation for a Git collaboration platform. The modular design allows for incremental improvements and scaling. The recommended enhancements will improve security, performance, and scalability while maintaining the core architectural principles.