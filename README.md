# 📚 SBS CMS - Spiritual Building Stones Content Management System

A modern, glassmorphism-styled Angular CMS for managing spiritual content with an integrated mobile-first editor.

![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Material Design](https://img.shields.io/badge/Material_Design-3-green?logo=material-design)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)

## ✨ Features

- 🎨 **Glassmorphism UI** - Modern, translucent design with backdrop blur effects
- 📱 **Mobile-First Editor** - Real-time mobile preview with device frame simulation
- 📖 **Content Management** - Organize volumes, books, and languages hierarchically
- 👥 **User Management** - Role-based access control (Admin, Editor, Viewer)
- 🌍 **Multi-Language Support** - Built-in language management system
- 📊 **Analytics Dashboard** - Visual insights with charts and statistics
- 🔄 **Real-Time Preview** - Live markdown/HTML rendering in mobile viewport
- 🚀 **Docker Ready** - Containerized deployment with Nginx

## 🏗️ Architecture

```
src/
├── app/
│   ├── core/           # Authentication, layout, navigation
│   ├── feature/        # Main application features
│   │   ├── home/       # Dashboard with analytics
│   │   ├── editor/     # SBS Studio content editor
│   │   ├── library/    # Volume, book, language management
│   │   └── user/       # User management system
│   └── shared/         # Reusable components and models
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Angular CLI 18+
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sbs-cms

# Install dependencies
npm install

# Start development server
ng serve

# Open browser
open http://localhost:4200
```

### Docker Deployment

```bash
# Build and run with Docker
docker build -t sbs-cms .
docker run -p 80:80 sbs-cms
```

## 🎯 Key Components

### 📊 Dashboard
- Real-time statistics and metrics
- Interactive charts for downloads and usage
- Global distribution analytics
- Floating action buttons for quick actions

### ✏️ SBS Studio Editor
- Split-pane editor with live preview
- Markdown and HTML support
- Mobile device frame simulation
- Real-time content rendering

### 📚 Library Management
- Hierarchical content organization
- Volume → Book → Content structure
- Pagination and search functionality
- CRUD operations with modals

### 👤 User Management
- Role-based permissions
- User status tracking
- Clean table interface
- Floating add button

## 🎨 Design System

### Color Palette
- **Primary**: `#8b4513` (Saddle Brown)
- **Secondary**: `#6b3410` (Dark Brown)
- **Accent**: `#d2b48c` (Tan)
- **Text**: `#3c2415` (Dark Brown)
- **Background**: `#fafafa` (Light Gray)

### Glassmorphism Classes
```css
.glass-card     /* Main content cards */
.glass-panel    /* Secondary panels */
.glass-button   /* Interactive elements */
```

## 🛠️ Development

### Available Scripts
```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run unit tests
npm run lint       # Code linting
npm run e2e        # End-to-end tests
```

### Project Structure
- **Standalone Components** - Modern Angular architecture
- **Lazy Loading** - Optimized route-based code splitting
- **Signal-based State** - Reactive state management
- **Material Design 3** - Consistent UI components

## 🐳 Docker Configuration

Multi-stage build optimized for production:
1. **Build Stage**: Node.js 18 Alpine with Angular CLI
2. **Runtime Stage**: Nginx Alpine serving static files

## 🔧 Configuration

### Environment Variables
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Material Theme
Custom theme with brown color palette matching spiritual content branding.

## 📱 Mobile Responsiveness

- Responsive grid layouts
- Mobile-optimized navigation
- Touch-friendly interactions
- Progressive Web App ready

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Material Design for the component library
- Community contributors and spiritual content creators

---

**Built with ❤️ for spiritual content management**