import type { NextPage } from 'next'
import Head from 'next/head'
import CommonLayout from '@/components/layouts/CommonLayout'
import PressKitTemplate from '@/components/templates/press-kit'

const PressKit: NextPage = () => {
  return (
    <>
      <Head>
        <title>Daniel Franzese</title>
        <meta name="description" content="Generated by create next app" />
        {/* <link rel="icon" href="/favicon.png" /> */}
      </Head>

      <CommonLayout>
        <PressKitTemplate />
      </CommonLayout>
    </>
  )
}

export default PressKit
