# Site Blocker Extension

A productivity-focused browser extension that redirects users from distracting websites to productive activities like journaling, reading, drawing, and exercise.

## 🚀 **Quick Start**

1. Open `blocked.html` in your browser
2. Use keyboard shortcuts to access features:
   - `p` - Prayer timer
   - `r` - Speed reading
   - `s` - Exercise routine
   - `j` - Journal
   - `l` - List mode
   - `d` - Drawing pad

## 📚 **Documentation**

- **[Architecture](ARCHITECTURE.md)** - Application architecture and design
- **[Development](DEVELOPMENT.md)** - Development guide and workflow
- **[Features](FEATURES.md)** - Current features and future roadmap

## 🎯 **Key Features**

- **Journaling**: Save and manage journal entries
- **Speed Reading**: RSVP technique for faster reading
- **Drawing**: Canvas drawing with zoom, undo/redo, save/copy
- **Exercise**: Exercise routine management
- **Prayer**: 1-minute prayer timer
- **Keyboard Shortcuts**: Full keyboard navigation

## 🛠️ **Development**

### **Architecture**
The application follows a clean, modular architecture:
- **Domain Layer**: Pure business logic
- **Application Layer**: Business services
- **Infrastructure Layer**: External utilities
- **Presentation Layer**: UI controllers

### **Key Files**
- `blocked.html` - Main entry point
- `blocked.js` - Application initialization
- `src/` - Modular source code
- `manifest.json` - Extension configuration
- `ruleset.json` - Site blocking rules

### **Keyboard Shortcuts**
- **Global**: `p`, `r`, `s`, `j`, `l`, `d`
- **Reading Modal**: `space`, `k`, `j`, `escape`, `q`
- **Drawing Modal**: `z`, `y`, `r`, `s`, `c`, `escape`, `q`

## 📋 **Installation**

### **As Browser Extension**
1. Open Chrome → `chrome://extensions`
2. Turn on Developer Mode
3. Click "Load unpacked" and select this folder

### **As Web Application**
1. Serve the files using a local web server
2. Open `blocked.html` in your browser
3. Use keyboard shortcuts to access features

## 🔧 **Configuration**

### **Site Blocking Rules**
Edit `ruleset.json` to modify blocked sites:
- Add new blocking rules
- Create exceptions for specific paths
- Configure rule priorities

### **Application Settings**
- Journal entries are stored in localStorage
- Reading progress and WPM settings persist
- Exercise progress is tracked automatically
- Drawing state is saved between sessions
