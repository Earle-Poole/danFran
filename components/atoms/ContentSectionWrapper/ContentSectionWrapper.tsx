import { Children, FC } from 'react';

const ContentSectionWrapper: FC = ({ children }) => {
  return <div className='flex bg-gray-800 w-full p-24 rounded-md my-24'>{children}</div>;
};

export default ContentSectionWrapper;
