# CollabHub - Real-time Git Collaboration Platform

CollabHub is a comprehensive collaboration platform that combines a modern web interface, backend server, and VS Code extension to enhance team collaboration in Git-based projects. It provides real-time conflict detection, change tracking, and seamless repository management.

## 🔄 Process Flow

![CollabHub Process Flow](Images/ProcessFLow.png)

The above diagram illustrates the interaction between different components of the CollabHub platform and how they work together to provide real-time collaboration features.

## 🌟 Features

- **Real-time Collaboration**: Track changes and conflicts across your team in real-time
- **Modern Web Interface**: Built with React and TailwindCSS for a beautiful, responsive experience
- **VS Code Integration**: Native extension for conflict detection and branch management
- **Repository Management**: Easy-to-use interface for managing Git repositories
- **Commit History**: Visual commit log and change tracking
- **File Browser**: Browse and manage repository files with ease

## 🏗️ Project Structure

The project consists of three main components:

### 1. Frontend (`/collabFrontend`)
A modern React application built with:
- React 18
- Vite
- TailwindCSS
- React Router DOM
- Axios for API communication

### 2. Backend (`/backend`)
An Express.js server providing:
- Repository management
- Codebase operations
- Commit tracking
- Logging system
- Authentication middleware

### 3. VS Code Extension (`/extension`)
A VS Code extension for:
- Real-time conflict detection
- Branch management
- Change tracking
- Direct integration with CollabHub server

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Git
- VS Code (for extension development)

### Frontend Setup
```bash
cd collabFrontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### VS Code Extension Setup
```bash
cd extension/collabhub-conflict-detection
npm install
# Press F5 in VS Code to start debugging
```

## 🛠️ Development Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server
- `npm test` - Run tests

### VS Code Extension
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## 🔧 Configuration

The application can be configured through various configuration files:

- Frontend: `vite.config.js`, `tailwind.config.js`
- Backend: `config/constants.js`
- Extension: `package.json` contributes section

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

