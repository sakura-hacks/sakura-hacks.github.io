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

    // --- Event start ---
    // Change the date/time here. The offset is Central Time (-06:00 in winter, -05:00 in summer).
    const EVENT_START = {
        iso: '2026-12-19T15:30:00', // Saturday, Dec 19, 2026 at 3:30 PM
        offset: '-06:00'            // Central Standard Time (December)
    };
    const EVENT_MS = Date.parse(EVENT_START.iso + EVENT_START.offset);

    // --- Live Hackathon Schedule ---
    // Times in 24h format, Central Time
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

    function getScheduleDate(item) {
        return new Date(EVENT_START.iso.split('T')[0] + 'T' + item.time + ':00' + EVENT_START.offset);
    }

    function renderLiveSchedule() {
        const liveScheduleDiv = document.getElementById('live-schedule');
        if (!liveScheduleDiv) return;
        const now = new Date();
        let foundCurrent = false;
        let html = '';
        SCHEDULE.forEach((item, idx) => {
            const schedDate = getScheduleDate(item);
            const nextSchedDate = SCHEDULE[idx + 1] ? getScheduleDate(SCHEDULE[idx + 1]) : null;
            let status = '';
            if (now >= schedDate && (!nextSchedDate || now < nextSchedDate)) {
                status = 'current';
                foundCurrent = true;
            } else if (now < schedDate && !foundCurrent) {
                status = 'upcoming';
            } else if (now > schedDate) {
                status = 'done';
            }
            let badge = '';
            if (status === 'current') badge = '<span class="live-status live-now">Happening Now</span>';
            if (status === 'upcoming') badge = '<span class="live-status live-upcoming">Up Next</span>';
            if (status === 'done') badge = '<span class="live-status live-done">Done</span>';
            html += '<div class="timeline-item live-item ' + status + '">' +
                '<div class="time">' + item.time + '</div>' +
                '<div><b>' + item.label + ':</b> ' + item.desc + ' ' + badge + '</div>' +
                '</div>';
        });
        liveScheduleDiv.innerHTML = html;
    }

    if (document.getElementById('live-schedule')) {
        renderLiveSchedule();
        setInterval(renderLiveSchedule, 30000);
    }

    // --- Countdown (days / hours / minutes / seconds boxes) ---
    const countdown = document.getElementById('countdown');

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function updateCountdown() {
        const diff = EVENT_MS - Date.now();
        if (diff <= 0) {
            countdown.innerHTML = '<div class="countdown-done">The hackathon has started!</div>';
            return false;
        }
        const s = Math.floor(diff / 1000);
        const values = {
            days: String(Math.floor(s / 86400)),
            hours: pad(Math.floor((s % 86400) / 3600)),
            minutes: pad(Math.floor((s % 3600) / 60)),
            seconds: pad(s % 60)
        };
        Object.keys(values).forEach(unit => {
            const el = countdown.querySelector('[data-unit="' + unit + '"]');
            if (el && el.textContent !== values[unit]) el.textContent = values[unit];
        });
        return true;
    }

    if (countdown) {
        if (updateCountdown()) {
            const timer = setInterval(() => {
                if (!updateCountdown()) clearInterval(timer);
            }, 1000);
        }
    }

    // --- Falling sakura petals ---
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
        const COLORS = ['#FFB7C5', '#FFC8D3', '#FF9DB3', '#FFD6DF'];
        const count = window.innerWidth < 600 ? 9 : 16;
        const layer = document.createElement('div');
        layer.className = 'petals';
        layer.setAttribute('aria-hidden', 'true');

        function rand(min, max) { return min + Math.random() * (max - min); }

        for (let i = 0; i < count; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            const dur = rand(10, 19);
            petal.style.setProperty('--size', rand(11, 21).toFixed(1) + 'px');
            petal.style.setProperty('--dur', dur.toFixed(1) + 's');
            petal.style.setProperty('--delay', (-rand(0, dur)).toFixed(1) + 's');
            petal.style.setProperty('--drift', rand(-60, 90).toFixed(0) + 'px');
            petal.style.setProperty('--sway-dur', rand(2.4, 4.6).toFixed(1) + 's');
            petal.style.setProperty('--op', rand(0.55, 0.9).toFixed(2));
            petal.style.left = rand(0, 100).toFixed(1) + '%';
            const color = COLORS[i % COLORS.length];
            petal.innerHTML =
                '<div class="petal-inner"><svg viewBox="0 0 20 24">' +
                '<path d="M10 23 C3 18 0 12 2 6 C3.5 2 7 0.5 10 3.2 C13 0.5 16.5 2 18 6 C20 12 17 18 10 23 Z" fill="' + color + '"/>' +
                '<path d="M10 21.5 C9.2 16 9.4 9.5 10 4.5" stroke="#FF8FA8" stroke-width="0.7" fill="none" opacity="0.45"/>' +
                '</svg></div>';
            layer.appendChild(petal);
        }
        document.body.prepend(layer);
    }
});
