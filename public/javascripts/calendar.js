async function loadCalendar() {
    console.log("Loading calendar...");
    const calendarContainer = document.getElementById('calendarContainer');
    if (!calendarContainer) {
        console.error('Calendar container not found');
        return;
    }

    let currentDate = new Date();
    let watchEvents = [];

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
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const monthName = currentDate.toLocaleString('default', { month: 'long' });

        let dateCounter = 1;
        let calendarRows = '';
        let firstDayOffset = firstDay.getDay();
        
        for (let week = 0; dateCounter <= lastDay.getDate(); week++) {
            calendarRows += '<tr>';
            for (let day = 0; day < 7; day++) {
                if ((week === 0 && day < firstDayOffset) || dateCounter > lastDay.getDate()) {
                    const prevMonthDay = new Date(year, month, 0).getDate() - firstDayOffset + day + 1;
                    calendarRows += `<td style="height: 60px; border: 1px solid #ddd; vertical-align: top; padding: 2px 4px; color: #ccc;">
                        ${week === 0 ? prevMonthDay : ''}</td>`;
                } else {
                    const currentDateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dateCounter.toString().padStart(2, '0')}`;
                    const dayEvents = watchEvents.filter(event => 
                        event.watch_date.toDateString() === new Date(currentDateStr).toDateString()
                    );

                    calendarRows += `<td style="height: 60px; border: 1px solid #ddd; vertical-align: top; padding: 2px 4px;">
                        <div style="font-size: 12px;">${dateCounter}</div>
                        ${dayEvents.map(event => `
                            <div style="font-size: 10px; padding: 1px 2px; margin: 1px 0; background-color: #e8f5e9; border-radius: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${event.time_start} - ${escapeHTML(event.description)}
                            </div>
                        `).join('')}
                    </td>`;
                    dateCounter++;
                }
            }
            calendarRows += '</tr>';
        }

        calendarContainer.innerHTML = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th colspan="7" style="text-align: center; padding: 5px; background-color: #4CAF50; color: white;">
                            <button onclick="prevMonth()" style="float: left; background: none; border: none; color: white; cursor: pointer;">&lt;</button>
                            ${monthName} ${year}
                            <button onclick="nextMonth()" style="float: right; background: none; border: none; color: white; cursor: pointer;">&gt;</button>
                        </th>
                    </tr>
                    <tr>
                        <th style="padding: 5px; border: 1px solid #ddd; font-size: 12px;">Sun</th>
                        <th style="padding: 5px; border: 1px solid #ddd; font-size: 12px;">Mon</th>
                        <th style="padding: 5px; border: 1px solid #ddd; font-size: 12px;">Tue</th>
                        <th style="padding: 5px; border: 1px solid #ddd; font-size: 12px;">Wed</th>
                        <th style="padding: 5px; border: 1px solid #ddd; font-size: 12px;">Thu</th>
                        <th style="padding: 5px; border: 1px solid #ddd; font-size: 12px;">Fri</th>
                        <th style="padding: 5px; border: 1px solid #ddd; font-size: 12px;">Sat</th>
                    </tr>
                </thead>
                <tbody>
                    ${calendarRows}
                </tbody>
            </table>
        `;
    }

    renderCalendar();

    window.prevMonth = function() {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
        renderCalendar();
    };

    window.nextMonth = function() {
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
        renderCalendar();
    };
}

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded, loading calendar');
    loadCalendar();
});