import { photos, selectedPhotos, socialLinks } from '../content'
import { parsePublicOrigin } from './origin'

export type SeoSchemaInput =
  | {
      readonly type: 'Person'
      readonly name: string
      readonly description?: string
      readonly sameAs?: readonly string[]
      readonly imagePath?: string
    }
  | {
      readonly type: 'WebSite'
      readonly name: string
      readonly description?: string
    }

export interface JsonLdObject {
  readonly [key: string]: string | readonly string[] | JsonLdObject | undefined
}
export type JsonLdValue = JsonLdObject | readonly JsonLdObject[]

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isOriginalPhotoPath = (value: unknown): value is string =>
  isNonEmptyString(value) && photos.some((photo) => photo.originalPath === value)

const isVerifiedHttpsUrl = (value: unknown): value is `https://${string}` => {
  if (!isNonEmptyString(value)) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password && !url.hash
  } catch {
    return false
  }
}

const hasOnlyKeys = (value: Record<string, unknown>, allowed: readonly string[]): boolean =>
  Object.keys(value).every((key) => allowed.includes(key))

/**
 * Runtime allowlist for the small set of schema types this site can support.
 * Unknown fields and unsupported schema types are rejected rather than copied
 * into JSON-LD just because they happen to be serializable.
 */
export const validateSeoSchema = (value: unknown): SeoSchemaInput | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const candidate = value as Record<string, unknown>

  const name = candidate.name
  if (!isNonEmptyString(name) || typeof candidate.type !== 'string') return null

  if (candidate.description !== undefined && !isNonEmptyString(candidate.description)) return null

  if (candidate.type === 'Person') {
    if (!hasOnlyKeys(candidate, ['type', 'name', 'description', 'sameAs', 'imagePath'])) return null
    if (candidate.sameAs !== undefined) {
      if (
        !Array.isArray(candidate.sameAs) ||
        !candidate.sameAs.every(
          (url) =>
            isVerifiedHttpsUrl(url) &&
            socialLinks.some((social) => String(social.verification) === 'verified' && social.url === url),
        )
      ) return null
    }
    if (candidate.imagePath !== undefined && !isOriginalPhotoPath(candidate.imagePath)) return null
    return {
      type: 'Person',
      name,
      ...(candidate.description ? { description: candidate.description } : {}),
      ...(Array.isArray(candidate.sameAs) ? { sameAs: [...candidate.sameAs] } : {}),
      ...(candidate.imagePath ? { imagePath: candidate.imagePath } : {}),
    }
  }

  if (candidate.type === 'WebSite') {
    if (!hasOnlyKeys(candidate, ['type', 'name', 'description'])) return null
    return {
      type: 'WebSite',
      name,
      ...(candidate.description ? { description: candidate.description } : {}),
    }
  }

  return null
}

const absoluteAssetUrl = (origin: string, path: string): string => `${origin}${path}`

export const buildSeoJsonLd = ({
  origin,
  imagePath = selectedPhotos[0].originalPath,
  schema,
}: {
  origin: string
  imagePath?: string
  schema?: SeoSchemaInput | readonly SeoSchemaInput[]
}): JsonLdValue | null => {
  const validOrigin = parsePublicOrigin(origin)
  const validImagePath = isOriginalPhotoPath(imagePath) ? imagePath : null
  if (!validOrigin || !validImagePath) return null

  const personSameAs = socialLinks
    .filter((social) => String(social.verification) === 'verified')
    .map((social) => social.url)

  const values: JsonLdObject[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${validOrigin}/#person`,
      name: 'Daniel Franzese',
      url: `${validOrigin}/`,
      image: absoluteAssetUrl(validOrigin, validImagePath),
      ...(personSameAs.length ? { sameAs: personSameAs } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${validOrigin}/#website`,
      name: 'Daniel Franzese',
      url: `${validOrigin}/`,
      publisher: { '@id': `${validOrigin}/#person` },
    },
  ]

  const optionalSchemas = schema ? (Array.isArray(schema) ? schema : [schema]) : []
  for (const input of optionalSchemas) {
    const validated = validateSeoSchema(input)
    if (!validated) continue
    if (validated.type === 'Person') {
      values.push({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: validated.name,
        ...(validated.description ? { description: validated.description } : {}),
        ...(validated.sameAs ? { sameAs: validated.sameAs } : {}),
        ...(validated.imagePath
          ? { image: absoluteAssetUrl(validOrigin, validated.imagePath) }
          : {}),
      })
    } else if (validated.type === 'WebSite') {
      values.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: validated.name,
        url: `${validOrigin}/`,
        ...(validated.description ? { description: validated.description } : {}),
      })
    }
  }

  return values
}

/** Prevent JSON-LD text from closing its containing script element. */
export const serializeJsonLd = (value: JsonLdValue): string =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
