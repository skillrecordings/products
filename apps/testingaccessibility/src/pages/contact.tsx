import * as React from 'react'
import Image from 'next/image'
import Layout from 'components/app/layout'
import ContactForm from '../components/contact/contact-form'
import {getOgImage} from 'utils/get-og-image'

const ContactFormPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const ogImage = getOgImage({title: 'Contact'})
  return (
    <Layout
      footer={null}
      meta={{title: 'Contact the Testing Accessibility Team', ogImage}}
      className="bg-gray-50"
    >
      <div className="flex-grow w-full mx-auto py-8 sm:pb-24 pb-16 flex flex-col items-center justify-center p-5">
        <main className="sm:mx-auto rounded-lg">
          <div className="max-w-sm mx-auto flex items-center justify-center w-full">
            <Image
              placeholder="blur"
              src={require('../../public/assets/lighthouse@2x.png')}
              alt="a wooden sign with Testing Accessibility text on it"
              quality={100}
              width={1024 / 4}
              height={1024 / 4}
              priority
            />
          </div>
          <h1 className="text-center text-3xl leading-9 font-bold pt-4 font-heading">
            Contact Testing Accessibility
          </h1>
          <div className="sm:mt-8 mt-4 sm:mx-auto sm:w-full sm:max-w-md">
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
