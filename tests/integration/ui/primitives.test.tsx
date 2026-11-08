// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ActionLink, Button, Field, Photo, Status } from '../../../components/ui'

describe('UI primitives', () => {
  afterEach(() => cleanup())

  it('keeps native button and anchor semantics distinct', () => {
    render(
      <>
        <Button>Save</Button>
        <ActionLink href="/booking">Book Daniel</ActionLink>
      </>,
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
    expect(screen.getByRole('link', { name: 'Book Daniel' })).toHaveAttribute('href', '/booking')
  })

  it('removes navigation from a disabled action link', () => {
    render(<ActionLink href="/booking" disabled>Book Daniel</ActionLink>)
    const link = screen.getByText('Book Daniel')

    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('tabindex', '-1')
  })

  it('prevents duplicate activation and preserves the action label while loading', () => {
    const onClick = vi.fn()
    render(<Button loading onClick={onClick}>Continue signup</Button>)
    const button = screen.getByRole('button', { name: /Continue signup/i })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('reserves the original image dimensions and exposes the crop policy', () => {
    render(<Photo src="/assets/about_me_photo1.webp" alt="Daniel in blue lighting" width={1200} height={1500} crop="contain" />)
    const image = screen.getByRole('img', { name: 'Daniel in blue lighting' })

    expect(image).toHaveAttribute('width', '1200')
    expect(image).toHaveAttribute('height', '1500')
    expect(image).toHaveAttribute('data-crop', 'contain')
  })

  it('connects a field label and persistent status feedback', () => {
    render(
      <>
        <Field id="email" label="Email address" description="Use a monitored address.">
          <input id="email" type="email" aria-describedby="email-hint" />
        </Field>
        <Status variant="success">Saved for review.</Status>
      </>,
    )

    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-describedby', 'email-hint')
    expect(screen.getByRole('status')).toHaveTextContent('Saved for review.')
  })
})
