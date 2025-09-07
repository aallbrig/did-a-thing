// I Did a Thing! - Main Application Logic

class DidAThingApp {
    constructor() {
        this.storageKey = 'didAThingData';
        this.currentDate = new Date();
        this.displayDate = new Date();
        this.data = this.loadData();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateToggleButton();
        this.renderCalendar();
    }

    // Data Management
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Error loading data:', e);
            return {};
        }
    }

    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }

    // Date Utilities
    getDateKey(date = this.currentDate) {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    isToday(date) {
        return this.getDateKey(date) === this.getDateKey(this.currentDate);
    }

    isDayCompleted(date) {
        return this.data[this.getDateKey(date)] === true;
    }

    // Toggle Button Logic
    setupEventListeners() {
        const toggleButton = document.getElementById('toggleButton');
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');

        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleToday());
        }

        if (prevMonth) {
            prevMonth.addEventListener('click', () => this.changeMonth(-1));
        }

        if (nextMonth) {
            nextMonth.addEventListener('click', () => this.changeMonth(1));
        }
    }

    toggleToday() {
        const todayKey = this.getDateKey();
        const toggleButton = document.getElementById('toggleButton');

        // Toggle the state
        this.data[todayKey] = !this.data[todayKey];
        this.saveData();

        // Update UI
        this.updateToggleButton();
        this.renderCalendar();

        // Add bounce animation
        if (this.data[todayKey]) {
            toggleButton.classList.add('bounce');
            setTimeout(() => toggleButton.classList.remove('bounce'), 1000);
        }
    }

    updateToggleButton() {
        const toggleButton = document.getElementById('toggleButton');
        if (!toggleButton) return;

        const isCompleted = this.isDayCompleted(this.currentDate);

        if (isCompleted) {
            toggleButton.classList.add('active');
            toggleButton.querySelector('.toggle-text').textContent = 'I did it! ✓';
        } else {
            toggleButton.classList.remove('active');
            toggleButton.querySelector('.toggle-text').textContent = 'I did it!';
        }
    }

    // Calendar Logic
    changeMonth(direction) {
        this.displayDate.setMonth(this.displayDate.getMonth() + direction);
        this.renderCalendar();
    }

    renderCalendar() {
        const calendar = document.getElementById('calendar');
        const monthYear = document.getElementById('monthYear');

        if (!calendar || !monthYear) return;

        // Update month/year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        monthYear.textContent = `${monthNames[this.displayDate.getMonth()]} ${this.displayDate.getFullYear()}`;

        // Clear calendar
        calendar.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-header';
            header.textContent = day;
            calendar.appendChild(header);
        });

        // Get first day of month and number of days
        const firstDay = new Date(this.displayDate.getFullYear(), this.displayDate.getMonth(), 1);
        const lastDay = new Date(this.displayDate.getFullYear(), this.displayDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Add empty cells for previous month
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendar.appendChild(emptyDay);
        }

        // Add days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            const currentDay = new Date(this.displayDate.getFullYear(), this.displayDate.getMonth(), day);

            // Check if it's today
            if (this.isToday(currentDay)) {
                dayElement.classList.add('today');
            }

            // Check if day is completed
            if (this.isDayCompleted(currentDay)) {
                dayElement.classList.add('completed');
            }

            calendar.appendChild(dayElement);
        }

        // Fill remaining cells to complete the grid
        const totalCells = calendar.children.length;
        const remainingCells = 42 - totalCells; // 6 weeks * 7 days
        for (let i = 0; i < remainingCells; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendar.appendChild(emptyDay);
        }
    }

    // Utility Methods
    getStats() {
        const totalDays = Object.keys(this.data).length;
        const completedDays = Object.values(this.data).filter(Boolean).length;
        const completionRate = totalDays > 0 ? (completedDays / totalDays * 100).toFixed(1) : 0;

        return {
            totalDays,
            completedDays,
            completionRate
        };
    }

    getCurrentStreak() {
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) { // Check up to a year back
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);

            if (this.isDayCompleted(checkDate)) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    exportData() {
        return {
            exportDate: new Date().toISOString(),
            data: this.data,
            stats: this.getStats()
        };
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.didAThingApp = new DidAThingApp();
});

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
