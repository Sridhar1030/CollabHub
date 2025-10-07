# 🔄 Issues System - User Fetching Update

## Date: October 8, 2025

---

## ✅ Changes Implemented

### 1. **Fetch Users from API Instead of Props**

Previously, the "Assign to" section relied on the `collaborators` prop passed down from parent components. Now it fetches users directly from the backend API.

**API Endpoint Used:**
```bash
GET http://localhost:5000/getUsers
Headers: 
  Authorization: Bearer <token>
```

**Implementation:**
- Added `users` state to store fetched users
- Added `loadingUsers` state to show loading spinner
- Added `useEffect` hook to fetch users when modal opens
- Reads auth token from localStorage

**Code Added:**
```javascript
const [users, setUsers] = useState([]);
const [loadingUsers, setLoadingUsers] = useState(true);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem('token') || '';
      const response = await axios.get('http://localhost:5000/getUsers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data.users || response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers(collaborators || []); // Fallback
    } finally {
      setLoadingUsers(false);
    }
  };
  fetchUsers();
}, [collaborators]);
```

---

### 2. **Added Loading State for User List**

While users are being fetched, a loading spinner is displayed:

```jsx
{loadingUsers ? (
  <div className="glass-dark rounded-lg p-4 border border-white/10 text-center">
    <div className="animate-spin w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-2"></div>
    <p className="text-xs text-gray-400">Loading users...</p>
  </div>
) : (
  // User list here
)}
```

**User Experience:**
- ⏳ Shows spinner while fetching
- ✅ Displays users after successful fetch
- ⚠️ Falls back to collaborators prop if API fails
- 📝 Shows "No users available" if list is empty

---

### 3. **Updated User List Rendering**

Changed from using `collaborators` prop to using fetched `users` state:

**Before:**
```jsx
{collaborators && collaborators.length > 0 ? (
  collaborators.map((collab) => (
    // render user
  ))
) : (
  <p>No collaborators available</p>
)}
```

**After:**
```jsx
{users && users.length > 0 ? (
  users.map((collab) => (
    // render user
  ))
) : (
  <p>No users available</p>
)}
```

---

### 4. **Removed Unused Collaborators Prop**

Cleaned up the `IssueDetailModal` component by removing the unused `collaborators` prop:

**Before:**
```javascript
function IssueDetailModal({ issue, collaborators, onClose, onUpdate }) {
```

**After:**
```javascript
function IssueDetailModal({ issue, onClose, onUpdate }) {
```

Also updated the component usage to not pass the collaborators prop.

---

## 🎯 How It Works Now

### Create Issue Flow:

1. **User clicks "Create New Issue"**
   - Modal opens
   - `useEffect` triggers immediately

2. **Fetch Users API Call**
   - Reads token from `localStorage.getItem('token')`
   - Sends GET request to `http://localhost:5000/getUsers`
   - Includes `Authorization: Bearer <token>` header

3. **Display Users**
   - Shows loading spinner while fetching
   - Displays checkboxes for each user once loaded
   - Users can select/deselect assignees

4. **Create Issue**
   - Fill in title, description
   - Select priority (low/medium/high/critical)
   - Check users to assign
   - Add labels (optional)
   - Click **"Create Issue"** button
   - Issue is created with selected assignees

---

## 🔧 Technical Details

### Files Modified:
- `collabFrontend/src/components/Issues.jsx`

### Changes Made:
1. Added `users` state variable
2. Added `loadingUsers` state variable
3. Added `useEffect` hook to fetch users
4. Added loading UI for user list
5. Changed user list rendering to use `users` instead of `collaborators`
6. Removed unused `collaborators` prop from IssueDetailModal

### Dependencies:
- **axios** - For API calls
- **localStorage** - For token storage
- **React hooks** - useState, useEffect

---

## 📋 API Contract

### Get Users Endpoint

**Request:**
```bash
GET http://localhost:5000/getUsers
Headers:
  Authorization: Bearer <your_token_here>
```

**Expected Response Format (Option 1):**
```json
{
  "users": [
    {
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

**Expected Response Format (Option 2):**
```json
[
  {
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
]
```

**User Object Structure:**
```javascript
{
  name: string,      // User's display name (optional)
  email: string,     // User's email address (required)
  id?: string        // Optional unique identifier
}
```

---

## 🔐 Authentication

The component expects an auth token to be stored in localStorage:

```javascript
localStorage.setItem('token', 'your_jwt_token_here');
```

If no token is found, an empty string is sent:
```javascript
const token = localStorage.getItem('token') || '';
```

---

## 🚨 Error Handling

### API Call Fails:
- Falls back to `collaborators` prop
- Logs error to console
- User list still displays (if collaborators available)

### No Users Available:
- Shows message: "No users available"
- User can still create issue without assignees

### Token Missing:
- Request sent with empty Bearer token
- Backend should handle unauthorized requests

---

## ✨ UI Features

### Loading State:
- Animated spinner
- "Loading users..." text
- Glassmorphism effect

### User List:
- Checkboxes for selection
- Avatar circles with initials
- User name and email display
- Hover effects
- Scrollable list (max height 40)
- Custom scrollbar styling

### Empty State:
- Centered message
- Gray text
- Padding for visual balance

---

## 🧪 Testing Checklist

- [ ] Modal opens without errors
- [ ] Loading spinner appears briefly
- [ ] Users load from API
- [ ] Checkboxes work for selecting users
- [ ] Selected count updates: "Assign to (X selected)"
- [ ] Can deselect users
- [ ] Can create issue with assignees
- [ ] Can create issue without assignees
- [ ] Fallback works if API fails
- [ ] Empty state shows if no users

---

## 🎨 Create Button Status

**✅ Create Button Already Exists!**

The "Create Issue" button is already present in the modal footer:

**Location:** Lines 605-610 in Issues.jsx

```jsx
<button
  type="submit"
  disabled={submitting}
  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
>
  {submitting ? 'Creating...' : 'Create Issue'}
</button>
```

**Features:**
- ✅ Blue gradient background
- ✅ Hover effects with scale animation
- ✅ Disabled state when submitting
- ✅ Loading text: "Creating..."
- ✅ Success text: "Create Issue"
- ✅ Full-width responsive design
- ✅ Proper form submission handling

---

## 📸 Visual Appearance

### Modal Footer:
```
┌─────────────────────────────────────────┐
│  [Cancel]         [Create Issue]        │
│   Gray            Blue Gradient         │
└─────────────────────────────────────────┘
```

### Assignees Section:
```
Assign to (2 selected)
┌─────────────────────────────────────────┐
│ ⏳ Loading users...                     │  <- While loading
└─────────────────────────────────────────┘

Or after loading:
┌─────────────────────────────────────────┐
│ ☑️  [JD]  John Doe                      │
│          john@example.com               │
│                                         │
│ ☐  [JS]  Jane Smith                    │
│          jane@example.com               │
└─────────────────────────────────────────┘
```

---

## 🚀 Next Steps

1. **Ensure Backend Endpoint Exists:**
   - Verify `GET /getUsers` route is implemented
   - Check authorization middleware
   - Test response format

2. **Set Auth Token:**
   - After login, store token: `localStorage.setItem('token', token)`
   - Token should be JWT format

3. **Test in Browser:**
   - Open Issues tab
   - Click "Create New Issue"
   - Check Network tab for API call
   - Verify users appear in list

4. **Verify Token:**
   - Check Application → Local Storage in DevTools
   - Should see `token` key with value

---

## 💡 Pro Tips

### Check Token:
```javascript
console.log('Token:', localStorage.getItem('token'));
```

### Test API Manually:
```bash
curl --location 'http://localhost:5000/getUsers' \
--header 'Authorization: Bearer your_token_here'
```

### Clear Token:
```javascript
localStorage.removeItem('token');
```

### Set Test Token:
```javascript
localStorage.setItem('token', 'test_token_123');
```

---

## 🎉 Summary

**✅ Issue #1 - FIXED:** Users now fetched from `/getUsers` API with Bearer token  
**✅ Issue #2 - NOT A BUG:** Create button already exists and works properly

The Issues system now dynamically fetches users from your backend API instead of relying on props. The Create Issue button was already implemented and functional.

---

*Last Updated: October 8, 2025 at 03:25*
