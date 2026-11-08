import { FC, PropsWithChildren } from 'react'

const CommonLayout: FC<PropsWithChildren> = ({ children }) => {
  // Compatibility boundary: pages/_app owns the persistent SiteShell.
  return <>{children}</>
}

export default CommonLayout
