import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import styles from './ui.module.css'

export type ControlVariant = 'primary' | 'inverse' | 'secondary' | 'selected' | 'text'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ControlVariant
  loading?: boolean
  loadingLabel?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    loading = false,
    loadingLabel = 'Loading',
    disabled,
    className = '',
    ...props
  },
  ref,
) {
  const content: ReactNode = loading ? (
    <>
      {children}
      <span className={styles.loadingText} role="status">
        {loadingLabel}
      </span>
    </>
  ) : (
    children
  )

  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.control} ${styles[variant]}${loading ? ` ${styles.loading}` : ''} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  )
})

Button.displayName = 'Button'
