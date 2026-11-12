import { describe, expect, it } from 'vitest'
import { findAppearanceEventById, getAppearanceEventPath } from '../../../lib/calendar/event-links'
import { appearanceEvents } from '../../fixtures/calendar'

describe('opaque event leaf paths', () => {
  it('creates a detail path only for normalized 24-character lowercase hexadecimal IDs', () => {
    const event = appearanceEvents[0]
    expect(getAppearanceEventPath(event)).toBe(`/calendar/${event.id}`)
    expect(getAppearanceEventPath({ ...event, id: 'provider-event-id' })).toBeNull()
    expect(getAppearanceEventPath({ ...event, id: 'A'.repeat(24) })).toBeNull()
    expect(getAppearanceEventPath({ ...event, id: 'f'.repeat(23) })).toBeNull()
  })

  it('does not resolve malformed IDs or expose a provider identifier through lookup', () => {
    const event = appearanceEvents[0]
    expect(findAppearanceEventById(appearanceEvents, event.id)).toEqual(event)
    expect(findAppearanceEventById(appearanceEvents, 'provider-event-id')).toBeNull()
    expect(findAppearanceEventById(appearanceEvents, '0123456789abcdef01234567')).toBeNull()
  })
})
