'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

export function BookingContactActions({
  email,
  emailHref,
  phone,
  phoneHref,
  className,
  statusClassName,
  linkClassName,
}: {
  email: string
  emailHref: string
  phone: string
  phoneHref: string
  className: string
  statusClassName: string
  linkClassName: string
}) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const copyEmail = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      setCopyState('failed')
      return
    }

    try {
      await navigator.clipboard.writeText(email)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <>
      <div className={className}>
        <a className={linkClassName} href={emailHref} aria-label={`Email booking contact at ${email}`}>{email}</a>
        <Button variant="secondary" onClick={copyEmail} aria-describedby="copy-email-status">Copy email</Button>
        <a className={linkClassName} href={phoneHref} aria-label={`Call booking contact at ${phone}`}>{phone}</a>
      </div>
      <p id="copy-email-status" className={statusClassName} role="status" aria-live="polite">
        {copyState === 'copied' ? 'Email copied.' : copyState === 'failed' ? 'Copy unavailable. Select the email address above.' : ' '}
      </p>
    </>
  )
}
