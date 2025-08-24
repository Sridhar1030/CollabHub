# Contributing to CollabHub

Thank you for your interest in contributing to CollabHub! This document provides comprehensive guidelines for contributing to our real-time Git collaboration platform.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community](#community)

## Code of Conduct

### Our Pledge
We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- The use of sexualized language or imagery and unwelcome sexual attention
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement
Project maintainers are responsible for clarifying standards and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

## Getting Started

### Prerequisites
Before contributing, ensure you have:
- Node.js (v14 or higher)
- Git (v2.0 or higher)
- VS Code (for extension development)
- Basic understanding of React, Express.js, and VS Code Extension API

### First Time Setup
1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CollabHub.git
   cd CollabHub
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/Sridhar1030/CollabHub.git
   ```
4. **Install dependencies** for all components:
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../collabFrontend && npm install
   
   # Extension
   cd ../extension/collabhub-conflict-detection && npm install
   ```

### Understanding the Codebase
- **Frontend**: React application with modern hooks, TailwindCSS styling
- **Backend**: Express.js REST API with controller-based architecture
- **Extension**: VS Code extension using the Extension API

Review the [Architecture Documentation](./ARCHITECTURE.md) for detailed technical information.

## Development Setup

### Environment Configuration
Create environment files for local development:

**Backend** (`.env.development`):
```bash
NODE_ENV=development
PORT=5000
EC2_API_URL=http://13.200.241.196:3000
DEBUG=true
```

**Frontend** (`.env.development`):
```bash
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

### Running the Development Environment
1. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend**:
   ```bash
   cd collabFrontend
   npm run dev
   ```

3. **Test the extension**:
   ```bash
   cd extension/collabhub-conflict-detection
   # Open in VS Code and press F5 for debugging
   ```

### Development Tools
- **Linting**: ESLint configured for all components
- **Formatting**: Prettier for consistent code formatting
- **Git Hooks**: Pre-commit hooks for code quality

## Contribution Workflow

### 1. Issue Selection
- Look for issues labeled `good first issue` for beginners
- Comment on the issue to express interest
- Wait for assignment before starting work
- Ask questions if requirements are unclear

### 2. Branch Management
```bash
# Sync with upstream
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Keep branch up to date
git pull upstream main
git rebase main
```

### 3. Making Changes
- Make small, focused commits
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed

### 4. Commit Message Guidelines
Follow the conventional commit format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(frontend): add repository search functionality
fix(backend): resolve authentication middleware issue
docs(api): update endpoint documentation
test(extension): add unit tests for file tracking
```

## Coding Standards

### JavaScript/React Standards

#### General Rules
- Use ES6+ features (arrow functions, destructuring, async/await)
- Prefer `const` and `let` over `var`
- Use meaningful variable and function names
- Keep functions small and focused (max 50 lines)
- Use JSDoc comments for complex functions

#### React Specific
```javascript
// Use functional components with hooks
import React, { useState, useEffect } from 'react';

const RepositoryList = ({ repositories, onSelect }) => {
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    // Effect logic here
  }, [repositories]);

  return (
    <div className="repository-list">
      {repositories.map(repo => (
        <button
          key={repo.id}
          onClick={() => onSelect(repo)}
          className="repository-item"
        >
          {repo.name}
        </button>
      ))}
    </div>
  );
};

export default RepositoryList;
```

#### Express.js Backend
```javascript
// Use async/await for asynchronous operations
const getRepositories = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Validate input
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const repositories = await repositoryService.getByUsername(username);
    res.json({ repositories });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

### CSS/Styling Standards
- Use TailwindCSS utility classes
- Create custom CSS only when necessary
- Follow mobile-first responsive design
- Use semantic class names for custom CSS

```jsx
// Good: Using TailwindCSS utilities
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</button>

// Custom CSS when needed
<div className="repository-grid">
  {/* Content */}
</div>
```

### File and Directory Naming
- Use kebab-case for files: `repository-list.js`
- Use PascalCase for React components: `RepositoryList.jsx`
- Use camelCase for variables and functions: `getUserRepositories`
- Use UPPER_CASE for constants: `API_BASE_URL`

### Code Organization
```
src/
├── components/           # Reusable components
│   ├── common/          # Shared components
│   └── feature-specific/ # Feature-specific components
├── pages/               # Page components
├── services/            # API services
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
└── constants/           # Application constants
```

## Testing Guidelines

### Testing Strategy
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **End-to-End Tests**: Test complete user workflows

### Frontend Testing
```javascript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import RepositoryList from './RepositoryList';

describe('RepositoryList', () => {
  const mockRepositories = [
    { id: 1, name: 'repo1' },
    { id: 2, name: 'repo2' }
  ];

  test('renders repository list', () => {
    render(<RepositoryList repositories={mockRepositories} />);
    
    expect(screen.getByText('repo1')).toBeInTheDocument();
    expect(screen.getByText('repo2')).toBeInTheDocument();
  });

  test('calls onSelect when repository is clicked', () => {
    const mockOnSelect = jest.fn();
    render(
      <RepositoryList 
        repositories={mockRepositories} 
        onSelect={mockOnSelect} 
      />
    );
    
    fireEvent.click(screen.getByText('repo1'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockRepositories[0]);
  });
});
```

### Backend Testing
```javascript
// API endpoint testing with supertest
const request = require('supertest');
const app = require('../server');

describe('Repository API', () => {
  test('GET /repositories/:username returns user repositories', async () => {
    const response = await request(app)
      .get('/api/repositories/testuser')
      .expect(200);

    expect(response.body).toHaveProperty('repositories');
    expect(Array.isArray(response.body.repositories)).toBe(true);
  });

  test('GET /repositories/:username returns 404 for invalid user', async () => {
    await request(app)
      .get('/api/repositories/nonexistentuser')
      .expect(404);
  });
});
```

### Test Coverage Requirements
- Minimum 80% code coverage for new features
- All critical paths must be tested
- Edge cases and error conditions should be covered

## Documentation Guidelines

### Code Documentation
- Use JSDoc for function documentation
- Include parameter types and return values
- Provide usage examples for complex functions

```javascript
/**
 * Fetches repositories for a given username
 * @param {string} username - The username to fetch repositories for
 * @param {Object} options - Additional options
 * @param {number} options.limit - Maximum number of repositories to return
 * @returns {Promise<Array>} Array of repository objects
 * @throws {Error} When username is invalid or API request fails
 * 
 * @example
 * const repos = await getRepositories('john', { limit: 10 });
 * console.log(repos); // [{ name: 'repo1', ... }, ...]
 */
async function getRepositories(username, options = {}) {
  // Implementation
}
```

### README Updates
- Update component READMEs for significant changes
- Include setup instructions for new features
- Add examples for new API endpoints

### Inline Comments
- Explain complex business logic
- Document workarounds and their reasons
- Use TODO comments for known technical debt

```javascript
// TODO: Implement caching for better performance
// FIXME: Handle edge case when repository is empty
// HACK: Temporary workaround for API inconsistency
```

## Pull Request Process

### Before Submitting
1. **Test your changes**:
   ```bash
   # Run linting
   npm run lint
   
   # Run tests
   npm test
   
   # Build the project
   npm run build
   ```

2. **Update documentation**:
   - Update relevant README files
   - Add/update API documentation
   - Include inline code comments

3. **Commit message format**:
   - Follow conventional commit format
   - Include issue numbers when applicable

### Pull Request Template
When creating a PR, include:

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Include screenshots for UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or properly documented)

## Related Issues
Closes #(issue number)
```

### Review Process
1. **Automated checks** must pass (linting, tests)
2. **Code review** by at least one maintainer
3. **Manual testing** for significant changes
4. **Documentation review** for new features

### Addressing Review Feedback
- Respond to all comments
- Make requested changes in new commits
- Don't force-push unless requested
- Re-request review after changes

## Issue Reporting

### Bug Reports
Use the bug report template and include:
- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (OS, Node version, browser)
- **Screenshots/logs** if applicable

### Feature Requests
Use the feature request template and include:
- **Problem description** the feature would solve
- **Proposed solution** or implementation ideas
- **Use cases** and user stories
- **Acceptance criteria**

### Security Issues
For security vulnerabilities:
- **Do not** create a public issue
- Email security@collabhub.com directly
- Include detailed steps to reproduce
- Wait for confirmation before disclosure

## Community

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat and community support

### Getting Help
- Check existing issues and documentation first
- Use clear, descriptive titles for questions
- Provide context and relevant code snippets
- Be patient and respectful with responses

### Mentorship
New contributors can:
- Look for `good first issue` labels
- Join mentorship sessions (scheduled monthly)
- Ask questions in the newcomer channel
- Pair program with experienced contributors

## Recognition

### Contributor Recognition
- Contributors are listed in the project README
- Significant contributions are highlighted in release notes
- Annual contributor appreciation events

### Maintainer Path
Regular contributors may be invited to become maintainers based on:
- Consistent quality contributions
- Community involvement and support
- Technical expertise in project areas
- Commitment to project values

## Development Environment Tips

### Recommended VS Code Extensions
- ESLint
- Prettier
- GitLens
- Thunder Client (for API testing)
- TailwindCSS IntelliSense

### Useful Scripts
```bash
# Full project setup
npm run setup

# Run all linting
npm run lint:all

# Run all tests
npm run test:all

# Clean and reinstall dependencies
npm run clean && npm run setup
```

### Debugging Tips
- Use VS Code debugger for backend debugging
- Use React Developer Tools for frontend
- Enable detailed logging in development
- Use network tab for API debugging

## License

By contributing to CollabHub, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to CollabHub! Your efforts help make real-time Git collaboration better for everyone. 🚀