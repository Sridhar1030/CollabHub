# 🎯 Issues System Setup Guide

## ✅ What Was Created

### Backend (MongoDB + Express)
1. **MongoDB Model** (`backend/models/Issue.js`)
   - Schema for storing issues with all metadata
   - Support for status, priority, assignees, comments, labels
   
2. **Issue Controller** (`backend/controllers/issueController.js`)
   - Create, read, update, delete issues
   - Add comments to issues
   - Get statistics (by status, priority)
   - Filter issues by status/priority/assignee

3. **API Routes** (`backend/routes/issues.js`)
   - `GET /issues/:username/:repo` - Get all issues
   - `GET /issues/:username/:repo/stats` - Get statistics
   - `GET /issues/issue/:id` - Get single issue
   - `POST /issues/:username/:repo` - Create issue
   - `PUT /issues/issue/:id` - Update issue
   - `POST /issues/issue/:id/comment` - Add comment
   - `DELETE /issues/issue/:id` - Delete issue

4. **Database Configuration** (`backend/config/database.js`)
   - MongoDB connection setup
   - Graceful shutdown handling

### Frontend (React Components)
1. **Issues Component** (`src/components/Issues.jsx`)
   - Issue list with filtering (all, open, in-progress, closed)
   - Statistics dashboard (4 cards showing counts)
   - Priority indicators (critical 🔴, high 🟠, medium 🟡, low 🔵)
   - Create issue modal
   - Issue detail modal with comments

2. **Integration** (`src/components/RepositoryTabs.jsx`)
   - Added "Issues" tab next to Code and Commits
   - Passes collaborators to Issues component

---

## 🚀 Setup Instructions

### Step 1: Install MongoDB (if not already installed)

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a Windows Service

**Or use Docker:**
\`\`\`bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
\`\`\`

### Step 2: Install Mongoose in Backend

\`\`\`bash
cd backend
npm install mongoose
\`\`\`

### Step 3: Configure MongoDB URI (Optional)

Create `.env` file in `backend/` folder:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/collabhub
PORT=5000
\`\`\`

Or it will use default: `mongodb://localhost:27017/collabhub`

### Step 4: Start Backend Server

\`\`\`bash
cd backend
npm run dev
\`\`\`

You should see:
\`\`\`
✅ MongoDB Connected Successfully
Server running on port 5000
\`\`\`

### Step 5: Start Frontend

\`\`\`bash
cd collabFrontend
npm run dev
\`\`\`

---

## 🎨 Features

### Issue Management
- ✅ Create issues with title, description
- ✅ Set priority (low, medium, high, critical)
- ✅ Assign to multiple collaborators
- ✅ Add custom labels
- ✅ Track status (open, in-progress, closed)
- ✅ Add comments
- ✅ View statistics

### UI Features
- ✅ Black & white glassy theme (matches file explorer)
- ✅ Filter issues by status
- ✅ Stats dashboard with cards
- ✅ Priority badges with color coding
- ✅ Assignee avatars
- ✅ Comment system
- ✅ Responsive modals
- ✅ Smooth animations

---

## 📊 Data Structure

### Issue Object
\`\`\`javascript
{
  _id: "ObjectId",
  repository: "repo-name",
  username: "username",
  title: "Bug: Fix login issue",
  description: "Users can't log in with Google",
  status: "open", // open | in-progress | closed
  priority: "high", // low | medium | high | critical
  assignees: [
    { name: "John Doe", email: "john@example.com" }
  ],
  createdBy: {
    name: "Jane Smith",
    email: "jane@example.com"
  },
  labels: ["bug", "urgent"],
  comments: [
    {
      author: { name: "...", email: "..." },
      text: "Working on it",
      createdAt: "2025-01-08T..."
    }
  ],
  createdAt: "2025-01-08T...",
  updatedAt: "2025-01-08T..."
}
\`\`\`

---

## 🎯 Usage Flow

1. **Navigate to Repository** → Click any repo from sidebar
2. **Click "Issues" Tab** → See issues list
3. **Click "New Issue"** → Fill form:
   - Title (required)
   - Description (required)
   - Priority (select one)
   - Assign collaborators (optional)
   - Add labels (optional)
4. **Create Issue** → Appears in list
5. **Click Issue** → View details, change status, add comments

---

## 🎨 Design System

### Colors
- **Open**: Green (`text-green-400`)
- **In Progress**: Yellow (`text-yellow-400`)
- **Closed**: Gray (`text-gray-400`)
- **Critical**: Red (`text-red-500`)
- **High**: Orange (`text-orange-500`)
- **Medium**: Yellow (`text-yellow-500`)
- **Low**: Blue (`text-blue-500`)

### Priority Emojis
- 🔴 Critical
- 🟠 High
- 🟡 Medium
- 🔵 Low

---

## 🔧 API Endpoints

### Get All Issues
\`\`\`
GET /issues/:username/:repo
Query params: ?status=open&priority=high&assignee=email@example.com
\`\`\`

### Create Issue
\`\`\`
POST /issues/:username/:repo
Body: {
  title: "...",
  description: "...",
  priority: "high",
  assignees: [...],
  labels: [...],
  createdBy: { name: "...", email: "..." }
}
\`\`\`

### Update Issue
\`\`\`
PUT /issues/issue/:id
Body: { status: "in-progress", ... }
\`\`\`

### Add Comment
\`\`\`
POST /issues/issue/:id/comment
Body: {
  author: { name: "...", email: "..." },
  text: "..."
}
\`\`\`

### Get Statistics
\`\`\`
GET /issues/:username/:repo/stats
Response: {
  byStatus: [{ _id: "open", count: 5 }, ...],
  byPriority: [{ _id: "high", count: 3 }, ...]
}
\`\`\`

---

## ✨ Screenshots Features

### Issues List View
- Stats cards at top (Open, In Progress, Closed, Total)
- Filter tabs (All, Open, In Progress, Closed)
- Issue cards with:
  - Priority emoji
  - Title
  - Description preview
  - Status badge
  - Created by & date
  - Assignee avatars
  - Comment count
  - Labels

### Create Issue Modal
- Title input (required)
- Description textarea (required)
- Priority selector (4 buttons)
- Assignee checkboxes (from collaborators)
- Label input (add/remove)
- Create/Cancel buttons

### Issue Detail Modal
- Full title & description
- Status change buttons
- Assignee list with avatars
- Comments section
- Add comment input

---

## 🎉 Ready to Use!

1. ✅ Backend: MongoDB model, controllers, routes
2. ✅ Frontend: Issues component, create modal, detail modal
3. ✅ Integration: Issues tab added to repository view
4. ✅ Styling: Black & white glassy theme

**Just install mongoose and restart your backend!**

\`\`\`bash
cd backend
npm install mongoose
npm run dev
\`\`\`

Then open your app and click on any repository → Issues tab! 🚀
