import MyButton from '@/components/atoms/Button/Button'
import ContentSectionWrapper from '@/components/organisms/ContentSectionWrapper/ContentSectionWrapper'
import CoverPhoto from '@/components/atoms/CoverPhoto/CoverPhoto'
import AboutDanny from '@/components/molecule/AboutDanny/AboutDanny'
import BookMeNow from '@/components/molecule/BookMeNowContacts/BookMeNowContacts'
import { urls } from 'lib/constants'
import MailChimpInput from '@/components/molecule/MailChimpInput/MailChimpInput'
import Podcast from '@/components/molecule/Podcast/Podcast'

const HomeTemplate = () => {
  return (
    <div id="home" className="w-full flex flex-col items-center">
      <CoverPhoto />
      <div className="w-full max-w-7xl flex flex-col items-center">
        <ContentSectionWrapper
          wrapperBackgroundColor="bg-gray-500/[15%]"
          classNameOverride="scroll-m-28"
          id="about"
        >
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
        <ContentSectionWrapper
          wrapperBackgroundColor="bg-gray-500/[15%]"
          id="podcast"
        >
          <Podcast />
        </ContentSectionWrapper>
        <ContentSectionWrapper
          wrapperBackgroundColor="bg-black"
          id="cameo"
          classNameOverride="!py-1 my-10"
        >
          <div className="flex flex-col items-center text-center mx-auto text-2xl w-fit">
            <p className="flex flex-col mb-4">
              Book your personalized video shout out from me now!
            </p>
            <MyButton href={urls.CAMEO} name="Find Me On Cameo" isExternal />
          </div>
        </ContentSectionWrapper>

        <div id="contact"></div>
        <ContentSectionWrapper wrapperBackgroundColor="bg-gray-500/[15%]">
          <div className="flex flex-col w-full">
            <BookMeNow />
          </div>
        </ContentSectionWrapper>
      </div>
    </div>
  )
}

export default HomeTemplate
