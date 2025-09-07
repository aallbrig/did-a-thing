// I Did a Thing! - Main Application Logic - Multiple Calendars Support

class DidAThingApp {
    constructor() {
        this.storageKey = 'didAThingCalendars';
        this.currentDate = new Date();
        this.displayDate = new Date();
        this.calendars = this.loadCalendars();
        this.activeIndex = this.loadActiveIndex();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTabs();
        this.updateToggleButton();
        this.renderCalendar();
        this.updateCalendarHeader();
    }

    // Data Management
    loadCalendars() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                return data.calendars || this.getDefaultCalendars();
            }
            return this.getDefaultCalendars();
        } catch (e) {
            console.error('Error loading calendars:', e);
            return this.getDefaultCalendars();
        }
    }

    loadActiveIndex() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                return data.activeIndex || 0;
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }

    getDefaultCalendars() {
        return [
            {
                name: "My Daily Thing",
                color: "#28a745",
                allowFutureDays: false,
                data: {}
            }
        ];
    }

    saveCalendars() {
        try {
            const dataToSave = {
                calendars: this.calendars,
                activeIndex: this.activeIndex
            };
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
        } catch (e) {
            console.error('Error saving calendars:', e);
        }
    }

    getActiveCalendar() {
        return this.calendars[this.activeIndex] || this.calendars[0];
    }

    // Utility Methods
    generateRandomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }

    truncateText(text, maxLength = 15) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Date Utilities
    getDateKey(date = this.currentDate) {
        return date.toISOString().split('T')[0];
    }

    isToday(date) {
        return this.getDateKey(date) === this.getDateKey(this.currentDate);
    }

    isFutureDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate > today;
    }

    isDayCompleted(date) {
        const activeCalendar = this.getActiveCalendar();
        return activeCalendar.data[this.getDateKey(date)] === true;
    }

    // Event Listeners
    setupEventListeners() {
        const toggleButton = document.getElementById('toggleButton');
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        const addCalendarBtn = document.getElementById('addCalendarBtn');
        const editCalendarBtn = document.getElementById('editCalendarBtn');
        const goToTodayBtn = document.getElementById('goToTodayBtn');

        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleToday());
        }

        if (prevMonth) {
            prevMonth.addEventListener('click', () => this.changeMonth(-1));
        }

        if (nextMonth) {
            nextMonth.addEventListener('click', () => this.changeMonth(1));
        }

        if (goToTodayBtn) {
            goToTodayBtn.addEventListener('click', () => this.goToToday());
        }

        if (addCalendarBtn) {
            addCalendarBtn.addEventListener('click', () => this.openAddCalendarModal());
        }

        if (editCalendarBtn) {
            editCalendarBtn.addEventListener('click', () => this.openEditCalendarModal());
        }

        // Modal form submission
        const addCalendarForm = document.getElementById('addCalendarForm');
        if (addCalendarForm) {
            addCalendarForm.addEventListener('submit', (e) => this.handleAddCalendar(e));
        }

        // Color picker synchronization
        this.setupColorPickerSync();
    }

    setupColorPickerSync() {
        const colorPicker = document.getElementById('calendarColor');
        const colorInput = document.getElementById('calendarColorText');

        if (colorPicker && colorInput) {
            colorPicker.addEventListener('input', (e) => {
                colorInput.value = e.target.value.toUpperCase();
            });

            colorInput.addEventListener('input', (e) => {
                const value = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(value)) {
                    colorPicker.value = value;
                }
            });
        }
    }

    // Calendar Management
    openAddCalendarModal() {
        const modal = new bootstrap.Modal(document.getElementById('addCalendarModal'));
        const randomColor = this.generateRandomColor();
        const deleteBtn = document.getElementById('deleteCalendarBtn');

        // Set random color for new calendars
        document.getElementById('calendarColor').value = randomColor;
        document.getElementById('calendarColorText').value = randomColor.toUpperCase();
        document.getElementById('calendarName').value = '';
        document.getElementById('allowFutureDays').checked = false; // Default to false

        // Update modal title and button text for adding
        document.getElementById('addCalendarModalLabel').textContent = 'Add New Calendar';
        document.querySelector('#addCalendarForm button[type="submit"]').textContent = 'Add Calendar';

        // Hide delete button for new calendars
        deleteBtn.style.display = 'none';

        // Clear edit mode flag
        document.getElementById('addCalendarForm').removeAttribute('data-edit-index');

        modal.show();
    }

    openEditCalendarModal() {
        const modal = new bootstrap.Modal(document.getElementById('addCalendarModal'));
        const activeCalendar = this.getActiveCalendar();
        const deleteBtn = document.getElementById('deleteCalendarBtn');

        // Pre-fill with current calendar details
        document.getElementById('calendarColor').value = activeCalendar.color;
        document.getElementById('calendarColorText').value = activeCalendar.color.toUpperCase();
        document.getElementById('calendarName').value = activeCalendar.name;
        document.getElementById('allowFutureDays').checked = activeCalendar.allowFutureDays || false;

        // Update modal title and button text for editing
        document.getElementById('addCalendarModalLabel').textContent = 'Edit Calendar';
        document.querySelector('#addCalendarForm button[type="submit"]').textContent = 'Save Changes';

        // Show delete button and set up its event listener
        deleteBtn.style.display = 'inline-block';
        deleteBtn.onclick = () => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addCalendarModal'));
            modal.hide();
            this.deleteCalendar();
        };

        // Set edit mode flag with the current calendar index
        document.getElementById('addCalendarForm').setAttribute('data-edit-index', this.activeIndex);

        modal.show();
    }

    handleAddCalendar(e) {
        e.preventDefault();

        const form = document.getElementById('addCalendarForm');
        const name = document.getElementById('calendarName').value.trim();
        const color = document.getElementById('calendarColor').value;
        const allowFutureDays = document.getElementById('allowFutureDays').checked;
        const editIndex = form.getAttribute('data-edit-index');

        if (!name) {
            alert('Please enter a calendar name.');
            return;
        }

        if (editIndex !== null) {
            // Edit existing calendar
            const index = parseInt(editIndex);
            const previousAllowFutureDays = this.calendars[index].allowFutureDays;

            this.calendars[index].name = name;
            this.calendars[index].color = color;
            this.calendars[index].allowFutureDays = allowFutureDays;

            // If future days were disabled, remove all future day data
            if (previousAllowFutureDays && !allowFutureDays) {
                this.removeFutureDayData(this.calendars[index]);
            }
        } else {
            // Add new calendar
            const newCalendar = {
                name: name,
                color: color,
                allowFutureDays: allowFutureDays,
                data: {}
            };

            this.calendars.push(newCalendar);
            this.activeIndex = this.calendars.length - 1;
        }

        this.saveCalendars();

        this.renderTabs();
        this.updateToggleButton();
        this.renderCalendar();
        this.updateCalendarHeader();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCalendarModal'));
        modal.hide();
    }

    removeFutureDayData(calendar) {
        const today = new Date();
        const keysToRemove = [];

        for (const dateKey in calendar.data) {
            const date = new Date(dateKey);
            if (this.isFutureDate(date)) {
                keysToRemove.push(dateKey);
            }
        }

        keysToRemove.forEach(key => {
            delete calendar.data[key];
        });
    }

    switchToCalendar(index) {
        this.activeIndex = index;
        this.saveCalendars();

        this.updateToggleButton();
        this.renderCalendar();
        this.updateCalendarHeader();
        this.updateTabsActiveState();
    }

    enableEditMode() {
        const calendarNameEl = document.getElementById('calendarName');
        const editBtn = document.getElementById('editCalendarBtn');
        const activeCalendar = this.getActiveCalendar();

        const input = document.createElement('input');
        input.type = 'text';
        input.value = activeCalendar.name;
        input.className = 'form-control d-inline-block';
        input.style.width = 'auto';
        input.style.minWidth = '200px';

        const saveEdit = () => {
            const newName = input.value.trim();
            if (newName && newName !== activeCalendar.name) {
                activeCalendar.name = newName;
                this.saveCalendars();
                this.renderTabs();
            }
            calendarNameEl.textContent = activeCalendar.name;
            editBtn.style.display = 'inline-block';
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });

        calendarNameEl.textContent = '';
        calendarNameEl.appendChild(input);
        editBtn.style.display = 'none';
        input.focus();
        input.select();
    }

    // UI Rendering
    renderTabs() {
        const tabsContainer = document.getElementById('calendarTabs');
        if (!tabsContainer) return;

        let tabsHTML = '<ul class="nav nav-tabs" role="tablist">';

        this.calendars.forEach((calendar, index) => {
            const isActive = index === this.activeIndex ? 'active' : '';
            const truncatedName = this.truncateText(calendar.name);

            tabsHTML += `
                <li class="nav-item" role="presentation">
                    <button class="nav-link ${isActive}" 
                            onclick="window.didAThingApp.switchToCalendar(${index})"
                            type="button" role="tab">
                        <span class="calendar-dot" style="background-color: ${calendar.color}"></span>
                        ${truncatedName}
                    </button>
                </li>
            `;
        });

        tabsHTML += `
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="addCalendarBtn" type="button">
                    <i class="fas fa-plus"></i> Add Calendar
                </button>
            </li>
        </ul>`;

        tabsContainer.innerHTML = tabsHTML;

        // Re-setup event listener for add button
        const addBtn = document.getElementById('addCalendarBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openAddCalendarModal());
        }
    }

    updateTabsActiveState() {
        const tabs = document.querySelectorAll('#calendarTabs .nav-link');
        tabs.forEach((tab, index) => {
            if (index === this.activeIndex) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    updateCalendarHeader() {
        const calendarNameEl = document.getElementById('calendarNameDisplay');
        const activeCalendar = this.getActiveCalendar();

        if (calendarNameEl) {
            calendarNameEl.textContent = activeCalendar.name;
        }

        // Update CSS custom properties for dynamic theming
        this.updateAppTheme(activeCalendar.color);
    }

    updateAppTheme(color) {
        // Set CSS custom properties for dynamic theming
        document.documentElement.style.setProperty('--calendar-color', color);
        document.documentElement.style.setProperty('--primary-color', color);

        // Calculate lighter and darker variants of the color
        const lighterColor = this.lightenColor(color, 0.1);
        const darkerColor = this.darkenColor(color, 0.1);
        const veryLightColor = this.lightenColor(color, 0.4);

        document.documentElement.style.setProperty('--primary-light', lighterColor);
        document.documentElement.style.setProperty('--primary-dark', darkerColor);
        document.documentElement.style.setProperty('--primary-very-light', veryLightColor);
    }

    // Color manipulation utilities
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    lightenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;

        const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * percent));
        const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * percent));
        const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * percent));

        return this.rgbToHex(r, g, b);
    }

    darkenColor(hex, percent) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return hex;

        const r = Math.max(0, Math.round(rgb.r * (1 - percent)));
        const g = Math.max(0, Math.round(rgb.g * (1 - percent)));
        const b = Math.max(0, Math.round(rgb.b * (1 - percent)));

        return this.rgbToHex(r, g, b);
    }

    // Calendar Logic
    toggleToday() {
        const todayKey = this.getDateKey();
        const toggleButton = document.getElementById('toggleButton');
        const activeCalendar = this.getActiveCalendar();

        // Toggle the state for active calendar
        activeCalendar.data[todayKey] = !activeCalendar.data[todayKey];
        this.saveCalendars();

        // Update UI
        this.updateToggleButton();
        this.renderCalendar();

        // Add bounce animation
        if (activeCalendar.data[todayKey]) {
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

            // Add click event listener for toggling days
            dayElement.addEventListener('click', () => this.toggleDay(currentDay));

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

        // Update stats after rendering calendar
        this.updateStats();
    }

    // New method to toggle any day on the calendar
    toggleDay(date) {
        const activeCalendar = this.getActiveCalendar();
        const dateKey = this.getDateKey(date);

        // Check if trying to mark a future day as done when not allowed
        if (this.isFutureDate(date) && !activeCalendar.allowFutureDays && !activeCalendar.data[dateKey]) {
            this.showFutureDayError();
            return;
        }

        // Toggle the state for the clicked day
        activeCalendar.data[dateKey] = !activeCalendar.data[dateKey];
        this.saveCalendars();

        // Update UI
        this.updateToggleButton();
        this.renderCalendar();
    }

    showFutureDayError() {
        // Remove any existing error message
        const existingError = document.getElementById('futureDayError');
        if (existingError) {
            existingError.remove();
        }

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.id = 'futureDayError';
        errorDiv.className = 'alert alert-warning alert-dismissible fade show mt-3';
        errorDiv.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1050; min-width: 300px;';
        errorDiv.innerHTML = `
            <strong>Future Days Disabled:</strong> Marking future days as done feature is disabled. Edit calendar to enable feature.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        document.body.appendChild(errorDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv && errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    goToToday() {
        this.displayDate = new Date();
        this.renderCalendar();
    }

    // Enhanced method to calculate and display comprehensive stats
    updateStats() {
        const statsContainer = document.getElementById('statsContainer');
        if (!statsContainer) return;

        const activeCalendar = this.getActiveCalendar();
        const today = new Date();

        // Get all dates with data and find calendar start date
        const allDates = Object.keys(activeCalendar.data).sort();
        const startDate = allDates.length > 0 ? new Date(allDates[0]) : today;
        const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

        // Calculate total completions since start
        const totalCompletions = Object.values(activeCalendar.data).filter(Boolean).length;
        const overallPercentage = daysSinceStart > 0 ? Math.round((totalCompletions / daysSinceStart) * 100) : 0;

        // Calculate longest streak
        const longestStreak = this.calculateLongestStreak(activeCalendar);

        // Calculate 7-day stats (only if we have 7+ days of data)
        let stats7Day = null;
        if (daysSinceStart >= 7) {
            let completed7Days = 0;
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateKey = this.getDateKey(date);
                if (activeCalendar.data[dateKey]) {
                    completed7Days++;
                }
            }
            stats7Day = Math.round((completed7Days / 7) * 100);
        }

        // Calculate 30-day stats (only if we have 30+ days of data)
        let stats30Day = null;
        if (daysSinceStart >= 30) {
            let completed30Days = 0;
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateKey = this.getDateKey(date);
                if (activeCalendar.data[dateKey]) {
                    completed30Days++;
                }
            }
            stats30Day = Math.round((completed30Days / 30) * 100);
        }

        // Format start date
        const startDateStr = startDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        let statsHTML = `
            <h5 class="text-center mb-3">Your Progress</h5>
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${longestStreak}</span>
                    <div class="stat-label">Longest Streak</div>
                    <div class="stat-message">${longestStreak > 0 ? `Amazing ${longestStreak} day${longestStreak !== 1 ? 's' : ''} in a row!` : 'Start your streak today!'}</div>
                </div>
                
                <div class="stat-card">
                    <span class="stat-number">${overallPercentage}%</span>
                    <div class="stat-label">Overall Success</div>
                    <div class="stat-message">Since ${startDateStr}</div>
                </div>`;

        // Add 7-day stat
        if (stats7Day !== null) {
            statsHTML += `
                <div class="stat-card">
                    <span class="stat-number">${stats7Day}%</span>
                    <div class="stat-label">Last 7 Days</div>
                    <div class="stat-message">${this.getEncouragingMessage(stats7Day)}</div>
                </div>`;
        } else {
            statsHTML += `
                <div class="stat-card collecting-data">
                    <span class="stat-number">Collecting Data</span>
                    <div class="stat-label">Last 7 Days</div>
                    <div class="stat-message">Need ${7 - daysSinceStart} more day${(7 - daysSinceStart) !== 1 ? 's' : ''}</div>
                </div>`;
        }

        // Add 30-day stat
        if (stats30Day !== null) {
            statsHTML += `
                <div class="stat-card">
                    <span class="stat-number">${stats30Day}%</span>
                    <div class="stat-label">Last 30 Days</div>
                    <div class="stat-message">${this.getEncouragingMessage(stats30Day)}</div>
                </div>`;
        } else {
            statsHTML += `
                <div class="stat-card collecting-data">
                    <span class="stat-number">Collecting Data</span>
                    <div class="stat-label">Last 30 Days</div>
                    <div class="stat-message">Need ${30 - daysSinceStart} more day${(30 - daysSinceStart) !== 1 ? 's' : ''}</div>
                </div>`;
        }

        statsHTML += '</div>';
        statsContainer.innerHTML = statsHTML;
    }

    // Helper method to calculate longest streak
    calculateLongestStreak(calendar) {
        const allDates = Object.keys(calendar.data).sort();
        if (allDates.length === 0) return 0;

        let longestStreak = 0;
        let currentStreak = 0;
        let previousDate = null;

        for (const dateStr of allDates) {
            const currentDate = new Date(dateStr);

            if (calendar.data[dateStr]) {
                if (previousDate === null || this.isConsecutiveDay(previousDate, currentDate)) {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                }
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }

            previousDate = currentDate;
        }

        return longestStreak;
    }

    // Helper method to check if dates are consecutive
    isConsecutiveDay(date1, date2) {
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.abs(date2 - date1) === oneDay;
    }

    // Helper method for encouraging messages
    getEncouragingMessage(percentage) {
        if (percentage >= 80) return `Fantastic! You're crushing it!`;
        if (percentage >= 60) return `Great job! Keep it up!`;
        if (percentage >= 40) return `Good progress! You're building the habit!`;
        if (percentage >= 20) return `Keep going! Every day counts!`;
        return `You've got this! Start strong!`;
    }

    // Calendar Logic
    deleteCalendar() {
        if (this.calendars.length <= 1) {
            alert('You cannot delete the last remaining calendar.');
            return;
        }

        const activeCalendar = this.getActiveCalendar();
        const confirmMessage = `Are you sure you want to delete the calendar "${activeCalendar.name}"? This action cannot be undone.`;

        if (confirm(confirmMessage)) {
            // Remove the calendar
            this.calendars.splice(this.activeIndex, 1);

            // Switch to the first calendar or adjust active index
            if (this.activeIndex >= this.calendars.length) {
                this.activeIndex = this.calendars.length - 1;
            }

            this.saveCalendars();

            // Update UI
            this.renderTabs();
            this.updateToggleButton();
            this.renderCalendar();
            this.updateCalendarHeader();
        }
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
