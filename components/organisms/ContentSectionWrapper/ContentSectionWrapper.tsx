import classNames from 'classnames';
import { FC } from 'react';

type ContentSectionWrapperProps = {
  wrapperBackgroundColor: string;
  classNameOverride?: string;
};

const ContentSectionWrapper: FC<ContentSectionWrapperProps> = ({
  children,
  wrapperBackgroundColor,
  classNameOverride
}) => {
  return (
    <div
      className={classNames(
        wrapperBackgroundColor,
        'flex w-full p-24 rounded-md my-14',
        classNameOverride
      )}
    >
      {children}
    </div>
  );
};

export default ContentSectionWrapper;
