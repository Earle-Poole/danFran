'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

export function CopySpecialLink({ url, label }: { url: string; label: string }) {
  const [result, setResult] = useState<'copied' | 'manual' | null>(null)

  async function copy() {
    setResult(null)
    try {
      await navigator.clipboard.writeText(url)
      setResult('copied')
    } catch {
      setResult('manual')
    }
  }

  return (
    <div className="mt-4 border-t border-[#dfc6cd] pt-2 [html:not([data-js-enabled=true])_&]:hidden">
      <Button variant="text" onClick={copy}>{label}</Button>
      <p className="text-caption text-muted" role="status">
        {result === 'copied' ? 'Link copied.' : result === 'manual' ? 'Copy the link below to share.' : null}
      </p>
      {result === 'manual' && (
        <input
          aria-label="Link to share"
          className="mt-2 min-h-control w-full rounded-control border border-control bg-white px-3 text-caption"
          onFocus={(event) => event.currentTarget.select()}
          readOnly
          type="url"
          value={url}
        />
      )}
    </div>
  )
}
