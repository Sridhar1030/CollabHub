# 🔍 Debug Guide - API Call Verification

## Issue: "API not being called to get users"

### ✅ **The API Call IS in the Code!**

**Location:** `Issues.jsx` - CreateIssueModal component, lines ~368-388

**The Code:**
```javascript
useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem('token') || '';
      console.log('🔑 Fetching users with token:', token ? 'Token exists' : 'No token found');
      console.log('📡 API Call: GET http://localhost:5000/getUsers');
      
      const response = await axios.get('http://localhost:5000/getUsers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Users API Response:', response.data);
      setUsers(response.data.users || response.data || []);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
    }
  };
  fetchUsers();
}, [collaborators]);
```

---

## 🧪 How to Verify the API Call

### Step 1: Open Browser Console
1. Press `F12` to open DevTools
2. Click the **Console** tab
3. Clear the console (🚫 icon)

### Step 2: Open Create Issue Modal
1. Navigate to any repository
2. Click **Issues** tab
3. Click **"Create New Issue"** button

### Step 3: Check Console Output

You should see these logs:

```
🔑 Fetching users with token: Token exists
📡 API Call: GET http://localhost:5000/getUsers
📤 Headers: {Authorization: "Bearer your_token_here"}
✅ Users API Response: {users: Array(5)}
👥 Fetched users count: 5
```

**OR if there's an error:**
```
❌ Error fetching users: AxiosError {...}
Error details: ...
🔄 Falling back to collaborators prop
```

### Step 4: Check Network Tab
1. Open **Network** tab in DevTools
2. Open the modal
3. Look for `getUsers` request
4. Should show:
   - **Method:** GET
   - **URL:** http://localhost:5000/getUsers
   - **Status:** 200 (if successful) or 401/404 (if error)
   - **Headers:** Authorization: Bearer ...

---

## 🔧 Troubleshooting

### Problem 1: "No console logs appear"
**Cause:** Modal not re-rendering or browser cache

**Fix:**
```bash
# Clear browser cache
Ctrl + Shift + Delete → Clear cache

# Or hard reload
Ctrl + Shift + R
```

### Problem 2: "Token doesn't exist"
**Check:**
```javascript
// In console:
localStorage.getItem('token')
```

**Should return:** `"your_jwt_token_here"`

**If null, set it:**
```javascript
localStorage.setItem('token', 'your_actual_token');
```

### Problem 3: "API returns 404"
**Cause:** Backend endpoint doesn't exist

**Verify endpoint exists:**
```bash
# Check backend routes
curl http://localhost:5000/getUsers
```

**Expected:** Should return users or "Unauthorized"

**Fix:** Add the endpoint to your backend:
```javascript
// backend/routes/getUsers.js
app.get('/getUsers', authMiddleware, (req, res) => {
  // Your logic here
  res.json({ users: [...] });
});
```

### Problem 4: "API returns 401 Unauthorized"
**Cause:** Token is invalid or expired

**Fix:**
1. Login again to get fresh token
2. Or use a valid test token
3. Check backend auth middleware

### Problem 5: "CORS error"
**Error:** `Access-Control-Allow-Origin`

**Fix in backend:**
```javascript
const cors = require('cors');
app.use(cors());
```

---

## 📸 What You Should See

### In Console (F12 → Console):
```
🔑 Fetching users with token: Token exists
📡 API Call: GET http://localhost:5000/getUsers
📤 Headers: {Authorization: "Bearer eyJhbGc..."}
✅ Users API Response: {users: Array(3)}
  users: Array(3)
    0: {name: "John Doe", email: "john@example.com"}
    1: {name: "Jane Smith", email: "jane@example.com"}
    2: {name: "Bob Wilson", email: "bob@example.com"}
👥 Fetched users count: 3
```

### In Network Tab (F12 → Network):
```
Name          Method  Status  Type
getUsers      GET     200     xhr

Request Headers:
  Authorization: Bearer eyJhbGc...
  
Response:
  {
    "users": [
      {"name": "John Doe", "email": "john@example.com"},
      ...
    ]
  }
```

### In Modal UI:
```
Assign to (0 selected)
┌────────────────────────────┐
│ ⏳ Loading users...         │  ← Shows briefly
└────────────────────────────┘

Then:
┌────────────────────────────┐
│ ☐ [JD] John Doe           │
│        john@example.com    │
│ ☐ [JS] Jane Smith         │
│        jane@example.com    │
│ ☐ [BW] Bob Wilson         │
│        bob@example.com     │
└────────────────────────────┘
```

---

## 🎯 Quick Verification Commands

### 1. Check if token exists:
```javascript
console.log('Token:', localStorage.getItem('token'));
```

### 2. Check if API endpoint works:
```bash
# PowerShell
$token = "your_token_here"
Invoke-WebRequest -Uri "http://localhost:5000/getUsers" -Headers @{"Authorization"="Bearer $token"}
```

### 3. Manually trigger the API call:
```javascript
// In browser console:
const token = localStorage.getItem('token') || '';
fetch('http://localhost:5000/getUsers', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('Manual fetch result:', data))
.catch(err => console.error('Manual fetch error:', err));
```

---

## 🔄 Modal Scrolling Fix Applied

### What Changed:
The modal structure was updated to have:
1. **Fixed Header** - Stays at top
2. **Scrollable Content** - All form fields can scroll
3. **Fixed Footer** - Action buttons stay at bottom

### New Structure:
```jsx
<div className="max-h-[90vh] flex flex-col">
  {/* Header - Fixed */}
  <div className="flex-shrink-0">...</div>
  
  {/* Form Content - Scrollable */}
  <div className="overflow-y-auto flex-1">
    {/* All form fields here */}
  </div>
  
  {/* Footer - Fixed */}
  <div className="flex-shrink-0">
    [Cancel] [Create Issue]
  </div>
</div>
```

### CSS Classes Used:
- `max-h-[90vh]` - Maximum 90% of viewport height
- `flex flex-col` - Vertical flexbox layout
- `overflow-y-auto` - Vertical scrolling for content
- `flex-1` - Content takes available space
- `flex-shrink-0` - Header/footer don't shrink
- `custom-scrollbar` - Styled scrollbar

---

## 📋 Testing Checklist

- [ ] Open browser console (F12)
- [ ] Clear console
- [ ] Navigate to repository → Issues tab
- [ ] Click "Create New Issue"
- [ ] Check console for logs starting with 🔑 📡 ✅
- [ ] Check Network tab for `getUsers` request
- [ ] Verify loading spinner appears
- [ ] Verify users list appears
- [ ] Try scrolling the modal (should scroll smoothly)
- [ ] Check if buttons stay at bottom while scrolling

---

## 🎉 Expected Behavior

1. **Click "Create New Issue"**
   → Modal opens
   → Console shows: "🔑 Fetching users with token..."
   
2. **Within 1-2 seconds**
   → Console shows: "✅ Users API Response"
   → Loading spinner disappears
   → Users list appears with checkboxes
   
3. **Scroll the modal**
   → Content scrolls smoothly
   → Header stays at top
   → Footer buttons stay at bottom
   → Scrollbar visible on right side

---

## 🆘 Still Not Working?

### Collect Debug Info:

1. **Console logs:**
```javascript
// Copy and run in console:
console.log('=== DEBUG INFO ===');
console.log('Token exists:', !!localStorage.getItem('token'));
console.log('Token value:', localStorage.getItem('token'));
console.log('Backend URL:', 'http://localhost:5000');

// Test API manually
fetch('http://localhost:5000/getUsers', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
.then(r => r.json())
.then(data => console.log('✅ API works:', data))
.catch(err => console.error('❌ API failed:', err));
```

2. **Check backend logs:**
```bash
# In backend terminal, you should see:
GET /getUsers 200
# or
GET /getUsers 401 (if unauthorized)
```

3. **Take screenshots:**
- Console tab with logs
- Network tab with request
- Modal UI with user list

---

## 📞 Summary

**The API call IS implemented!** 

The code will:
1. ✅ Call `GET http://localhost:5000/getUsers`
2. ✅ Send `Authorization: Bearer <token>` header
3. ✅ Log everything to console
4. ✅ Show loading spinner
5. ✅ Display fetched users
6. ✅ Modal is now scrollable

**Just make sure:**
- Token is in localStorage
- Backend endpoint exists
- Backend is running on port 5000
- CORS is configured

**Check the console logs** - they will tell you exactly what's happening! 🔍
