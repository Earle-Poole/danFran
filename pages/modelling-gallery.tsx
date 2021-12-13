import type { NextPage } from 'next'
import Head from 'next/head'
import CommonLayout from '@/components/layouts/CommonLayout'
import ModellingGalleryTemplate from '@/components/templates/model-gallery'

const ModelingGallery: NextPage = () => {
  return (
    <>
      <Head>
        <title>Daniel Franzese</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.png' />
      </Head>

      <CommonLayout>
        <ModellingGalleryTemplate />
      </CommonLayout>
    </>
  )
}

export default ModelingGallery