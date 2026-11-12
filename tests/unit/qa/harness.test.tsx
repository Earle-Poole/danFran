import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { providerFixtures } from '../../fixtures/provider'

function FixtureStatus({ state }: { state: keyof typeof providerFixtures }) {
  const fixture = providerFixtures[state]

  return (
    <output aria-label="provider fixture status">
      {fixture.status === 200 ? 'ready' : 'unavailable'}
    </output>
  )
}

describe('QA harness', () => {
  it('renders real jsdom assertions with deterministic provider fixtures', () => {
    render(<FixtureStatus state="failure" />)

    expect(screen.getByRole('status', { name: 'provider fixture status' })).toHaveTextContent(
      'unavailable'
    )
  })
})
