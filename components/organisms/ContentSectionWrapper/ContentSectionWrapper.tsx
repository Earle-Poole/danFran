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
        'flex w-full p-10 md:p-24 rounded-md my-14',
        classNameOverride
      )}
    >
      {children}
    </div>
  )
}

export default ContentSectionWrapper
