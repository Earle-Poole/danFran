# UI showcase fixture

This is a test-only Vite entry point for the UI worker's primitive showcase. It
does not add a production route or page. When CTL transfers
`tests/integration/ui/fixtures/PrimitiveShowcase.tsx`, the entry discovers its
default export (or named `PrimitiveShowcase` export) and renders it.

Run it on the QA fixture port with:

```text
QA_FIXTURE_PORT=3114 corepack yarn vite --config tests/fixtures/ui/vite.config.mts --host 127.0.0.1
```

The renderer imports the real global stylesheet, uses the repository's
Tailwind/PostCSS toolchain with test fixture content included, maps the
repository aliases, and serves the repository `public/` directory unchanged.
