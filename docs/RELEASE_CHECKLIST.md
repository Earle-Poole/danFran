# Release checklist

This carries forward unresolved release work from the completed redesign and calendar integration. It is not a fresh security audit or a claim that the website has been deployed. Historical wave plans and review reports remain locally available under `docs/reports/` and are Git-ignored.

## Before publishing

- Confirm the real production origin and hosting environment. Verify canonical URLs, robots, sitemap, image URLs and error responses against that origin; earlier production checks used a fixture origin.
- Confirm biography wording, current representation and contact details, social destinations, photograph rights and credits, and public claims.
- Complete manual screen-reader, Safari and browser-zoom checks. Automated checks do not replace these reviews.
- Review every video's availability, captions, transcript and audio-description needs. Provider media accessibility has not been confirmed.
- Run the relevant lint, type, unit, browser and production-build checks on the final integrated files. Review dependencies and advisories again before release; historical passing audits are dated evidence.
- Obtain the user's explicit instruction before staging, committing, pushing or deploying.

## Calendar deployment

- Configure server-only credentials and calendar settings as described in [Calendar integration](GOOGLE_CALENDAR.md). Never expose the credential, account details or private calendar ID in client code.
- Confirm the production host supports the documented server cache and refresh strategy; review behavior across processes and CDN caches.
- Verify populated, empty and unavailable feed states, and test real public ticket destinations without making purchases. Confirm the intended refresh interval; development currently defaults to 60 seconds.
- Grant the calendar curator editing access and provide the [quick start](CALENDAR_CURATOR_GUIDE.md).

## Limitations to retain or resolve

- **Historical PDFs:** Original downloads are preserved with adjacent HTML text alternatives. The biography PDF has a figure without alternative text and a malformed historical link; both original PDFs lack Title metadata. Do not describe the original files as fully accessible unless they are repaired and verified.
- **Native image decoding:** The October 31 upgrade resolves sharp 0.35.5 and the local Windows binary reports libheif 1.23.5. Runtime image optimization remains disabled. Verify the deployed Linux optional dependencies before enabling optimization or introducing untrusted image processing.
- **Development-tool advisory:** The October 31 audit found no runtime dependency advisories. A moderate minimatch advisory remains in ESLint/TypeScript-ESLint dependency paths; its fix requires minimatch 11, outside their declared ranges. Review upstream compatibility before changing those majors. Do not treat this dated audit as an ongoing security guarantee.
- **Performance evidence:** Existing measurements are local lab results, not field Core Web Vitals. Recheck the final deployed site before making performance claims.
