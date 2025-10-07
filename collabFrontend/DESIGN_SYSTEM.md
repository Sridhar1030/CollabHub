# CollabHub Design System Reference

## 🎨 Color Palette

### GitHub Colors (Custom Tailwind Classes)
```css
bg-gh-bg          // #0d1117 - Main background
bg-gh-canvas      // #161b22 - Card background
bg-gh-hover       // #21262d - Hover state
border-gh-border  // #30363d - Border color
text-gh-text      // #c9d1d9 - Primary text
text-gh-muted     // #8b949e - Muted text
text-gh-accent    // #58a6ff - Accent blue
bg-gh-success     // #238636 - Success green
bg-gh-danger      // #da3633 - Error red
```

## 🔮 Glassy Effects

### Glass Classes
```jsx
className="glass"           // Light glassy effect with blur
className="glass-dark"      // Dark glassy effect with more blur
className="hover-glass"     // Interactive hover glassy state
```

### Usage Example
```jsx
<div className="glass-dark rounded-xl p-6 shadow-glass-lg">
  // Your content
</div>
```

## 🎬 Animations

### Available Animations
```jsx
className="animate-modal"       // Modal fade and scale in
className="animate-slide-down"  // Slide down from top
className="animate-pulse-glow"  // Pulsing glow effect
```

## 🔘 Buttons

### GitHub-Style Button
```jsx
<button className="btn-github">
  Click me
</button>
```

### Primary Action Button
```jsx
<button className="btn-primary">
  Primary Action
</button>
```

## 📜 Scrollbars

Apply custom scrollbar styling:
```jsx
<div className="overflow-auto custom-scrollbar">
  // Scrollable content
</div>
```

## 🎯 Common Component Patterns

### Card Pattern
```jsx
<div className="glass-dark rounded-xl p-6 shadow-glass-lg animate-slide-down">
  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
    {/* Header content */}
  </div>
  {/* Card content */}
</div>
```

### Icon with Glow
```jsx
<div className="relative">
  <div className="absolute inset-0 bg-gh-accent/20 blur-xl rounded-full"></div>
  <div className="relative w-10 h-10 bg-gradient-to-br from-gh-accent to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
    {/* Icon */}
  </div>
</div>
```

### Button with Hover Scale
```jsx
<button className="glass hover-glass rounded-lg p-3 transition-all hover:scale-[1.02]">
  // Content
</button>
```

### Avatar Stack
```jsx
<div className="flex -space-x-3">
  {items.map((item, i) => (
    <div
      key={i}
      className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full ring-2 ring-gh-canvas"
    >
      {/* Avatar content */}
    </div>
  ))}
</div>
```

## 🏷️ Badge Pattern
```jsx
<span className="glass rounded-full px-3 py-1 text-xs font-medium text-gh-muted">
  Badge Text
</span>
```

## 📊 Status Indicator
```jsx
<div className="flex items-center space-x-2">
  <div className="w-2 h-2 rounded-full bg-green-500"></div>
  <span className="text-sm text-gh-muted">Active</span>
</div>
```

## 🎨 Gradient Patterns

### Background Gradient
```jsx
<div className="bg-gradient-to-br from-gh-bg via-gh-canvas to-gh-bg">
  // Content
</div>
```

### Icon Gradient
```jsx
<div className="bg-gradient-to-br from-gh-accent to-blue-600 rounded-lg">
  // Icon
</div>
```

### Avatar Gradient Options
```jsx
from-blue-500 to-cyan-500
from-purple-500 to-pink-500
from-green-500 to-emerald-500
from-orange-500 to-red-500
from-yellow-500 to-orange-500
from-indigo-500 to-purple-500
```

## 📝 Typography

### Headings
```jsx
<h1 className="text-2xl font-bold text-white">Main Heading</h1>
<h2 className="text-xl font-semibold text-white">Sub Heading</h2>
<h3 className="text-lg font-semibold text-white">Section Heading</h3>
```

### Body Text
```jsx
<p className="text-gh-text">Primary text</p>
<p className="text-gh-muted">Secondary/muted text</p>
<p className="text-sm text-gh-muted">Small muted text</p>
```

### Code
```jsx
<code className="glass rounded-md px-2.5 py-1 text-xs font-mono text-gh-accent">
  code snippet
</code>
```

## 🖼️ Empty State Pattern
```jsx
<div className="glass-dark rounded-xl p-16 text-center shadow-glass-lg">
  <div className="relative inline-block mb-6">
    <div className="absolute inset-0 bg-gh-accent/20 blur-2xl rounded-full"></div>
    <div className="relative w-20 h-20 bg-gradient-to-br from-gh-accent to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
      {/* Icon */}
    </div>
  </div>
  <h2 className="text-2xl font-bold text-white mb-3">Title</h2>
  <p className="text-gh-muted">Description</p>
</div>
```

## ⚡ Loading State Pattern
```jsx
<div className="glass-dark rounded-xl p-16 text-center shadow-glass-lg">
  <div className="relative inline-block mb-4">
    <div className="absolute inset-0 bg-gh-accent/30 blur-xl rounded-full animate-pulse"></div>
    <div className="relative animate-spin w-12 h-12 border-3 border-gh-accent/30 border-t-gh-accent rounded-full"></div>
  </div>
  <p className="text-gh-text font-medium">Loading...</p>
</div>
```

## 🎯 Interactive States

### Hover States
```jsx
hover:bg-white/5        // Subtle background change
hover:text-white        // Text color change
hover:scale-[1.02]      // Subtle scale up
hover:border-gh-accent  // Border color change
```

### Active/Selected States
```jsx
bg-gh-accent/20                    // Background tint
border-gh-accent                   // Accent border
text-white                         // White text
shadow-lg shadow-gh-accent/20     // Glowing shadow
```

### Transition Classes
```jsx
transition-all duration-200   // Smooth transitions
transition-colors             // Color transitions only
transition-transform          // Transform only
```

## 🎨 Border Patterns

### Subtle Borders
```jsx
border border-white/10      // Very subtle
border border-white/5       // Ultra subtle
border-b border-white/10    // Bottom only
```

### Accent Borders
```jsx
border-2 border-gh-accent
border-l-2 border-green-400   // Left border (for diffs)
border-l-2 border-red-400     // Left border (for diffs)
```

---

## 💡 Tips

1. **Layering**: Use multiple layers with varying opacity for depth
2. **Consistency**: Stick to the defined color palette
3. **Animations**: Keep animations subtle and purposeful
4. **Spacing**: Use consistent spacing (space-x-3, space-y-4, etc.)
5. **Shadows**: Layer shadows for depth (shadow-lg + shadow-glass-lg)
6. **Icons**: Keep icon sizes consistent (w-4 h-4 for small, w-5 h-5 for medium)
