import { useId } from 'react'
import { Button, Container, Field, Section } from '@/components/ui'
import { urls } from 'lib/constants'
import styles from './newsletter.module.css'

export type NewsletterSectionProps = {
  id?: string
}

const providerAction = urls.MAILCHIMP
const providerHoneypotName = 'b_c97ea1160f134dbeb8cbe8bd6_66c6445cca'

/**
 * The newsletter provider owns the subscription response. This component keeps
 * the native form handoff intact so it never displays an unverified success
 * message or clears an email before the provider has handled it.
 */
export function NewsletterSection({ id }: NewsletterSectionProps) {
  const generatedId = useId().replace(/:/g, '')
  const sectionId = id ?? `newsletter-${generatedId}`
  const inputId = `${sectionId}-email`

  return (
    <Section id={sectionId} className={styles.section} aria-labelledby={`${sectionId}-heading`}>
      <Container>
        <div className={styles.content}>
          <div>
            <p className={styles.eyebrow}>Newsletter</p>
            <h2 className={styles.heading} id={`${sectionId}-heading`}>
              Stay in the loop.
            </h2>
            <p className={styles.benefit}>
              New projects, appearances and updates from Daniel.
            </p>
          </div>

          <form
            action={providerAction}
            method="post"
            target="_blank"
            className={styles.form}
          >
            <Field
              id={inputId}
              label="Email address"
              description="Subscribe opens our newsletter provider in a new tab. Follow the instructions there to confirm your subscription."
              required
            >
              <input
                className={styles.input}
                id={inputId}
                name="EMAIL"
                type="email"
                autoComplete="email"
                aria-describedby={`${inputId}-hint`}
                required
              />
            </Field>

            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor={`${inputId}-company`}>Company</label>
              <input
                id={`${inputId}-company`}
                name={providerHoneypotName}
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <Button type="submit" variant="primary">
              Subscribe
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  )
}
