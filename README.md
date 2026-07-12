# sakura-hacks
naperville middle school hackathon site :D

## Live Countdown Timer Usage

A live, timezone-aware countdown timer is available on both the homepage (`index.html`) and the hackathon page (`hackathon.html`).

### How it works
- The countdown displays the time remaining until the hackathon event starts.
- Users can select their preferred timezone from a dropdown; the countdown and event start time update accordingly.
- The timer updates every second in real time.

### How to customize
- **Event Start Time:**
  - Edit the `EVENT_START` object in `script.js` to change the event date/time or default timezone:
    ```js
    const EVENT_START = {
        iso: '2026-09-18T15:30:00', // 3:30 PM
        defaultTz: 'America/Chicago', // Central Time
    };
    ```
- **Add to other pages:**
  - Copy the countdown section HTML (see `index.html` or `hackathon.html`) and paste it where you want the countdown to appear.
  - Ensure the IDs (`timezone-select`, `countdown-timer`, `countdown-event-time`) are present and unique per page.

### Dependencies
- No external libraries required. All logic is in `script.js` and styles in `style.css`.

### Example (HTML snippet):
```html
<section class="schedule-section">
  <h2 class="section-title">Live Countdown to Hackathon</h2>
  <div style="text-align:center; margin-bottom: 18px;">
    <label for="timezone-select" style="font-weight:600; margin-right:8px;">Timezone:</label>
    <select id="timezone-select"></select>
  </div>
  <div id="countdown-timer">Loading...</div>
  <div id="countdown-event-time"></div>
</section>
```
