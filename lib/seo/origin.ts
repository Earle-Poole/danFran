export type DeploymentEnvironment = 'development' | 'preview' | 'production'

const deploymentEnvironments: readonly DeploymentEnvironment[] = [
  'development',
  'preview',
  'production',
]

/**
 * Reads the explicitly configured deployment mode. Unknown or missing values
 * fail closed to development, which is the non-indexable mode.
 */
export const getDeploymentEnvironment = (
  value: string | undefined = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV,
): DeploymentEnvironment =>
  deploymentEnvironments.includes(value as DeploymentEnvironment)
    ? (value as DeploymentEnvironment)
    : 'development'

/**
 * Returns only an origin. Paths, query strings, fragments, credentials and
 * non-web protocols are rejected so metadata cannot advertise an accidental
 * local or malformed URL.
 */
export const parsePublicOrigin = (value: string | null | undefined): string | null => {
  if (!value?.trim()) return null

  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    if (url.username || url.password || url.search || url.hash) return null
    if (url.pathname !== '' && url.pathname !== '/') return null
    return url.origin
  } catch {
    return null
  }
}

const isPrivateOrLocalHostname = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '')
  // Production metadata uses a verified DNS origin. Rejecting all IP literals
  // also covers IPv6 loopback, private, link-local, and unspecified hosts.
  if (normalized.includes(':')) return true
  if (
    normalized === 'localhost' ||
    normalized.endsWith('.localhost') ||
    normalized.endsWith('.local') ||
    normalized.endsWith('.internal') ||
    normalized === '0.0.0.0' ||
    normalized === '::1'
  ) {
    return true
  }

  const octets = normalized.split('.').map(Number)
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return false
  }
  return true
}

export const isPublicProductionOrigin = (origin: string): boolean => {
  try {
    return !isPrivateOrLocalHostname(new URL(origin).hostname)
  } catch {
    return false
  }
}

export const getConfiguredOrigin = ({
  environment = getDeploymentEnvironment(),
  value = process.env.NEXT_PUBLIC_SITE_URL,
}: {
  environment?: DeploymentEnvironment
  value?: string
} = {}): string | null => {
  const origin = parsePublicOrigin(value)

  // The mode is intentionally part of the input even though all environments
  // use the same syntax. It makes release checks explicit and keeps preview
  // and local rendering safe when no origin has been supplied.
  if (environment === 'production' && (!origin || !isPublicProductionOrigin(origin))) return null
  return origin
}

/**
 * Explicit release validation. Rendering and local builds use the nullable
 * helpers above; production CI/deployment checks should call this function.
 */
export const validateProductionOrigin = (
  value: string | null | undefined = process.env.NEXT_PUBLIC_SITE_URL,
): string => {
  const origin = parsePublicOrigin(value)
  if (!origin || !isPublicProductionOrigin(origin)) {
    throw new Error(
      'Production SEO validation requires NEXT_PUBLIC_SITE_URL to be an absolute http(s) origin without a path, query, fragment, or credentials.',
    )
  }
  return origin
}
