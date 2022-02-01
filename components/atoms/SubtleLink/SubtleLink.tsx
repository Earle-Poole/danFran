import Link from 'next/link'
import { FC } from 'react'

interface SubtleLinkProps {
  href: string
}
const SubtleLink: FC<SubtleLinkProps> = ({ children, href }) => {
  return (
    <Link href={href} passHref>
      <a
        className="border-b border-dashed"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    </Link>
  )
}

export default SubtleLink
