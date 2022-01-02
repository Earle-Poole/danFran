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

  return (
    <div className="bg-white/5 relative flex flex-col w-full items-center mt-12 py-16 text-lg font-sans">
      <a
        className="absolute flex text-4xl hover:bg-pink-500 bg-cyan-400 transition duration-150 w-fit font-light p-3 self-center hover:underline -top-8"
        onClick={scrollToTop}
      >
        &uarr;
      </a>
      <SocialMediaLinks />
      <p className="mt-3">
        © 2021
        <span className={classNames('text-3xl mx-1', styles.name)}>
          Daniel Franzese
        </span>
        All Rights Reserved
      </p>
      <p>
        Website by{' '}
        <a
          href="https://github.com/margarita-poole"
          className="text-fuchsia-700 hover:underline underline-offset-2 "
        >
          Margarita Poole
        </a>
      </p>
    </div>
  )
}

export default Footer
