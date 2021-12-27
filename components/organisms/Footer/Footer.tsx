import SocialMediaLinks from '@/components/atoms/Icons/SocialMediaLinks'
import { urls } from 'lib/constants'
import { classNameByBreakpoint } from 'lib/toolbox'

const Footer = () => {
  const scrollToTop = () => {
    const pageLocation = document.getElementById('layout-body')
    if (pageLocation) {
      pageLocation.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const footerClassName = classNameByBreakpoint({
    sm: 'bg-white/5 relative flex flex-col w-full items-center mt-12 py-16 text-lg font-sans',
  })
  const upArrowClassName = classNameByBreakpoint({
    sm: 'absolute flex text-4xl bg-cyan-400 transition duration-150 w-fit font-light p-3 self-center -top-8',
    manual: 'hover:bg-pink-500 hover:underline',
  })

  return (
    <div className={footerClassName}>
      <a className={upArrowClassName} onClick={scrollToTop}>
        &uarr;
      </a>
      <SocialMediaLinks />
      <p className='mt-3'>
        © 2021
        <span className='text-orange-400 text-3xl'> Daniel Franzese </span>
        All Rights Reserved
      </p>
      <p>
        Website by
        <a href={urls.MP_GITHUB} className='font-bold'>
          {' '}
          Margarita Poole
        </a>
      </p>
    </div>
  )
}

export default Footer
