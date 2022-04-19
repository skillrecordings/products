import * as React from 'react'
import Image from 'next/image'
import Layout from 'components/layout'
import {
  projects,
  headerContent,
  secretSauceContent,
  strategySessionContent,
} from 'components/landing-content'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'

import ImageLevelUp from '../../public/assets/level-up@2x.png'
import ImageSecretSauce from '../../public/assets/secret-sauce@2x.png'
import ImageSecretSauceDrop from '../../public/assets/secret-sauce-drop@2x.png'
import ImageFormMushroomRight from '../../public/assets/form-mushroom-right@2x.png'
import ImageFormMushroomLeft from '../../public/assets/form-mushroom-left@2x.png'
import ImageFormLeaf from '../../public/assets/form-leaf@2x.png'
import ImageFish from '../../public/assets/fish@2x.png'
import ImageStars1 from '../../public/assets/stars-1@2x.png'
import ImageStars2 from '../../public/assets/stars-2@2x.png'

const LandingPage = () => {
  return (
    <Layout className="overflow-hidden">
      <Header content={headerContent} />
      <main>
        <SecretSauceSection content={secretSauceContent} />
        <ProjectsSection content={projects} />
        <StrategySessionForm content={strategySessionContent} />
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
    <section className="relative sm:pb-16 pb-0 flex flex-col items-center justify-center text-center px-5">
      <div className="relative translate-y-10">
        <div className="absolute sm:translate-x-40 translate-x-28 translate-y-8">
          <Image
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
      <h2 className="max-w-lg font-heading sm:text-3xl text-xl pt-4">
        {content.heading}
      </h2>
      <div className="absolute sm:-bottom-5 -bottom-16 sm:-translate-x-72 -translate-x-40">
        <Image
          src={ImageStars1}
          width={159}
          height={108}
          alt="stars"
          aria-hidden="true"
        />
      </div>
      <div className="absolute sm:-bottom-5 -bottom-16 sm:translate-x-72 translate-x-40">
        <Image
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
      <h2 className="font-condensed text-badass-pink-500 sm:text-3xl text-2xl">
        {content.caption}
      </h2>
      <ul className="flex sm:flex-row flex-col max-w-screen-md sm:flex-wrap sm:items-start items-center justify-center pt-20">
        {content.items.map((project: any) => {
          const {title, byline, image} = project
          return (
            <li className="flex flex-col items-center justify-center sm:w-1/2 sm:pb-16 pb-10">
              {image}
              <p className="font-heading sm:text-2xl text-xl pt-3 pb-2">
                {title}
              </p>
              <p className="text-badass-gray">{byline}</p>
            </li>
          )
        })}
      </ul>
      <p className="font-script text-3xl text-badass-yellow-300 pt-4">
        {content.byline}
      </p>
    </section>
  )
}

const StrategySessionForm: React.FC<any> = ({content}) => {
  const router = useRouter()

  return (
    <section className="flex flex-col itesm-center justify-center sm:pt-16 sm:pb-16 pt-8">
      <div className="relative max-w-2xl mx-auto flex flex-col items-center">
        <div className="absolute sm:-left-24 sm:top-0 -top-16 sm:w-auto w-36 z-20">
          <Image
            aria-hidden="true"
            src={ImageFish}
            width={160}
            height={136}
            alt="a fish"
          />
        </div>
        <div className="absolute right-[-116px] z-20 sm:block hidden">
          <Image
            aria-hidden="true"
            src={ImageFormMushroomRight}
            width={196}
            height={478}
            alt="mushroom"
          />
        </div>
        <div className="absolute -left-24 -bottom-24 z-20 sm:block hidden">
          <Image
            aria-hidden="true"
            src={ImageFormMushroomLeft}
            width={280 / 1.1}
            height={459 / 1.1}
            alt="a mushroom"
          />
        </div>
        <div className="absolute -right-40 bottom-8 z-0 sm:block hidden">
          <Image
            aria-hidden="true"
            src={ImageFormLeaf}
            width={338 / 1.1}
            height={449 / 1.1}
            alt="a mushroom"
          />
        </div>
        <div className="bg-[#082C1B] sm:px-20 sm:py-20 px-5 py-16 rounded-md relative z-10">
          <h2 className="font-heading sm:text-4xl text-3xl text-center">
            {content.heading}
          </h2>
          <div className="pt-10 pb-5 space-y-5 opacity-80 sm:text-lg">
            {content.description}
          </div>
          <SubscribeToConvertkitForm
            actionLabel={content.button}
            onSuccess={(subscriber: any) => {
              if (subscriber) {
                const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                router.push(redirectUrl)
              }
            }}
          />
          <p className="text-center pt-8 text-sm opacity-50 max-w-xs mx-auto">
            {content.info}
          </p>
        </div>
      </div>
    </section>
  )
}
