et Contributing to I Did a Thing!

Thank you for your interest in contributing to this project! This guide will help you get started with development.

## Development Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/i-did-a-thing.git
   cd i-did-a-thing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   This will start a local development server with live reload. The site will be available at `http://localhost:8080` by default.

4. **Build for production**
   ```bash
   npm run build
   ```
   This generates the static files in the `docs/` folder, ready for deployment.

5. **Clean build files**
   ```bash
   npm run clean
   ```

## Project Structure

```
src/
├── _layouts/
│   └── base.njk           # Main layout template
├── assets/
│   ├── css/
│   │   └── style.css      # Custom styles
│   └── js/
│       └── app.js         # Main application logic
├── index.njk              # Home page template
├── manual.njk             # User manual page template
└── sw.js                  # Service worker for offline functionality

docs/                      # Generated static files (output)
.eleventy.js              # Eleventy configuration
package.json              # Dependencies and scripts
```

## Development Workflow

1. **Edit source files** in the `src/` directory
2. **Test changes** using `npm run dev` with live reload
3. **Build the site** with `npm run build` to generate static files
4. **Test the built site** by opening `docs/index.html` in a browser

## Key Features to Test

### Toggle Button Functionality
- Click the "I did it!" button to toggle today's status
- Verify the rainbow animation appears when active
- Check that the state persists after page reload

### Calendar Functionality
- Navigate between months using arrow buttons
- Verify green dots appear on completed days
- Check that today's date is highlighted
- Test that clicking the toggle button updates the calendar

### Local Storage
- Complete tasks on different days
- Refresh the page and verify data persists
- Test in different browsers/incognito mode

### Responsive Design
- Test on different screen sizes
- Verify mobile layout works correctly
- Check that animations work on touch devices

## Adding New Features

1. **Modify templates** in `src/` directory (`.njk` files)
2. **Update styles** in `src/assets/css/style.css`
3. **Add JavaScript functionality** in `src/assets/js/app.js`
4. **Test thoroughly** with `npm run dev`
5. **Build and verify** with `npm run build`

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch. The GitHub Actions workflow:

1. Installs dependencies
2. Builds the site using Eleventy
3. Deploys the `docs/` folder to GitHub Pages

## Code Style Guidelines

- Use semantic HTML5 elements
- Follow Bootstrap conventions for CSS classes
- Write clean, commented JavaScript
- Use consistent indentation (2 spaces)
- Test across different browsers

## Troubleshooting

### Development Server Issues
- Ensure Node.js version is 16+
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and run `npm install` again

### Build Issues
- Check for syntax errors in templates
- Verify all file paths are correct
- Ensure all dependencies are installed

### Local Storage Issues
- Test in different browsers
- Check browser developer tools for errors
- Verify localStorage is enabled

## Reporting Issues

When reporting bugs or requesting features:

1. Check existing issues first
2. Provide clear reproduction steps
3. Include browser and OS information
4. Add screenshots for UI issues

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with clear messages
5. Push to your fork and create a pull request
6. Ensure all tests pass and the site builds correctly

Thank you for contributing! 🎉
