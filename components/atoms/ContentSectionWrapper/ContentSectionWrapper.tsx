import classNames from 'classnames';
import { FC } from 'react';

type ContentSectionWrapperProps = {
  wrapperBackgroundColor: string;
};

const ContentSectionWrapper: FC<ContentSectionWrapperProps> = ({
  children,
  wrapperBackgroundColor,
}) => {
  return (
    <div
      className={classNames(
        wrapperBackgroundColor,
        'flex w-full p-24 rounded-md my-14'
      )}
    >
      {children}
    </div>
  );
};

export default ContentSectionWrapper;
