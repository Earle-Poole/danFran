'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Photo } from '@/components/ui'
import { HomepageSectionAnalytics } from '@/components/site/HomepageSectionAnalytics'
import Link from 'next/link'
import { useAppearanceFeed } from '@/components/appearances'
import { trackEvent } from 'lib/analytics'
import type { PhotoRecord } from 'lib/content/types'
import styles from './home.module.css'

const spotlights = [
  {
    label: 'On Screen',
    panel: 'screen',
    title: 'From Damian to Eddie.',
    copy: 'From Damian in Mean Girls to Eddie in HBO’s Looking, Daniel has played characters that stick with you.',
    image: 'portraits',
    position: '50% 14%',
    href: '/about#selected-work',
    action: 'Explore Daniel’s roles',
  },
  {
    label: 'On Stage',
    panel: 'stage',
    title: 'It’s Not Easy',
    copy: 'Daniel’s comedy special takes on dating, fame, and growing up with his outspoken Italian mother.',
    image: 'about',
    position: '50% 19%',
    href: '/special',
    action: 'Explore the special',
  },
  {
    label: 'Out Loud',
    panel: 'out-loud',
    title: 'A voice beyond the screen.',
    copy: 'Daniel speaks up for the LGBTQ+ community and serves as an ambassador for The Elizabeth Taylor AIDS Foundation.',
    image: 'press',
    position: '50% 2%',
    href: '/about#advocacy-heading',
    action: 'Explore Daniel’s advocacy',
  },
] as const

type SpotlightImages = Record<(typeof spotlights)[number]['image'], { photo: PhotoRecord; srcSet: string }>

export function HomeSpotlight({ images }: { images: SpotlightImages }) {
  const id = useId()
  const [selected, setSelected] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const { feed } = useAppearanceFeed()
  const hasAppearances = feed?.status === 'ready' && feed.events.length > 0

  const selectPanel = (index: number) => {
    if (index !== selected) trackEvent('spotlight_selected', { panel: spotlights[index].panel })
    setSelected(index)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = spotlights.length - 1
    const shortcuts: Record<string, number | undefined> = {
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowRight: index === last ? 0 : index + 1,
      Home: 0,
      End: last,
    }
    const next = Object.hasOwn(shortcuts, event.key) ? shortcuts[event.key] : undefined
    if (next === undefined) return

    event.preventDefault()
    selectPanel(next)
    tabs.current[next]?.focus()
  }

  return (
    <div id="home-spotlight" className={styles.spotlight}>
      <HomepageSectionAnalytics sectionId="home-spotlight" />
      <div className={styles.spotlightTabs} role="tablist" aria-labelledby="destinations-heading">
        {spotlights.map(({ label }, index) => (
          <button
            key={label}
            ref={(button) => { tabs.current[index] = button }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={selected === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={selected === index ? 0 : -1}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onClick={() => selectPanel(index)}
          >
            {label}
          </button>
        ))}
      </div>
      {spotlights.map((spotlight, index) => {
        const { photo, srcSet } = images[spotlight.image]
        const showSchedule = spotlight.label === 'On Stage' && hasAppearances

        return (
          <div
            key={spotlight.label}
            className={styles.spotlightPanel}
            role="tabpanel"
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            hidden={selected !== index}
          >
            {selected === index ? (
              <>
                <div className={styles.spotlightCopy}>
                  <h3>{spotlight.title}</h3>
                  <p>{spotlight.copy}</p>
                  <Link className={styles.spotlightAction} href={showSchedule ? '/calendar' : spotlight.href} data-analytics-placement={`home-spotlight-${spotlight.panel}`}>
                    {showSchedule ? 'See upcoming shows' : spotlight.action}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <Photo
                  className={styles.spotlightPhoto}
                  src={photo.originalPath}
                  srcSet={srcSet}
                  alt={photo.alt}
                  width={photo.dimensions.width}
                  height={photo.dimensions.height}
                  frameRatio="9 / 8"
                  objectPosition={spotlight.position}
                  sizes="(min-width: 48rem) 25rem, calc(100vw - 4rem)"
                />
              </>
            ) : null}
          </div>
        )
      })}
      <noscript>
        <p className={styles.spotlightFallback}>
          <a href={hasAppearances ? '/calendar' : '/special'}>On Stage</a>
          <a href="/about#advocacy-heading">Out Loud</a>
        </p>
      </noscript>
    </div>
  )
}
