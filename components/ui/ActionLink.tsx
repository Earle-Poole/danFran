'use client'

import type { AnchorHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import type { ControlVariant } from './Button'
import styles from './ui.module.css'

export type ActionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string
  variant?: ControlVariant | 'inverse-text'
  disabled?: boolean
}

export const ActionLink = forwardRef<HTMLAnchorElement, ActionLinkProps>(function ActionLink(
  { children, href, variant = 'primary', disabled = false, className = '', onClick, tabIndex, ...props },
  ref,
) {
  const variantClass = variant === 'inverse-text' ? styles.inverseText : styles[variant]

  return (
    <a
      ref={ref}
      href={disabled ? undefined : href}
      className={`${styles.link} ${variantClass}${disabled ? ` ${styles.loading}` : ''} ${className}`}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : tabIndex}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      {...props}
    >
      {children}
    </a>
  )
})

ActionLink.displayName = 'ActionLink'
