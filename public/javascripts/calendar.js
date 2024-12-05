async function loadCalendar() {
    const calendarContainer = document.getElementById('calendarContainer');
    if (!calendarContainer) {
        console.error('Calendar container not found');
        return;
    }

    // State variables
    let currentDate = new Date();
    let selectedDate = null;
    let watchEvents = [];

    // Fetch watch times
    try {
        const response = await fetch('/watchs/time');
        watchEvents = await response.json();
        watchEvents = watchEvents.map(watch => ({
            ...watch,
            watch_date: new Date(watch.watch_date)
        }));
    } catch (error) {
        console.error('Error fetching watch times:', error);
    }

    function renderCalendar() {
        const monthName = currentDate.toLocaleString('default', { month: 'long' });
        const days = getDaysInMonth(currentDate);

        calendarContainer.innerHTML = `
            <div class="calendar-header">
                <button id="prevMonth" class="calendar-nav-button">←</button>
                <h2 class="calendar-title">${monthName} ${currentDate.getFullYear()}</h2>
                <button id="nextMonth" class="calendar-nav-button">→</button>
            </div>

            <div class="calendar-grid">
                ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                    .map(day => `<div class="calendar-day-header">${day}</div>`)
                    .join('')}
            </div>

            <div class="calendar-grid">
                ${days.map((day, index) => {
                    const events = day ? getWatchEventsForDate(day) : [];
                    const isSelected = selectedDate && day && 
                        selectedDate.getDate() === day.getDate() &&
                        selectedDate.getMonth() === day.getMonth();

                    return `
                        <div 
                            class="calendar-cell ${!day ? 'empty' : ''} ${isSelected ? 'selected' : ''}"
                            data-date="${day ? day.toISOString() : ''}"
                        >
                            ${day ? `
                                <div class="calendar-date">${day.getDate()}</div>
                                <div>
                                    ${events.map(event => `
                                        <div class="calendar-event"
                                             title="${escapeHTML(event.description)}">
                                            ${event.time_start} - ${escapeHTML(event.description)}
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>

            ${selectedDate ? `
                <div class="calendar-event-details">
                    <h3 class="calendar-title">Events for ${selectedDate.toLocaleDateString()}</h3>
                    ${getWatchEventsForDate(selectedDate).length > 0 ? 
                        getWatchEventsForDate(selectedDate).map(event => `
                            <div class="event-card">
                                <div class="event-title">${escapeHTML(event.description)}</div>
                                <div class="event-info">
                                    Location: ${escapeHTML(event.location)}
                                </div>
                                <div class="event-info">
                                    Time: ${event.time_start} - ${event.time_end}
                                </div>
                            </div>
                        `).join('')
                        : '<p>No events scheduled</p>'
                    }
                </div>
            ` : ''}
        `;

        // Add event listeners
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
            renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
            renderCalendar();
        });

        // Add click listeners to date cells
        const dateCells = calendarContainer.querySelectorAll('[data-date]');
        dateCells.forEach(cell => {
            if (cell.dataset.date) {
                cell.addEventListener('click', () => {
                    selectedDate = new Date(cell.dataset.date);
                    renderCalendar();
                });
            }
        });
    }

    function getDaysInMonth(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        
        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }
        
        // Add all days in the month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        
        return days;
    }

    function getWatchEventsForDate(date) {
        if (!date) return [];
        return watchEvents.filter(event => 
            event.watch_date.getDate() === date.getDate() &&
            event.watch_date.getMonth() === date.getMonth() &&
            event.watch_date.getFullYear() === date.getFullYear()
        );
    }

    // Initial render
    renderCalendar();
}