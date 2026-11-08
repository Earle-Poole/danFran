import type { ReactNode } from 'react'
import styles from './ui.module.css'

export type FieldProps = {
  id: string
  label: ReactNode
  children: ReactNode
  description?: ReactNode
  error?: ReactNode
  required?: boolean
  className?: string
}

export function Field({
  id,
  label,
  children,
  description,
  error,
  required = false,
  className = '',
}: FieldProps) {
  const descriptionId = description ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={`${styles.field} ${className}`}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label} {required ? <span className={styles.required}>*</span> : null}
      </label>
      {description ? <p className={styles.fieldHint} id={descriptionId}>{description}</p> : null}
      {children}
      {error ? <p className={styles.fieldError} id={errorId} role="alert">{error}</p> : null}
    </div>
  )
}

export const fieldDescriptionIds = (id: string, hasDescription: boolean, hasError: boolean) =>
  [hasDescription ? `${id}-hint` : null, hasError ? `${id}-error` : null].filter(Boolean).join(' ') || undefined
