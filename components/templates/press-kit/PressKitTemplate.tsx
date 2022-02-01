import ContentSectionWrapper from '@/components/organisms/ContentSectionWrapper/ContentSectionWrapper'
import PressGallery from '@/components/organisms/PressGallery/PressGallery'
import zigzagIcon from '@/assets/zigzag.svg'
import Image from 'next/image'
import SubtleLink from '@/components/atoms/SubtleLink'

const PressKitTemplate = () => {
  return (
    <div id="press-kit" className="w-full flex justify-center">
      <div className="w-full max-w-7xl flex flex-col items-center">
        <div className="mt-36">
          <p className="text-left text-3xl md:text-5xl ml-4 md:ml-10 pb-5">
            Daniel Franzese - Press Kit
          </p>
          <p className="text-left text-xl ml-4 md:ml-10 italic flex-wrap md:w-3/5">{`"Tolerance is the positive and cordial effort to understand another's beliefs, practices, and habits without necessarily sharing or accepting them. " -Joshua Liebman`}</p>
        </div>
        <ContentSectionWrapper
          wrapperBackgroundColor="bg-gray-500/[15%]"
          id="Press_Bio"
        >
          <div className="flex flex-col mt-8 md:mt-0 md:ml-4">
            <p className="text-4xl text-center">{`Biography`}</p>
            <div className="pt-4 text-center">
              <Image src={zigzagIcon} alt="zigzag" layout="fixed"></Image>
            </div>
            <p className="text-xl md:text-2xl my-3 leading-relaxed indent-14">
              Best known for his role as Damian in{' '}
              <SubtleLink href="https://www.imdb.com/title/tt0377092/">
                Mean Girls
              </SubtleLink>
              , Daniel Franzese was also the lead of other indie cult classics,
              such as{' '}
              <SubtleLink href="https://www.imdb.com/title/tt0242193/">
                Bully
              </SubtleLink>{' '}
              &{' '}
              <SubtleLink href="https://www.imdb.com/title/tt1242432/">
                I Spit On Your Grave
              </SubtleLink>
              . He was most recently a series regular on Mark Gordon&apos;s ABC
              series,{' '}
              <SubtleLink href="https://www.imdb.com/title/tt5396572/">
                Conviction
              </SubtleLink>
              . Prior to that he was a series regular on the Freeform series{' '}
              <SubtleLink href="https://www.imdb.com/title/tt4144890/">
                Recovery Road
              </SubtleLink>
              .
            </p>
            <br />
            <p className="text-xl md:text-2xl my-3 leading-relaxed indent-14">
              Originally from Brooklyn, Daniel has become a well-known proponent
              and speaker for the LGBT Community. He reached 8 million views on
              his YouTube video series{' '}
              <SubtleLink href="https://www.imdb.com/title/tt2243525/">
                Sh*t Italian Moms Say
              </SubtleLink>
              .&nbsp;A self-proclaimed momma&apos;s boy, his upbeat high-energy
              stand up comedy act, &apos;Yass! You&apos;re Amazing! Comedy
              Tour&apos; captures his amazing and quirky life in the
              entertainment industry, as well as hilarious stories about his New
              York parents.
            </p>
          </div>
        </ContentSectionWrapper>
        <PressGallery />
      </div>
    </div>
  )
}

export default PressKitTemplate
