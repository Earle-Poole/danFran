import type { ReactNode } from 'react'
import styles from './ui.module.css'

export type StatusProps = {
  children: ReactNode
  variant?: 'error' | 'success' | 'info'
  className?: string
}

export function Status({ children, variant = 'info', className = '' }: StatusProps) {
  return (
    <p
      className={`${styles.status} ${styles[`status${variant[0].toUpperCase()}${variant.slice(1)}`]} ${className}`}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      {children}
    </p>
  )
}
