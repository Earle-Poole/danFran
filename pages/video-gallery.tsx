import type { NextPage } from 'next'
import Head from 'next/head'
import CommonLayout from '@/components/layouts/CommonLayout'
import VideoGalleryTemplate from '@/components/templates/video-gallery'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Daniel Franzese</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.png' />
      </Head>

      <CommonLayout>
        <VideoGalleryTemplate />
      </CommonLayout>
    </>
  )
}

export default Home