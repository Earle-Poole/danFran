import type { Metadata } from 'next'
import Image from 'next/image'
import { Container, Section } from '@/components/ui'
import { QrActions } from './QrActions'

const qrImage = '/assets/qr/daniel-franzese-qr.png'
const qrDestination = 'https://www.whatsupdanny.com/qr'

export const metadata: Metadata = {
  title: 'QR Code | Daniel Franzese',
  description: 'Download or share the QR code for Daniel Franzese’s official website.',
  robots: { index: false, follow: true },
}

export default function QrSharePage() {
  return (
    <Section aria-labelledby="qr-heading" className="!py-[clamp(1.75rem,5vw,4.5rem)]">
      <Container>
        <div className="mx-auto max-w-[40rem] overflow-hidden border-2 border-ink shadow-[6px_6px_0_var(--color-ink)]">
          <div className="relative flex flex-col gap-4 border-b-2 border-ink bg-pink px-6 pb-8 pt-6 medium:items-center medium:px-8 medium:pb-10 medium:pt-8 medium:text-center">
            <h1
              id="qr-heading"
              className="font-display text-[clamp(2.75rem,9vw,4.75rem)] uppercase leading-[0.98]"
              data-route-heading
            >
              <span className="block medium:inline">Daniel’s</span>{' '}
              <span className="block medium:inline">QR code</span>
            </h1>
            <p className="break-anywhere text-caption font-semibold">
              <a className="underline underline-offset-[0.18em]" href={qrDestination}>www.whatsupdanny.com/qr</a>
            </p>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-3 border-t border-ink bg-[conic-gradient(var(--color-ink)_0%_25%,transparent_25%_50%,var(--color-ink)_50%_75%,transparent_75%)] bg-[length:12px_12px] medium:h-4 medium:bg-[length:16px_16px]"
            />
          </div>
          <div className="flex flex-col items-center gap-6 bg-[repeating-conic-gradient(from_8deg_at_50%_44%,transparent_0deg_12deg,rgba(24,24,24,0.065)_12deg_24deg)] px-4 py-6 text-center medium:px-8 medium:py-8">
            <Image
              className="h-auto w-full max-w-[22rem] border-2 border-ink bg-white shadow-[8px_8px_0_var(--color-pink)]"
              src={qrImage}
              alt="QR code with Daniel Franzese’s laughing logo in the center"
              width={1230}
              height={1230}
              loading="eager"
            />
            <QrActions imageUrl={qrImage} filename="daniel-franzese-qr.png" />
          </div>
        </div>
      </Container>
    </Section>
  )
}
