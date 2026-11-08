import { useState } from 'react'
import {
  ActionLink,
  Button,
  Container,
  Field,
  Photo,
  Section,
  Status,
} from '../../../../components/ui'
import { fieldDescriptionIds } from '../../../../components/ui/Field'
import styles from './PrimitiveShowcase.module.css'

export function PrimitiveShowcase() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const inputId = 'showcase-email'
  const describedBy = fieldDescriptionIds(inputId, true, !submitted)

  return (
    <main className={styles.showcase} data-testid="primitive-showcase">
      <Container className={styles.header}>
        <p className="font-editorial text-tagline">Test-only UI fixture</p>
        <h1 className="font-display text-page">Editorial primitives</h1>
        <p className={styles.note}>
          Render this fixture at 320px, 400% zoom, fallback fonts and forced colors. Long labels and the address below must remain visible without horizontal page scrolling.
        </p>
      </Container>

      <Section>
        <Container className={styles.section}>
          <h2>Actions and links</h2>
          <div className={styles.controls}>
            <Button
              onClick={() => setLoading(true)}
              loading={loading}
              aria-label={loading ? 'Saving long action label' : undefined}
            >
              Save a long action label without clipping
            </Button>
            <Button variant="secondary" disabled aria-describedby="disabled-help">
              Disabled action
            </Button>
            <ActionLink href="#success" variant="text">
              Read the text link state
            </ActionLink>
            <ActionLink href="#inverse" variant="inverse-text" className="bg-ink">
              Inverse link on dark surface
            </ActionLink>
            <ActionLink
              href="/booking#booking-details"
              variant="secondary"
              disabled
              aria-describedby="disabled-link-help"
            >
              Disabled link action
            </ActionLink>
          </div>
          <p id="disabled-help" className={styles.note}>This disabled state keeps its label and explains its availability nearby.</p>
          <p id="disabled-link-help" className={styles.note}>This link is disabled in the fixture, so its booking target cannot be opened.</p>
        </Container>
      </Section>

      <Section tone="pink">
        <Container className={styles.section}>
          <h2>Form feedback</h2>
          <div className={styles.stateGrid}>
            <Field
              id={inputId}
              label="Booking contact email address"
              description="A visible hint remains available while the field is edited."
              error={!submitted ? 'Enter a valid email address before continuing.' : undefined}
              required
            >
              <input
                id={inputId}
                className="fieldInput"
                type="email"
                defaultValue="daniel.franzese.booking@example.com"
                aria-invalid={!submitted}
                aria-describedby={describedBy}
              />
            </Field>
            <div>
              <Button
                variant="inverse"
                onClick={() => {
                  setSubmitted(true)
                  setLoading(false)
                }}
              >
                Show success state
              </Button>
              {submitted ? <Status variant="success">Your details are ready to review.</Status> : <Status variant="error">No submission has been sent from this fixture.</Status>}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className={styles.section}>
          <h2>Original-photo framing</h2>
          <p className={styles.note}>Both examples use an existing source file; contain preserves the full source while cover demonstrates an explicit crop policy.</p>
          <div className={styles.photoGrid}>
            <div className={styles.photoCard}>
              <Photo
                src="/assets/about_me_photo1.webp"
                alt="Daniel Franzese in a blue jacket under pink and blue lighting"
                width={800}
                height={800}
                crop="contain"
                sizes="(min-width: 48rem) 30vw, 100vw"
              />
              <h3>Contain: full original source</h3>
            </div>
            <div className={styles.photoCard}>
              <Photo
                src="/assets/about_me_photo1.webp"
                alt="Daniel Franzese in a blue jacket under pink and blue lighting"
                width={800}
                height={800}
                crop="cover"
                frameRatio="4 / 3"
                objectPosition="50% 35%"
                sizes="(min-width: 48rem) 30vw, 100vw"
              />
              <h3>Cover: deliberate focal position</h3>
            </div>
          </div>
          <p className={styles.longEmail}>
            Long visible contact value: daniel.franzese.booking.inquiries.with.a.long.department.name@example.com
          </p>
        </Container>
      </Section>
    </main>
  )
}

export default PrimitiveShowcase
