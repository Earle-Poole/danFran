import classNames from 'classnames'
import { FC } from 'react'

type ContentSectionWrapperProps = {
  wrapperBackgroundColor: string
  classNameOverride?: string
  id?: string
}

const ContentSectionWrapper: FC<ContentSectionWrapperProps> = ({
  children,
  wrapperBackgroundColor,
  classNameOverride,
  id,
}) => {
  return (
    <div
      id={id}
      className={classNames(
        wrapperBackgroundColor,
        'flex w-full px-10 py-6 md:px-24 md:py-14 rounded-md my-14',
        classNameOverride
      )}
    >
      {children}
    </div>
  )
}

export default ContentSectionWrapper
