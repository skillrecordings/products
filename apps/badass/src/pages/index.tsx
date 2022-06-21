import * as React from 'react'
import Image from 'next/image'
import Layout from 'components/layout'
import {
  projects,
  headerContent,
  secretSauceContent,
  genericCallToActionContent,
} from 'components/landing-content'

import ImageLevelUp from '../../public/assets/level-up@2x.png'
import ImageSecretSauce from '../../public/assets/secret-sauce@2x.png'
import ImageSecretSauceDrop from '../../public/assets/secret-sauce-drop@2x.png'

import ImageStars1 from '../../public/assets/stars-1@2x.png'
import ImageStars2 from '../../public/assets/stars-2@2x.png'
import {CallToActionForm} from '../components/call-to-action-form'

const LandingPage = () => {
  return (
    <Layout className="overflow-hidden">
      <Header content={headerContent} />
      <main>
        <SecretSauceSection content={secretSauceContent} />
        <ProjectsSection content={projects} />
        <CallToActionForm content={genericCallToActionContent} />
      </main>
    </Layout>
  )
}

export default LandingPage

const Header: React.FC<any> = ({content}) => {
  return (
    <header className="lg:min-h-[calc(100vh-200px)] flex flex-col items-center lg:justify-center justify-start text-center px-5">
      <Image
        src={ImageLevelUp}
        width={688}
        height={516}
        placeholder="blur"
        quality={100}
        priority
        loading="eager"
        alt="illustration of amanita muscoria mushroom with a level up label and little floating stars around it"
      />
      <p className="font-condensed text-badass-pink-500 sm:text-3xl text-xl">
        {content.caption}
      </p>
      <h1 className="font-heading sm:text-4xl text-3xl max-w-[24ch] pb-4 pt-6">
        {content.heading}
      </h1>
      <p className="text-badass-gray max-w-md">{content.byline}</p>
      <p className="font-script text-badass-yellow-300 text-3xl pt-4">
        {content.callout}
      </p>
    </header>
  )
}

const SecretSauceSection: React.FC<any> = ({content}) => {
  return (
    <section className="relative sm:pb-16 pb-8 flex flex-col items-center justify-center text-center px-5">
      <div className="relative translate-y-10">
        <div className="absolute sm:translate-x-40 translate-x-28 translate-y-8">
          <Image
            loading="eager"
            src={ImageSecretSauce}
            placeholder="blur"
            width={850}
            height={426}
            quality={100}
            alt="a dripping bottle of badass secret sauce"
            aria-hidden="true"
          />
        </div>
        <div className="sm:translate-y-24 translate-y-16">
          <Image
            loading="eager"
            src={ImageSecretSauceDrop}
            placeholder="blur"
            width={512}
            height={512}
            quality={100}
            alt="a shining drop from badass secret sauce"
            aria-hidden="true"
          />
        </div>
      </div>
      <p className="font-condensed text-badass-yellow-300 sm:text-2xl text-xl">
        {content.caption}
      </p>
      <h2 className="max-w-xl font-heading sm:text-3xl text-xl pt-4">
        {content.heading}
      </h2>
      <div className="absolute sm:-bottom-5 -bottom-16 sm:-translate-x-72 -translate-x-40">
        <Image
          src={ImageStars1}
          width={159}
          height={108}
          alt="stars"
          aria-hidden="true"
          loading="eager"
        />
      </div>
      <div className="absolute sm:-bottom-5 -bottom-16 sm:translate-x-72 translate-x-40">
        <Image
          loading="eager"
          src={ImageStars2}
          width={72}
          height={72}
          alt="stars"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}

const ProjectsSection: React.FC<any> = ({content}) => {
  return (
    <section className="flex flex-col items-center justify-center py-16 text-center px-5">
      <div
        className="font-symbol sm:pb-32 pb-24 text-2xl sm:scale-90 scale-75"
        aria-hidden="true"
      >
        <span className="inline-block rotate-180 text-badass-gray">!</span>{' '}
        <span className="text-badass-yellow-300 text-3xl">*</span>{' '}
        <span className=" text-badass-gray">!</span>
      </div>
      <h2 className="font-condensed text-badass-pink-500 sm:text-3xl text-2xl">
        {content.caption}
      </h2>
      <ul className="flex sm:flex-row flex-col max-w-screen-md sm:flex-wrap sm:items-start items-center justify-center pt-20">
        {content.items.map((project: any) => {
          const {title, byline, image} = project
          return (
            <li
              key={title}
              className="flex flex-col items-center justify-center sm:w-1/2 sm:pb-16 pb-10"
            >
              {image}
              <p className="font-heading sm:text-2xl text-xl pt-3 pb-2">
                {title}
              </p>
              <p className="text-badass-gray">{byline}</p>
            </li>
          )
        })}
      </ul>
      <p className="font-script text-3xl sm:scale-110 text-badass-yellow-300 pt-16">
        {content.byline}
      </p>
    </section>
  )
}
