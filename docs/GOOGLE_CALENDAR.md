# Private Google Calendar appearances

For the person maintaining events in Google Calendar, use the [plain-language curator guide](CALENDAR_CURATOR_GUIDE.md) or the [browser guide with copyable templates](guides/calendar-curator-guide.html).

The appearances feed reads one dedicated, private Google Calendar with a
read-only service account. The browser only receives the normalized feed from
`/api/appearances`; it never receives Google credentials, the calendar ID,
account details, raw Google objects, or source error bodies.

## Configuration

Set these server-only variables in the deployment environment (or in the local
ignored `.env.local` file):

```text
GOOGLE_CALENDAR_ID=the-private-calendar-id
GOOGLE_APPLICATION_CREDENTIALS=C:\absolute\path\service-account.json
# Or use the complete JSON credential as a deployment secret:
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
GOOGLE_CALENDAR_REFRESH_SECONDS=60
GOOGLE_CALENDAR_LOOKAHEAD_DAYS=365
```

`GOOGLE_SERVICE_ACCOUNT_JSON` takes precedence over the file path. The file
path must be absolute. The service-account email must have reader access to the
dedicated calendar, and the Google Calendar API must be enabled for the
project. The implementation requests only
`https://www.googleapis.com/auth/calendar.events.readonly`.

The default refresh is 60 seconds and the default lookahead is one year. The
cache is request-driven and process-local: simultaneous requests share one
source request, but a multi-instance deployment may fetch once per instance.

Calendar routes also perform a Proxy preflight so empty and missing-event
requests receive a useful 404 page even without JavaScript. On Vercel the
Proxy can run separately from page rendering, with a separate source cache;
allow for an additional read per cache interval rather than assuming a single
global fetch. Known source outages return 503 from both the API and calendar
page routes. Page routes provide a self-contained recovery page that works
without JavaScript, with noindex/no-store headers and `Retry-After: 60`.
Unexpected render errors retain the App Router error boundaries. An outage
is never treated as an empty feed.

## Event entry format

Use the event title, location, start/end, and an optional plain-text or Google
formatted description. Put one metadata field on its own line using the exact
labels below; labels and values are case-insensitive.

```text
Event status: scheduled
Ticket status: on-sale
Tickets: https://tickets.example-venue.co/dan
Waitlist: https://tickets.example-venue.co/dan-waitlist
Ticket provider: Example Tickets
Category: comedy

Doors at 6:30 PM. The show starts at 7:30 PM.
```

Supported event statuses are `scheduled`, `postponed`, `cancelled`, and
`rescheduled`. If the line is absent, the event is treated as scheduled. An
unknown explicit event status is hidden rather than presented as a confirmed
show.

Supported ticket statuses are `on-sale`, `presale`, `sold-out`,
`coming-soon`, and `unknown`. A ticket URL never infers a ticket status. A
waitlist URL is used only for an explicitly `sold-out` event. Cancelled and
postponed events suppress ticket actions. Ticket and waitlist links must be
HTTPS links without credentials or obvious placeholder hosts.

Google deleted/tentative/private events and non-regular Google event types are
omitted. A retained calendar record with an explicit `Event status:
cancelled` remains visible as a cancellation notice. All-day dates remain
date-only values; timed events retain the event/calendar IANA timezone for
display.

### Optional event-search venue details

For an event to receive Google Event structured data, add the following complete
venue fields as separate description lines. Keep the ordinary Google Calendar
location field for the attendee-facing location label as well.
Google's [Event structured-data requirements](https://developers.google.com/search/docs/appearance/structured-data/event)
require a leaf page, event name and start date, plus a named `Place` and postal
address for event-search eligibility.

```text
Venue name: The Paper Room
Street address: 100 Main Street
City: Chicago
Region: IL
Postal code: 60601
Country: US
```

`Venue name`, `Street address`, `City`, and `Country` are required together.
`Region` and `Postal code` are optional. These lines are consumed as metadata
and do not appear in the public event description, including when the venue
set is incomplete. A partial set is not exposed as structured venue data and
does not produce Event JSON-LD; the event page and sitemap entry can still be
available. The site never derives an address from the free-form location, nor
does it invent a price, ticket availability, image, or previous date.

Each event page uses the normalized opaque 24-character event ID. Updating the
title, venue, or event time does not change that URL as long as the source
Google event ID remains the same.
