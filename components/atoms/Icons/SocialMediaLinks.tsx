import Facebook from '@/assets/svg/facebook'
import Instagram from '@/assets/svg/instagram'
import IMDB from '@/assets/svg/imdb'
import { socialLinks } from 'lib/content/contacts'

const commonSVGProps = {
  width: 20,
  height: 20,
}

const socialIcons = { facebook: Facebook, instagram: Instagram, imdb: IMDB }

const SocialMediaLinks = () => {
  const socialMediaClassName =
    'transition duration-150 mx-4 hover:animate-fast-flip'

  return (
    <div className="flex w-fit my-6">
      {socialLinks.map(({ id, label, url }) => {
        const Icon = socialIcons[id]
        return (
          <div className={socialMediaClassName} key={id}>
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon {...commonSVGProps} className={id === 'instagram' ? 'fill-white hover:fill-cyan-400' : 'fill-white hover:fill-pink-500'} />
            </a>
          </div>
        )
      })}
    </div>
  )
}

export default SocialMediaLinks
