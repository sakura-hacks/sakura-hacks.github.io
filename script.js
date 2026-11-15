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
        iso: '2026-12-19T15:30:00', // Saturday, Dec 19, 2026 at 3:30 PM
        offset: '-06:00', // Central Standard Time (December)
        defaultTz: 'America/Chicago', // Central Time
    };

    // --- Live Hackathon Schedule Logic ---
    // Define the schedule (times in 24h format, Central Time)
    const SCHEDULE = [
        {
            time: '15:30',
            label: 'Arrival & Fuel Up',
            desc: 'Check in at the Library Media Center desk, find your team table, and grab complimentary pizza slices and drinks.'
        },
        {
            time: '15:45',
            label: 'Opening Ceremony',
            desc: 'Introduction of the mentor staff, rules review, and reveal of the challenge details.'
        },
        {
            time: '16:00',
            label: 'Hacking Sprint',
            desc: 'Brainstorming ideas, confirming environments, and executing core software engineering.'
        },
        {
            time: '18:15',
            label: 'Code Freeze',
            desc: 'Hand tools down. All project modifications stop, and teams display completed screens.'
        },
        {
            time: '18:20',
            label: 'Exhibition Judging',
            desc: 'Judges circulate the space. Teams deliver live project feature demonstrations.'
        },
        {
            time: '18:45',
            label: 'Closing Ceremony',
            desc: 'Distribution of rank certificates and top-tier technical gear/gift card prizes.'
        }
    ];

    // Helper to get Date object for a schedule item in the selected timezone
    function getScheduleDate(item, tz) {
        // Use event date (YYYY-MM-DD) + item.time (HH:mm)
        // Build the absolute time of this schedule item in Central Time
        return new Date(EVENT_START.iso.split('T')[0] + 'T' + item.time + ':00' + EVENT_START.offset);
    }

    function renderLiveSchedule() {
        const tz = timezoneSelect ? timezoneSelect.value : EVENT_START.defaultTz;
        const now = new Date();
        let foundCurrent = false;
        let html = '';
        SCHEDULE.forEach((item, idx) => {
            const schedDate = getScheduleDate(item, tz);
            const nextSchedDate = SCHEDULE[idx+1] ? getScheduleDate(SCHEDULE[idx+1], tz) : null;
            let status = '';
            if (now >= schedDate && (!nextSchedDate || now < nextSchedDate)) {
                status = 'current';
                foundCurrent = true;
            } else if (now < schedDate && !foundCurrent) {
                status = 'upcoming';
            } else if (now > schedDate) {
                status = 'done';
            }
            html += `<div class="timeline-item live-item ${status}">
                <div class="time">${item.time}</div>
                <div><b>${item.label}:</b> ${item.desc}
                    ${status === 'current' ? '<span class="live-status live-now">Happening Now</span>' : ''}
                    ${status === 'upcoming' ? '<span class="live-status live-upcoming">Up Next</span>' : ''}
                    ${status === 'done' ? '<span class="live-status live-done">Done</span>' : ''}
                </div>
            </div>`;
        });
        const liveScheduleDiv = document.getElementById('live-schedule');
        if (liveScheduleDiv) liveScheduleDiv.innerHTML = html;
    }

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
        // Absolute event start (Central Time), shown in the viewer's chosen timezone
        const eventTime = Date.parse(EVENT_START.iso + EVENT_START.offset);
        const diff = eventTime - now.getTime();
        countdownTimer.textContent = formatCountdown(diff);
        const eventTimeStr = new Date(eventTime).toLocaleString([], { timeZone: tz, dateStyle: 'full', timeStyle: 'short' });
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
        timezoneSelect.addEventListener('change', () => {
            updateCountdown();
            renderLiveSchedule();
        });
        updateCountdown();
        renderLiveSchedule();
        setInterval(() => {
            updateCountdown();
            renderLiveSchedule();
        }, 1000);
    } else if (document.getElementById('live-schedule')) {
        // Fallback: just render schedule if no timezone select
        renderLiveSchedule();
    }
});
