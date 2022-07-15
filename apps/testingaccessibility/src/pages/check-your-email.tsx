import * as React from 'react'
import Layout from 'components/app/layout'
import NewMailImage from '../../public/assets/new-mail@2x.png'
import Image from 'next/image'
import toast from 'react-hot-toast'

const CheckYourEmail = () => {
  React.useEffect(() => {
    toast('Check your email', {
      icon: '✉️',
    })
  }, [])

  return (
    <Layout
      footer={null}
      meta={{title: 'Log in to Testing Accessibility'}}
      className="bg-green-700 bg-noise"
    >
      <main className="flex flex-col flex-grow items-center justify-center pt-5 pb-16 px-5 text-white">
        <div className="flex flex-col max-w-md mx-auto w-full gap-5 items-center text-center">
          <Image
            priority
            width={460 / 2}
            height={368 / 2}
            quality={100}
            placeholder="blur"
            src={NewMailImage}
            aria-hidden="true"
            alt=""
          />
          <h1 className="text-center text-3xl leading-9 font-bold font-heading">
            Check your email
          </h1>
          <p className="text-sand-100">
            If you bought the course, a login link will been sent to your email!
            Use it and you&apos;ll be able to access the content.
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default CheckYourEmail
