document.addEventListener('DOMContentLoaded', () => {
    // Accordion logic
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
            });
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Live Countdown Logic ---
    // Set your event start time here (local time: Central Time, e.g. 2026-09-18T15:30:00-05:00)
    const EVENT_START = {
        iso: '2026-09-18T15:30:00', // 3:30 PM
        defaultTz: 'America/Chicago', // Central Time
    };

    // Polyfill for Intl API timezones fallback
    function getTimeZones() {
        if (window.Intl && typeof Intl.DateTimeFormat === 'function') {
            try {
                return Intl.supportedValuesOf('timeZone');
            } catch (e) {
                // fallback below
            }
        }
        // Fallback: common timezones
        return [
            'America/Chicago', 'America/New_York', 'America/Denver', 'America/Los_Angeles',
            'Europe/London', 'Europe/Paris', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney',
            'UTC'
        ];
    }

    function pad(n) { return n < 10 ? '0' + n : n; }

    function formatCountdown(ms) {
        if (ms <= 0) return 'Event Started!';
        let s = Math.floor(ms / 1000);
        const days = Math.floor(s / 86400); s %= 86400;
        const hrs = Math.floor(s / 3600); s %= 3600;
        const min = Math.floor(s / 60); s %= 60;
        return `${days}d ${pad(hrs)}h ${pad(min)}m ${pad(s)}s`;
    }

    function updateCountdown() {
        const tz = timezoneSelect.value;
        const now = new Date();
        // Convert event time to selected timezone
        let eventDate;
        try {
            eventDate = new Date(
                new Date(EVENT_START.iso + ':00').toLocaleString('en-US', { timeZone: tz })
            );
        } catch {
            eventDate = new Date(EVENT_START.iso + ':00');
        }
        // But we want the event time in the selected tz, so get the offset
        const eventTime = Date.parse(EVENT_START.iso + ':00Z') + (eventDate.getTime() - Date.parse(EVENT_START.iso + ':00'));
        const diff = eventTime - now.getTime();
        countdownTimer.textContent = formatCountdown(diff);
        // Show event time in selected timezone
        const eventTimeStr = new Date(EVENT_START.iso + ':00Z').toLocaleString([], { timeZone: tz, dateStyle: 'full', timeStyle: 'short' });
        countdownEventTime.textContent = `Event starts at: ${eventTimeStr} (${tz.replace('_',' ')})`;
    }

    // Populate timezone dropdown
    const timezoneSelect = document.getElementById('timezone-select');
    const countdownTimer = document.getElementById('countdown-timer');
    const countdownEventTime = document.getElementById('countdown-event-time');
    if (timezoneSelect && countdownTimer && countdownEventTime) {
        const tzs = getTimeZones();
        tzs.forEach(tz => {
            const opt = document.createElement('option');
            opt.value = tz;
            opt.textContent = tz.replace('_',' ');
            timezoneSelect.appendChild(opt);
        });
        // Set default
        timezoneSelect.value = EVENT_START.defaultTz;
        timezoneSelect.addEventListener('change', updateCountdown);
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
});
