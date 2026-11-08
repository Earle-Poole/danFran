'use client'

import Link from 'next/link'
import { useAppearanceFeed } from '@/components/appearances'

export function AppearancesFooterLink() {
  const { feed } = useAppearanceFeed()
  return feed?.status === 'ready' && feed.events.length > 0 ? <Link href="/calendar">Appearances</Link> : null
}
