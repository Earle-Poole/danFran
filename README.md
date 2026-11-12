# Daniel Franzese website

Daniel Franzese’s Next.js site, including the redesigned pages, Google Calendar appearances, and QR sharing.

## Local development

Use the Node version in `.node-version` and the Yarn version pinned in `package.json`.

```sh
corepack yarn install --frozen-lockfile
corepack yarn dev
```

Open [localhost:3000](http://localhost:3000).

## Verification

```sh
corepack yarn lint
corepack yarn typecheck
corepack yarn test
corepack yarn build
corepack yarn test:e2e
```

## Calendar, QR and deployment

- Set calendar variables from [.env.example](.env.example) in `.env.local` or in Vercel. The Google service account needs read access to the calendar. Keep its credentials server-side. When there are no upcoming appearances, the homepage schedule and its navigation links are hidden.
- `/qr` temporarily redirects to the destination in [next.config.js](next.config.js). `/qr/share` displays and downloads the QR graphic, which encodes `https://www.whatsupdanny.com/qr`.
- For Vercel production, set `NEXT_PUBLIC_DEPLOYMENT_ENV=production` and `NEXT_PUBLIC_SITE_URL` to the public HTTPS origin. Set `NEXT_PUBLIC_DEPLOYMENT_ENV=preview` on Preview deployments to keep them out of search indexes.
