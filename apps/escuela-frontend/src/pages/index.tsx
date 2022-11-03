import Layout from 'components/app/layout'
import type {NextPage} from 'next'
import LandingCopy from 'components/landing-copy.mdx'
import SubscribeForm from 'components/subscribe-form'
import Image from 'next/image'
import React from 'react'
import cx from 'classnames'
import Navigation from 'components/app/navigation'

type HeaderProps = {
  image: any
}

const Home: NextPage = () => {
  const image = '/header_@2x.png'

  return (
    <Layout nav={<Navigation className="relative flex lg:relative" />}>
      <Header image={image} />
      <section className="relative py-10 sm:py-16 lg:py-24">
        <div className="prose-headings:font-text prose-base w-full opacity-90 marker:text-brand prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:px-10 prose-headings:font-bold prose-h2:!my-20 prose-h2:text-center prose-h2:prose-h2:text-2xl prose-h2:text-white prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-light prose-strong:font-extrabold prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:list-disc sm:prose-lg prose-h2:sm:text-3xl md:prose-xl prose-h2:md:text-3xl prose-h2:lg:text-4xl ">
          <LandingCopy />
        </div>
        <SubscribeForm />
      </section>
    </Layout>
  )
}

export default Home

const Header: React.FC<HeaderProps> = ({image}) => {
  return (
    <>
      <header className="relative z-0 -mt-52">
        {image && (
          <Image
            className="hero-animation-background h-full w-full object-cover object-bottom"
            src={image}
            priority
            aria-hidden="true"
            quality={100}
            alt="Header image"
            layout="fill"
            objectFit="cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-600 via-gray-600 to-gray-900 mix-blend-multiply" />
        <div
          className={cx(
            'relative flex min-h-screen w-full flex-col items-center justify-center',
            {
              'bg-gray-900': !image,
            },
          )}
        >
          <div className="z-10 flex h-full w-full flex-col items-center justify-center">
            <h1 className="hero-animation-h1 mx-6 mt-12 mb-4 bg-gradient-to-b from-white to-gray-200 bg-clip-text text-center text-4xl font-extrabold leading-tight  text-transparent sm:text-4xl md:!w-full md:text-5xl lg:text-6xl">
              Domina el Universo Frontend
            </h1>
            <p className="font-space-grotesk hero-animation-p mx-6 max-h-[112px] w-[280px] text-center text-base text-gray-200 md:max-h-[96px] md:w-[630px] md:text-xl">
              Una serie de workshops interactivos para acelerar tu carrera
            </p>
          </div>
        </div>
      </header>
    </>
  )
}
