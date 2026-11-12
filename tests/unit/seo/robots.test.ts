import { describe, expect, it } from 'vitest'
import { normalizeRobotsDirectives } from '../../helpers/robots'

describe('normalizeRobotsDirectives', () => {
  it('treats comma spacing and directive case as formatting', () => {
    expect(normalizeRobotsDirectives('index,follow')).toEqual(['follow', 'index'])
    expect(normalizeRobotsDirectives('index, follow')).toEqual(['follow', 'index'])
    expect(normalizeRobotsDirectives('NOINDEX, NOFOLLOW')).toEqual(['nofollow', 'noindex'])
  })

  it('preserves additional or malformed directives for exact assertions', () => {
    expect(normalizeRobotsDirectives('index, follow, noarchive')).toEqual([
      'follow',
      'index',
      'noarchive',
    ])
    expect(normalizeRobotsDirectives(undefined)).toEqual([])
  })
})
