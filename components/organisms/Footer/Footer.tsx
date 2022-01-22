import MyButton from '@/components/atoms/Button/Button'
import SocialMediaLinks from '@/components/atoms/Icons/SocialMediaLinks'
import classNames from 'classnames'
import { slugs } from 'lib/constants'
import styles from './footer.module.css'

const Footer = () => {
  const scrollToTop = () => {
    const pageLocation = document.getElementById('layout-body')
    if (pageLocation) {
      pageLocation.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="bg-gray-500/[15%] relative flex flex-col w-full items-center mt-12 py-16 text-lg font-sans">
      <button
        type="button"
        className="absolute flex text-4xl hover:bg-pink-500 bg-cyan-400 transition duration-150 w-fit font-light p-3 self-center  -top-8 text-shadow-xs"
        onClick={scrollToTop}
      >
        &uarr;
      </button>
      <SocialMediaLinks />
      <div className="mt-3 flex flex-col items-center md:items-end md:flex-row leading-tight">
        <span>© {currentYear}</span>
        <div className={classNames('text-3xl px-2', styles.name)}>
          Daniel Franzese
        </div>
        <span>All Rights Reserved</span>
      </div>
      <p>
        Website by{' '}
        <a
          href="https://github.com/margarita-poole"
          className="text-fuchsia-500 cursor-pointer underline-offset-2"
        >
          Margarita Poole
        </a>
      </p>
    </div>
  )
}

export default Footer
