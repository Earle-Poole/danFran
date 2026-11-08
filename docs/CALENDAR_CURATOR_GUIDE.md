# Add an event to the website

Daniel Franzese / Calendar quick start

Create the event in the shared website calendar in Google Calendar. The website picks it up automatically.

## 1. Create the event

Open the calendar below, sign in with the Google account that has access, and click Create, then Event.

- [Open Google Calendar](https://calendar.google.com/)

1. Choose the shared website calendar provided by the website manager, rather than your personal calendar.
2. Enter the public event title, date, start and end times. Set the time zone to the venue's local time zone.
3. Add the location as Venue, City, State.
4. Leave visibility set to Default visibility. Only include information that can appear publicly on the website.

### 2. Paste this into Description

**Event with tickets on sale**

Replace the bracketed text with the real public ticket link beginning with https://. Keep each setting on its own line.

```text
Event status: Scheduled
Ticket status: On sale
Tickets: [PASTE REAL HTTPS TICKET LINK]
Category: Comedy
```

For a different event type, change Comedy to Speaking or Appearance. You can add a short public description below these lines.

Tickets not available yet? Change Ticket status: On sale to Ticket status: Coming soon and remove the Tickets line.

### 3. Save and check the website

Click Save. Wait 1-2 minutes, then refresh the website. Check the event's date, time, location, and ticket button.

> **Not showing up?:** Check that you saved to the shared website calendar, the event is upcoming within the next year, and visibility is not Private. If you cannot create events in that calendar, ask the website manager for editing access.

## Field reference

These are the fields the website uses. The examples below are illustrative, not actual bookings.

### In the Google Calendar event editor

| Field | Example / what to enter |
| --- | --- |
| Calendar | The shared website calendar, not your personal calendar. |
| Title | Daniel Franzese Live - use the public event name. |
| Date | November 20, 2026 - use the confirmed performance date. |
| Start / end time | 7:30 PM to 9:00 PM. Check AM/PM; use All day only for a genuinely all-day appearance. |
| Time zone | America/Chicago for a Chicago show. Choose the venue's local time zone. |
| Location | Example Theater, Chicago, IL - venue, city, state. |
| Visibility | Default visibility. An event set individually to Private will not appear. |
| Description | Doors at 6:30 PM. Show at 7:30 PM. Add the settings below on separate lines. |

### Settings typed into Description

These are not separate Google Calendar fields. Type each label and value on its own line. When updating a setting, replace its existing line.

| Setting | Example / supported values |
| --- | --- |
| Event status | Event status: Scheduled. Other values: Postponed, Cancelled, Rescheduled. Cancelled and Postponed remove ticket buttons. |
| Ticket status | Ticket status: On sale. Other values: Presale, Sold out, Coming soon, Unknown. Update this yourself when availability changes. |
| Tickets | Tickets: [paste the real public HTTPS ticket link]. Replace all bracketed text. On sale shows Get tickets; Presale shows View presale when a valid link is present. |
| Waitlist (optional) | Waitlist: [paste the real public HTTPS waitlist link]. Used only with Ticket status: Sold out to show Join waitlist. Omit if there is no waitlist. |
| Ticket provider (optional) | Ticket provider: Ticketmaster. Use the actual provider name; this does not change the button label. |
| Category | Category: Comedy. Other values: Speaking, Appearance. |

Only add public information. Any ordinary description text appears on the full schedule page; the settings above are removed from that text.
