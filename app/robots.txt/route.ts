import { getConfiguredOrigin, getDeploymentEnvironment } from 'lib/seo/origin'

export const dynamic = 'force-dynamic'

export function GET(): Response {
  const environment = getDeploymentEnvironment()
  const origin = getConfiguredOrigin({ environment })
  const indexable = environment === 'production' && Boolean(origin)
  const lines = [
    'User-agent: *',
    indexable ? 'Allow: /' : 'Disallow: /',
    ...(indexable && origin ? [`Sitemap: ${origin}/sitemap.xml`] : []),
  ]

  return new Response(`${lines.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': indexable ? 'all' : 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  })
}
