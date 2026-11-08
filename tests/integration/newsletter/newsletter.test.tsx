import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NewsletterSection } from '@/components/newsletter/NewsletterSection'

describe('NewsletterSection', () => {
  it('keeps native provider handoff and unique labelled fields across sections', () => {
    render(
      <>
        <NewsletterSection id="home-newsletter" />
        <NewsletterSection id="video-newsletter" />
      </>,
    )

    const forms = Array.from(document.querySelectorAll('form'))
    expect(forms).toHaveLength(2)

    const inputs = screen.getAllByLabelText(/Email address/)
    expect(inputs).toHaveLength(2)
    expect(new Set(inputs.map((input) => input.id)).size).toBe(2)
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('type', 'email')
      expect(input).toBeRequired()
      expect(input).toHaveAttribute('autocomplete', 'email')
      expect(input).toHaveAttribute('aria-describedby', `${input.id}-hint`)
      expect(document.getElementById(`${input.id}-hint`)).toHaveTextContent(/new tab/i)
    })

    forms.forEach((form) => {
      expect(form).toHaveAttribute(
        'action',
        'https://udsterleads.us10.list-manage.com/subscribe/post?u=c97ea1160f134dbeb8cbe8bd6&id=66c6445cca',
      )
      expect(form).toHaveAttribute('method', 'post')
      expect(form).toHaveAttribute('target', '_blank')
      expect(form).not.toHaveTextContent(/success/i)
    })
  })

  it('leaves invalid email handling to native browser validation', () => {
    render(<NewsletterSection id="newsletter-test" />)
    const input = screen.getByLabelText(/Email address/)
    fireEvent.change(input, { target: { value: 'not-an-email' } })
    expect(input).toBeInvalid()
  })
})
