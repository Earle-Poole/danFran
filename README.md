# Daniel Franzese website

Next.js App Router website with biography, booking, press, modeling and video galleries, and appearances supplied by a private Google Calendar. Page content and metadata render on the server; interactive navigation, galleries, playback and calendar refresh use client components.

## Local development

Use Node **24.20.0** (`.node-version`) and the repository-pinned Yarn **1.22.22** through Corepack. Keep `yarn.lock` as the only project lockfile.

```sh
corepack yarn install --frozen-lockfile
corepack yarn dev --hostname 127.0.0.1
```

Open [localhost:3000](http://localhost:3000). To use another port, append `--port 3170` to the dev command. Application routes live in `app/`; shared content lives in `lib/content/`.

Development and production builds explicitly use Webpack for compatibility with the existing asset imports.

## Verification

```sh
corepack yarn lint
corepack yarn typecheck
corepack yarn test
corepack yarn build
corepack yarn test:e2e
```

See [playwright.config.ts](playwright.config.ts) for browser setup and environment variables that enable additional acceptance suites. Test fixtures must not write to the real calendar, submit real signups, or send booking messages.

The additional server-rendered event/SEO checks run with `node scripts/qa/run-modernization.mjs`. They generate synthetic credentials and intercept provider requests in test processes; no production fixture switch is exposed.

## Documentation

- [Design specification](docs/REDESIGN_SPECIFICATION.md): shared style guide, page structure, original photography, accessibility and motion decisions.
- [Calendar quick start](docs/CALENDAR_CURATOR_GUIDE.md): instructions for the person creating events, also available as a [browser guide with a copyable template](docs/guides/calendar-curator-guide.html).
- [Calendar integration](docs/GOOGLE_CALENDAR.md): server configuration, event fields, refresh behavior and hosting limits.
- [Release checklist](docs/RELEASE_CHECKLIST.md): outstanding verification and known operational limitations.

Completed implementation plans, agent playbooks, baseline notes and Markdown reports are Git-ignored local history. They remain on disk in their existing locations; maintained documentation above is intended to travel with the repository.

## Calendar appearances

The homepage section, Live Dates links and full `/calendar` page appear when there are upcoming displayable events. When there are none, the section and links are hidden and `/calendar` returns 404. The development refresh interval defaults to 60 seconds.

Each listed event links to its own `/calendar/<opaque-id>` page. Event search metadata is included only when the calendar supplies the required venue facts; see the optional fields in the integration guide.

Keep Google credentials server-side and outside the repository. Use the ignored `.env.local` for local settings and [.env.example](.env.example) for configuration names.

## Vercel configuration

For Vercel's Production environment, set `NEXT_PUBLIC_DEPLOYMENT_ENV=production` and `NEXT_PUBLIC_SITE_URL` to the actual public HTTPS origin, without a path. The production build rejects missing, local or placeholder origins. Configure the server-only calendar secrets separately using the integration guide.

Keep Preview deployments in `preview` mode so they remain non-indexable. Public metadata settings are read during the build, so changing them requires a new build. Verify the real deployment's canonical URLs, sitemap, indexing policy and calendar behavior before release; a fixture-origin test cannot establish production readiness.

## Working agreements

Do not stage, commit, push or deploy without the user's explicit instruction. Preserve existing uncommitted work.

When delegating, use separate top-level chats with the `DFR-CODE` naming convention, such as `DFR-QA` for verification or `DFR-UI` for design work. Follow [AGENTS.md](AGENTS.md) before editing framework code.
