import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import styles from './ui.module.css'

export type ContainerProps<T extends ElementType = 'div'> = {
  as?: T
  children?: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { as: Element = 'div', children, className = '', ...props },
  ref,
) {
  return (
    <Element ref={ref as never} className={`${styles.container} ${className}`} {...props}>
      {children}
    </Element>
  )
})

Container.displayName = 'Container'
