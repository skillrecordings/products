import * as React from 'react'
import {getCsrfToken, getProviders} from 'next-auth/react'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Layout from 'components/app/layout'
import ContactForm from '../components/contact/contact-form'

const ContactFormPage: React.FC<{csrfToken: string}> = ({csrfToken}) => {
  return (
    <Layout
      footer={null}
      meta={{title: 'Contact the Testing Accessibility Team'}}
      className="bg-green-700 bg-noise"
    >
      <div className="flex-grow w-full mx-auto md:pb-40 pb-16 md:pt-16 pt-0 flex flex-col items-center justify-center p-5 text-white">
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)

  return {
    props: {
      providers,
      csrfToken,
    },
  }
}
