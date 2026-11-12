import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import styles from './ui.module.css'

export type SectionProps<T extends ElementType = 'section'> = {
  as?: T
  tone?: 'paper' | 'ink' | 'pink'
  children?: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { as: Element = 'section', tone = 'paper', children, className = '', ...props },
  ref,
) {
  return (
    <Element ref={ref as never} className={`${styles.section} ${className}`} data-tone={tone} {...props}>
      {children}
    </Element>
  )
})

Section.displayName = 'Section'
