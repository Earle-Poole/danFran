export const getFragmentId = (hash: string): string | null => {
  if (!hash || hash === '#') return null
  try {
    return decodeURIComponent(hash.replace(/^#/, '')) || null
  } catch {
    return null
  }
}

export const getFocusableRouteTarget = (root: ParentNode = document): HTMLElement | null =>
  root.querySelector<HTMLElement>('[data-route-heading], h1, h2, main')

export const findFragmentTarget = (hash: string) => {
  if (!hash || typeof document === 'undefined') return null
  const fragmentId = getFragmentId(hash)
  if (!fragmentId) return null
  const target = document.getElementById(fragmentId)
  if (fragmentId === 'main-content') return target
  return target?.querySelector<HTMLElement>('[data-route-heading],h1,h2,h3') ?? target
}
