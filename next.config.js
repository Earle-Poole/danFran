const { isIP } = require('node:net')

// Vercel production builds must not publish pages with missing or placeholder
// canonicals. Local production-mode fixtures remain usable outside Vercel.
if (process.env.VERCEL_ENV === 'production') {
  const value = process.env.NEXT_PUBLIC_SITE_URL
  let origin
  try {
    origin = value ? new URL(value) : null
  } catch {
    origin = null
  }
  const hostname = origin?.hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '')
  const localHost = hostname && (
    hostname === 'localhost' || hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') || hostname.endsWith('.internal') || !hostname.includes('.')
  )
  const placeholder = hostname && (
    hostname === 'example.com' || hostname.endsWith('.example.com') ||
    hostname === 'example.net' || hostname.endsWith('.example.net') ||
    hostname === 'example.org' || hostname.endsWith('.example.org') ||
    hostname.endsWith('.invalid') || hostname.endsWith('.test') || hostname.endsWith('.example')
  )
  if (
    process.env.NEXT_PUBLIC_DEPLOYMENT_ENV !== 'production' ||
    !origin || origin.protocol !== 'https:' || origin.username || origin.password ||
    origin.pathname !== '/' || origin.search || origin.hash ||
    !hostname || localHost || isIP(hostname) || placeholder
  ) {
    throw new Error('Vercel production requires NEXT_PUBLIC_DEPLOYMENT_ENV=production and NEXT_PUBLIC_SITE_URL set to a real public HTTPS origin.')
  }
}

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  redirects() {
    return [{ source: '/qr', destination: '/', permanent: false }]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**/0.jpg',
      },
    ],
    // UPG verified the native stack locally; keep optimization off for this
    // migration until it is verified on the deployed Vercel platform.
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://img.youtube.com",
              "font-src 'self'",
              "connect-src 'self' https://vitals.vercel-insights.com",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
              "form-action 'self' https://udsterleads.us10.list-manage.com",
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}
