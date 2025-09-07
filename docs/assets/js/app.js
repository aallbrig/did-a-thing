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

        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleToday());
        }

        if (prevMonth) {
            prevMonth.addEventListener('click', () => this.changeMonth(-1));
        }

        if (nextMonth) {
            nextMonth.addEventListener('click', () => this.changeMonth(1));
        }

        if (addCalendarBtn) {
            addCalendarBtn.addEventListener('click', () => this.openAddCalendarModal());
        }

        if (editCalendarBtn) {
            editCalendarBtn.addEventListener('click', () => this.enableEditMode());
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

        // Set random color
        document.getElementById('calendarColor').value = randomColor;
        document.getElementById('calendarColorText').value = randomColor.toUpperCase();
        document.getElementById('calendarName').value = '';

        modal.show();
    }

    handleAddCalendar(e) {
        e.preventDefault();

        const name = document.getElementById('calendarName').value.trim();
        const color = document.getElementById('calendarColor').value;

        if (!name) {
            alert('Please enter a calendar name.');
            return;
        }

        const newCalendar = {
            name: name,
            color: color,
            data: {}
        };

        this.calendars.push(newCalendar);
        this.activeIndex = this.calendars.length - 1;
        this.saveCalendars();

        this.renderTabs();
        this.updateToggleButton();
        this.renderCalendar();
        this.updateCalendarHeader();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCalendarModal'));
        modal.hide();
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

    // Statistics and utility methods
    getStats() {
        const activeCalendar = this.getActiveCalendar();
        const totalDays = Object.keys(activeCalendar.data).length;
        const completedDays = Object.values(activeCalendar.data).filter(Boolean).length;
        const completionRate = totalDays > 0 ? (completedDays / totalDays * 100).toFixed(1) : 0;

        return {
            totalDays,
            completedDays,
            completionRate,
            calendarName: activeCalendar.name
        };
    }

    getCurrentStreak() {
        const activeCalendar = this.getActiveCalendar();
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateKey = this.getDateKey(checkDate);

            if (activeCalendar.data[dateKey]) {
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
            calendars: this.calendars,
            activeIndex: this.activeIndex,
            stats: this.calendars.map((cal, index) => ({
                name: cal.name,
                color: cal.color,
                ...this.getStatsForCalendar(index)
            }))
        };
    }

    getStatsForCalendar(index) {
        const calendar = this.calendars[index];
        const totalDays = Object.keys(calendar.data).length;
        const completedDays = Object.values(calendar.data).filter(Boolean).length;
        const completionRate = totalDays > 0 ? (completedDays / totalDays * 100).toFixed(1) : 0;

        return {
            totalDays,
            completedDays,
            completionRate
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
