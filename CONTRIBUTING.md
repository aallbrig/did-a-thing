# Contributing to Routine Mark

Thank you for your interest in contributing to this project! This guide will help you get started with development.

## Development Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/aallbrig/routine-mark.git
   cd routine-mark
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

## Testing with Fake Data

During development, you may want to test the calendar with fake historical data to see how the app looks with various completion patterns.

### Browser Console Commands

Open your browser's Developer Tools (F12) and use the Console tab to run these commands:

#### Generate Last 7 Days Test Data
This creates a realistic pattern where most days are completed except the day before yesterday:

```javascript
// Generate test data for the last 7 days
const generateLast7Days = () => {
    const data = {};
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        
        // Yesterday = active, day before yesterday = inactive, rest = active
        if (i === 2) { // Day before yesterday
            data[dateKey] = false;
        } else {
            data[dateKey] = true;
        }
    }
    
    localStorage.setItem('didAThingData', JSON.stringify(data));
    console.log('✅ Generated 7 days of test data. Reload the page to see changes.');
    console.log('Pattern: Today through last week (mostly completed, day before yesterday skipped)');
};

generateLast7Days();
```

#### Generate Random Month Data
Create a full month of random completion data:

```javascript
// Generate random test data for the current month
const generateRandomMonth = () => {
    const data = {};
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateKey = date.toISOString().split('T')[0];
        
        // 70% chance of completion (realistic habit tracking)
        data[dateKey] = Math.random() < 0.7;
    }
    
    localStorage.setItem('didAThingData', JSON.stringify(data));
    console.log(`✅ Generated random data for ${daysInMonth} days. Reload to see changes.`);
    console.log('Pattern: ~70% completion rate for current month');
};

generateRandomMonth();
```

#### Generate Streak Pattern
Create data showing a building habit with increasing consistency:

```javascript
// Generate a "building habit" pattern over 30 days
const generateStreakPattern = () => {
    const data = {};
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        
        // Higher completion rate for more recent days (building habit)
        const daysSinceStart = 30 - i;
        const completionChance = Math.min(0.9, daysSinceStart * 0.03 + 0.1);
        data[dateKey] = Math.random() < completionChance;
    }
    
    localStorage.setItem('didAThingData', JSON.stringify(data));
    console.log('✅ Generated 30-day "building habit" pattern. Reload to see changes.');
    console.log('Pattern: Increasing consistency over time (10% → 90% completion rate)');
};

generateStreakPattern();
```

#### Clear All Data
Reset the app to a clean state:

```javascript
// Clear all stored data
const clearAllData = () => {
    localStorage.removeItem('didAThingData');
    console.log('🗑️ All data cleared. Reload to see clean state.');
};

clearAllData();
```

#### View Current Data
Inspect what's currently stored:

```javascript
// View current stored data
const viewCurrentData = () => {
    const data = JSON.parse(localStorage.getItem('didAThingData') || '{}');
    const completedDays = Object.values(data).filter(Boolean).length;
    const totalDays = Object.keys(data).length;
    
    console.log('📊 Current Data Summary:');
    console.log(`Total tracked days: ${totalDays}`);
    console.log(`Completed days: ${completedDays}`);
    console.log(`Completion rate: ${totalDays > 0 ? (completedDays / totalDays * 100).toFixed(1) : 0}%`);
    console.log('\n📅 Raw data:', data);
};

viewCurrentData();
```

### Testing Workflow

1. **Start Fresh**: Run `clearAllData()` to reset
2. **Add Test Data**: Use one of the generation functions above
3. **Reload Page**: See the changes reflected in the calendar
4. **Test Interactions**: Click the toggle button to modify today's state
5. **Navigate Calendar**: Use month arrows to see historical data
6. **Verify Persistence**: Reload page to ensure data persists

### Common Test Scenarios

- **New User**: Clear all data to test first-time experience
- **Casual User**: Use `generateLast7Days()` for light usage pattern
- **Consistent User**: Use `generateStreakPattern()` for habit-building scenario
- **Long-term User**: Use `generateRandomMonth()` for established user

After running any console command, **reload the page** to see the changes reflected in the calendar UI.

### Testing Multiple Calendars

For testing the new multiple calendar features, you can use these additional console commands:

#### Generate Multiple Test Calendars
Create several calendars with different colors and test data:

```javascript
// Generate multiple calendars with test data
const generateMultipleCalendars = () => {
    const calendars = [
        { name: "Exercise", color: "#FF6B6B", data: {} },
        { name: "Reading", color: "#4ECDC4", data: {} },
        { name: "Meditation", color: "#45B7D1", data: {} },
        { name: "Water Intake", color: "#96CEB4", data: {} }
    ];
    
    // Generate different patterns for each calendar
    const today = new Date();
    
    calendars.forEach((calendar, calIndex) => {
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            
            // Different completion patterns for each calendar
            let completionChance;
            switch(calIndex) {
                case 0: // Exercise - building habit
                    completionChance = Math.min(0.8, i * 0.02 + 0.2);
                    break;
                case 1: // Reading - consistent
                    completionChance = 0.7;
                    break;
                case 2: // Meditation - sporadic
                    completionChance = 0.4;
                    break;
                case 3: // Water - very consistent
                    completionChance = 0.9;
                    break;
            }
            
            calendar.data[dateKey] = Math.random() < completionChance;
        }
    });
    
    const dataToSave = {
        calendars: calendars,
        activeIndex: 0
    };
    
    localStorage.setItem('didAThingCalendars', JSON.stringify(dataToSave));
    console.log('✅ Generated 4 test calendars with different patterns. Reload to see changes.');
    console.log('Calendars: Exercise (building), Reading (consistent), Meditation (sporadic), Water (high consistency)');
};

generateMultipleCalendars();
```

#### Test Specific Calendar Data
Add test data to a specific calendar by name:

```javascript
// Add test data to a specific calendar
const addDataToCalendar = (calendarName, days = 7, completionRate = 0.7) => {
    const stored = localStorage.getItem('didAThingCalendars');
    if (!stored) {
        console.log('❌ No calendars found. Create some calendars first.');
        return;
    }
    
    const data = JSON.parse(stored);
    const calendar = data.calendars.find(cal => cal.name.toLowerCase().includes(calendarName.toLowerCase()));
    
    if (!calendar) {
        console.log(`❌ Calendar containing "${calendarName}" not found.`);
        console.log('Available calendars:', data.calendars.map(c => c.name).join(', '));
        return;
    }
    
    const today = new Date();
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        calendar.data[dateKey] = Math.random() < completionRate;
    }
    
    localStorage.setItem('didAThingCalendars', JSON.stringify(data));
    console.log(`✅ Added ${days} days of test data to "${calendar.name}" (${(completionRate * 100)}% completion rate)`);
};

// Example usage:
// addDataToCalendar('exercise', 14, 0.8);  // 14 days, 80% completion
```

#### View All Calendar Stats
Get statistics for all calendars:

```javascript
// View stats for all calendars
const viewAllCalendarStats = () => {
    const stored = localStorage.getItem('didAThingCalendars');
    if (!stored) {
        console.log('❌ No calendars found.');
        return;
    }
    
    const data = JSON.parse(stored);
    console.log('📊 All Calendar Statistics:');
    console.log(`Active Calendar: ${data.calendars[data.activeIndex]?.name || 'None'}`);
    console.log('');
    
    data.calendars.forEach((calendar, index) => {
        const totalDays = Object.keys(calendar.data).length;
        const completedDays = Object.values(calendar.data).filter(Boolean).length;
        const completionRate = totalDays > 0 ? (completedDays / totalDays * 100).toFixed(1) : 0;
        
        console.log(`${index === data.activeIndex ? '→' : ' '} ${calendar.name}:`);
        console.log(`   Color: ${calendar.color}`);
        console.log(`   Days tracked: ${totalDays}`);
        console.log(`   Days completed: ${completedDays}`);
        console.log(`   Completion rate: ${completionRate}%`);
        console.log('');
    });
};

viewAllCalendarStats();
```

#### Clear Specific Calendar
Clear data for one calendar while keeping others:

```javascript
// Clear data for a specific calendar
const clearCalendarData = (calendarName) => {
    const stored = localStorage.getItem('didAThingCalendars');
    if (!stored) {
        console.log('❌ No calendars found.');
        return;
    }
    
    const data = JSON.parse(stored);
    const calendar = data.calendars.find(cal => cal.name.toLowerCase().includes(calendarName.toLowerCase()));
    
    if (!calendar) {
        console.log(`❌ Calendar containing "${calendarName}" not found.`);
        return;
    }
    
    calendar.data = {};
    localStorage.setItem('didAThingCalendars', JSON.stringify(data));
    console.log(`🗑️ Cleared data for "${calendar.name}". Other calendars preserved.`);
};

// Example: clearCalendarData('exercise');
```

### Multi-Calendar Testing Workflow

1. **Start Fresh**: Use `clearAllData()` or create new calendars via UI
2. **Generate Test Calendars**: Run `generateMultipleCalendars()` for comprehensive testing
3. **Test Tab Switching**: Click different calendar tabs to verify independent data
4. **Test Color Changes**: Verify dots change color when switching calendars
5. **Test Edit Functionality**: Edit calendar names and verify tab updates
6. **Test Modal**: Add new calendars via the "+ Add Calendar" button
7. **Test Toggle Button**: Verify button state is independent per calendar
8. **Verify Persistence**: Reload page and check all data persists correctly

### Key Features to Test

- **Independent Data**: Each calendar maintains separate completion data
- **Color Coding**: Completion dots match each calendar's chosen color
- **Tab Navigation**: Switching tabs updates button state and calendar view
- **Name Editing**: In-place editing works and updates tabs immediately
- **Modal Form**: Color picker and text input sync properly
- **Random Colors**: New calendars get random colors on modal open
- **Responsive Design**: Tabs and modal work on mobile devices

Thank you for contributing! 🎉
