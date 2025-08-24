# CollabHub Frontend

A modern React application that provides a beautiful, responsive interface for Git repository collaboration. Built with React 18, Vite, and TailwindCSS.

## 🌟 Features

- **Modern UI**: Clean, responsive design built with TailwindCSS
- **Repository Management**: Browse and manage Git repositories
- **File Browser**: Navigate repository file structures with ease
- **Commit History**: Visual commit log and change tracking
- **Real-time Updates**: Live collaboration features
- **Code Syntax Highlighting**: Enhanced code viewing experience

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── RepositoryTabs.jsx      # Main repository navigation
│   ├── CommitLog.jsx          # Commit history display
│   ├── CodebaseFiles.jsx      # File browser component
│   └── common/                # Shared components
├── pages/
│   └── Dashboard.jsx          # Main application page
├── services/
│   └── api.js                 # API communication layer
├── utils/
│   └── helpers.js             # Utility functions
└── styles/
    └── index.css              # Global styles and Tailwind imports
```

### Key Components

#### RepositoryTabs.jsx
Main navigation component that provides tabbed interface for:
- Code browsing
- Commit history
- Repository statistics

```jsx
// Usage example
<RepositoryTabs 
  logs={commitLogs} 
  selectedRepo={currentRepository} 
/>
```

#### CommitLog.jsx
Displays commit history with:
- Commit messages and authors
- Timestamps and commit hashes
- File change indicators
- Diff links

#### CodebaseFiles.jsx
File browser component featuring:
- Directory tree navigation
- File content preview
- Syntax highlighting
- File type icons

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Configuration
Create a `.env` file in the frontend directory:
```bash
# Development
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000

# Production
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality
- `npm run lint:fix` - Auto-fix ESLint issues

### Development Server
The development server runs on `http://localhost:3000` with:
- Hot Module Replacement (HMR)
- Fast refresh for React components
- Proxy configuration for API calls

### API Integration
The frontend communicates with the backend through:
```javascript
// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## 🎨 Styling

### TailwindCSS Configuration
The project uses TailwindCSS for styling with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280'
      }
    }
  },
  plugins: []
}
```

### Component Styling Patterns
```jsx
// Example component with TailwindCSS
const RepositoryCard = ({ repository }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {repository.name}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mt-2">
      {repository.description}
    </p>
  </div>
);
```

## 🔧 Configuration

### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
});
```

### ESLint Configuration
```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'react/prop-types': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': 'warn'
    }
  }
];
```

## 🧪 Testing

### Testing Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Example Component Test
```javascript
// __tests__/RepositoryTabs.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import RepositoryTabs from '../components/RepositoryTabs';

test('renders repository tabs', () => {
  const mockLogs = [];
  const mockRepo = 'test-repo';
  
  render(<RepositoryTabs logs={mockLogs} selectedRepo={mockRepo} />);
  
  expect(screen.getByText('Code')).toBeInTheDocument();
  expect(screen.getByText('History')).toBeInTheDocument();
});
```

## 📦 Build and Deployment

### Production Build
```bash
# Create optimized production build
npm run build

# The built files will be in the 'dist' directory
# Serve static files with any web server
```

### Docker Deployment
```dockerfile
# Frontend Dockerfile
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

### Performance Optimization
- **Code Splitting**: Automatic route-based splitting
- **Bundle Analysis**: Use `npm run build:analyze`
- **Image Optimization**: Optimize images before importing
- **Lazy Loading**: Implement for non-critical components

## 🔍 Debugging

### Development Tools
- React Developer Tools browser extension
- Vite's built-in error overlay
- Browser DevTools for network debugging

### Common Debug Commands
```bash
# Enable debug mode
DEBUG=vite:* npm run dev

# Analyze bundle size
npm run build:analyze

# Check for updates
npm outdated
```

## 🤝 Contributing

### Development Guidelines
1. Follow the established component structure
2. Use TailwindCSS for styling
3. Implement proper prop validation
4. Write tests for new components
5. Update documentation for new features

### Code Style
- Use functional components with hooks
- Prefer arrow functions for component definitions
- Use descriptive variable and function names
- Keep components small and focused

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/docs)

## 🐛 Troubleshooting

For common issues and solutions, see the [Troubleshooting Guide](../docs/TROUBLESHOOTING.md).

### Quick Fixes
- **Build errors**: Clear node_modules and reinstall
- **Style issues**: Check TailwindCSS configuration
- **API errors**: Verify backend is running and CORS is configured
- **Routing issues**: Check React Router setup
