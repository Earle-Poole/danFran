import MyButton from '@/components/atoms/Button/Button'
import ContentSectionWrapper from '@/components/organisms/ContentSectionWrapper/ContentSectionWrapper'
import CoverPhoto from '@/components/atoms/CoverPhoto/CoverPhoto'
import SocialMediaLinks from '@/components/atoms/Icons/SocialMediaLinks'
import AboutDanny from '@/components/molecule/AboutDanny/AboutDanny'
import BookMeNow from '@/components/molecule/BookMeNowContacts/BookMeNowContacts'
import { urls } from 'lib/constants'
import MailChimpInput from '@/components/molecule/MailChimpInput/MailChimpInput'

const HomeTemplate = () => {
  return (
    <div id="home" className="w-full flex flex-col items-center">
      <CoverPhoto />
      <div className="w-full max-w-7xl flex flex-col items-center">
        <ContentSectionWrapper wrapperBackgroundColor="bg-white/5" id="about">
          <AboutDanny />
        </ContentSectionWrapper>
        <ContentSectionWrapper
          wrapperBackgroundColor="bg-black"
          classNameOverride="!py-1 my-10"
        >
          <div className="flex flex-col w-full mx-auto">
            <p className="text-center text-2xl">
              Sign up now to get early notifications of what I&apos;m doing!
            </p>
            <div className="flex mx-auto w-fit my-8">
              <MailChimpInput />
            </div>
          </div>
        </ContentSectionWrapper>
        <div id="contact"></div>
        <ContentSectionWrapper wrapperBackgroundColor="bg-white/5">
          <div className="flex flex-col w-full">
            <BookMeNow />
            <div className="flex flex-col items-center mx-auto text-2xl mt-20 w-fit">
              <p className="flex flex-col my-4">
                Book your personalized video shoutout from me now!
              </p>
              <MyButton href={urls.CAMEO} name="Find Me On Cameo" isExternal />
            </div>
          </div>
        </ContentSectionWrapper>
      </div>
    </div>
  )
}

export default HomeTemplate
