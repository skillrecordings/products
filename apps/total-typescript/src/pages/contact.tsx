import * as React from 'react'
import Image from 'next/legacy/image'
import Layout from 'components/app/layout'
import ContactForm from '../components/contact/contact-form'
import {getOgImage} from 'utils/get-og-image'

const ContactFormPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const ogImage = getOgImage({title: 'Contact'})
  return (
    <Layout
      meta={{
        title: `Contact the ${process.env.NEXT_PUBLIC_SITE_TITLE} Team`,
        ogImage,
      }}
    >
      <div className="mx-auto flex w-full flex-grow flex-col items-center justify-center p-5 py-8 pb-16 sm:pb-24">
        <main className="rounded-lg sm:mx-auto">
          <div className="mx-auto flex w-full max-w-sm items-center justify-center">
            {/* <Image
              placeholder="blur"
              src={require('../../public/assets/lighthouse@2x.png')}
              alt="a wooden sign with Testing Accessibility text on it"
              quality={100}
              width={1024 / 4}
              height={1024 / 4}
              priority
            /> */}
          </div>
          <h1 className="pt-4 text-center font-heading text-4xl font-extrabold leading-9">
            Contact {process.env.NEXT_PUBLIC_SITE_TITLE}
          </h1>
          <div className="mt-4 sm:mx-auto sm:mt-8 sm:w-full sm:max-w-md">
            <div>
              <ContactForm />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default ContactFormPage
