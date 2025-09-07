# I Did a Thing! 🎉

QA: https://aallbrig.github.io/did-a-thing/
PROD: 

A simple, beautiful daily task tracking app to help you build consistent habits and celebrate your daily accomplishments.

## ✨ Features

- **One-Click Tracking**: Large, satisfying toggle button to mark today as complete
- **Animated Feedback**: Beautiful rainbow border animation when you complete your daily task
- **Visual Progress**: Calendar view with green dots showing your completion history
- **Offline Ready**: Works offline after first load using service worker and localStorage
- **Mobile Friendly**: Responsive design that works great on all devices
- **No Backend Required**: Pure client-side app using localStorage for data persistence

## 🚀 Quick Start

### For Users
1. Visit the live site: [https://yourusername.github.io/i-did-a-thing](https://yourusername.github.io/i-did-a-thing)
2. Click the "I did it!" button to mark today as complete
3. View your progress in the calendar below
4. Check out the User Manual for detailed instructions

### For Developers

#### Prerequisites
- Node.js 16+ and npm
- Git

#### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/i-did-a-thing.git
cd i-did-a-thing

# Install dependencies
npm install

# Start development server with live reload
npm run dev

# Build for production
npm run build
```

The site will be available at `http://localhost:8080` during development.

## 🏗️ Tech Stack

- **Static Site Generator**: [Eleventy (11ty)](https://www.11ty.dev/)
- **CSS Framework**: [Bootstrap 5](https://getbootstrap.com/) (via CDN)
- **JavaScript**: Vanilla ES6+ with localStorage
- **Deployment**: GitHub Pages with GitHub Actions
- **Offline Support**: Service Worker for caching

## 📁 Project Structure

```
src/
├── _layouts/
│   └── base.njk           # Shared layout with Bootstrap CDN links
├── assets/
│   ├── css/
│   │   └── style.css      # Custom styles and animations
│   └── js/
│       └── app.js         # Main app logic and localStorage handling
├── index.njk              # Home page with toggle button and calendar
├── manual.njk             # User manual and about page
└── sw.js                  # Service worker for offline functionality

docs/                      # Built static files (GitHub Pages ready)
.eleventy.js              # Eleventy configuration
```

## 🎯 How It Works

1. **Daily Toggle**: Click the circular "I did it!" button to mark today as complete
2. **Visual Feedback**: Button shows animated rainbow border when active
3. **Calendar View**: Navigate months to see your progress with green completion dots
4. **Data Persistence**: All data saved in browser localStorage (device-specific)
5. **Offline Ready**: App cached for offline use after first visit

## 🚀 Deployment

### GitHub Pages (Automatic)
1. Push to `main` branch
2. GitHub Actions automatically builds and deploys
3. Site available at `https://yourusername.github.io/i-did-a-thing`

### Manual Deployment
```bash
npm run build
# Upload contents of docs/ folder to any static hosting service
```

## 🛠️ Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development instructions.

### Available Scripts
- `npm run dev` - Start development server with live reload
- `npm run build` - Build static files for production
- `npm run clean` - Remove built files

### Key Features to Test
- Toggle button animation and state persistence
- Calendar navigation and completion dots
- Responsive design on mobile devices
- Offline functionality after first load

## 📱 Browser Support

- Modern browsers with ES6+ support
- localStorage support required
- Service Workers supported (optional, for offline use)

## 🔮 Future Enhancements

- Streak counters and statistics
- Multiple habit tracking
- Data export/import functionality
- Customizable themes
- Habit categories and goals

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🎉 Acknowledgments

- Built with [Eleventy](https://www.11ty.dev/)
- Styled with [Bootstrap](https://getbootstrap.com/)
- Hosted on [GitHub Pages](https://pages.github.com/)

---

**Start building your daily habits today!** 🌟
