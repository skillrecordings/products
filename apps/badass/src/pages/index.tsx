import * as React from 'react'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Layout from 'components/layout'
import {
  projects,
  headerContent,
  secretSauceContent,
  genericCallToActionContent,
} from 'components/landing-content'
import {CallToActionForm} from '../components/call-to-action-form'
import ImageLevelUp from '../../public/assets/level-up@2x.png'
import ImageSecretSauce from '../../public/assets/secret-sauce@2x.png'
import ImageSecretSauceDrop from '../../public/assets/secret-sauce-drop@2x.png'
import ImageStars1 from '../../public/assets/stars-1@2x.png'
import ImageStars2 from '../../public/assets/stars-2@2x.png'

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

const Header: React.FC<React.PropsWithChildren<any>> = ({content}) => {
  return (
    <header className="relative py-5 flex md:flex-row flex-col-reverse items-center justify-between md:text-left text-center max-w-screen-xl mx-auto w-full md:px-8 px-5">
      <div className="w-full flex flex-col md:items-start items-center">
        <p className="font-condensed text-badass-pink-500 sm:text-4xl text-3xl sm:pt-0 pt-5">
          {content.caption}
        </p>
        <h1 className="font-heading xl:text-5xl sm:text-4xl text-4xl xl:leading-tight md:leading-tight pb-4 pt-6">
          {content.heading}
        </h1>
        <p className="pt-5 text-white/80 max-w-xs sm:text-lg">
          {content.byline}
        </p>
        <p className="sm:absolute sm:pt-0 pt-16 -bottom-16 left-24 font-script text-badass-yellow-300 sm:text-5xl scale-90 text-4xl -rotate-6">
          {content.callout}
        </p>
      </div>
      <div className="flex items-center justify-center max-w-lg w-full">
        <Image
          src={ImageLevelUp}
          // width={1190 / 2.2}
          // height={1246 / 2.2}
          placeholder="blur"
          quality={100}
          priority
          loading="eager"
          alt="illustration of amanita muscoria mushroom with a level up label and little floating stars around it"
        />
      </div>
    </header>
  )
}

const SecretSauceSection: React.FC<React.PropsWithChildren<any>> = ({
  content,
}) => {
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
      <p className="font-expanded text-badass-yellow-300 sm:text-xl text-lg pb-5">
        {content.caption}
      </p>
      <h2 className="lg:max-w-4xl max-w-2xl font-heading lg:text-5xl sm:text-4xl lg:leading-tight leading-tight text-3xl pt-4">
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

const ProjectsSection: React.FC<React.PropsWithChildren<any>> = ({content}) => {
  return (
    <section className="flex flex-col items-center justify-center py-16 text-center px-5">
      {/* <div
        className="font-symbol sm:pb-32 pb-24 text-2xl sm:scale-90 scale-75"
        aria-hidden="true"
      >
        <span className="inline-block rotate-180 text-badass-gray">!</span>{' '}
        <span className="text-badass-yellow-300 text-4xl">*</span>{' '}
        <span className=" text-badass-gray">!</span>
      </div> */}
      <h2 className=" text-badass-pink-300 sm:text-2xl text-xl">
        {content.caption}
      </h2>
      <ul className="grid lg:grid-cols-2 grid-cols-1 place-items-center pt-16 gap-5 max-w-4xl w-full">
        {content.items.map((project: any) => {
          const {title, byline, image, caseStudyUrl, instructor, instructors} =
            project
          return (
            <li
              key={title}
              className="relative bg-gradient-to-tr from-white/5 to-white/0  border border-white/10 flex flex-col w-full h-full rounded"
            >
              <div className="flex items-center gap-3 sm:p-10 p-10 sm:justify-start justify-center">
                <div className="flex-shrink-0">{image}</div>
                <h3>
                  <Link
                    href={`https://${title}`}
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans font-semibold sm:text-2xl text-xl block hover:underline"
                  >
                    {title}
                  </Link>
                </h3>
              </div>
              {/* <p className="text-badass-gray">{byline}</p> */}
              <div className="sm:p-10 p-5 pb-8 w-full gap-5 text-sm flex sm:flex-row flex-col items-center sm:justify-between justify-center">
                <div className="">
                  {instructor && (
                    <div className="flex items-center gap-2.5 sm:justify-start justify-center">
                      <Image
                        src={instructor.avatar}
                        width={45}
                        height={45}
                        alt={instructor.name}
                        className="rounded-full bg-black"
                      />
                      {instructor.name}
                    </div>
                  )}
                  {instructors && (
                    <div className="flex items-center gap-2.5 text-left">
                      <div className="flex items-center -space-x-3">
                        {instructors.map((instructor: any) => {
                          return (
                            <div
                              key={instructor.name}
                              className="border-2 rounded-full flex items-center justify-center border-black"
                            >
                              <Image
                                src={instructor.avatar}
                                width={45}
                                height={45}
                                alt={instructor.name}
                                className="rounded-full"
                              />
                              {/* {instructor.name} */}
                            </div>
                          )
                        })}
                      </div>
                      {instructors.map((instructor: any, i: number) => {
                        return `${instructor.name} ${i % 2 ? '' : ' & '}`
                      })}
                    </div>
                  )}
                </div>
                {project.caseStudyUrl && (
                  <div className="flex-shrink-0 flex">
                    <a
                      href={project.caseStudyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-80 hover:opacity-100 transition hover:text-badass-yellow-300"
                    >
                      case study <span aria-hidden="true">↗︎</span>
                    </a>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
      <p className="font-script sm:text-4xl text-3xl sm:scale-110 text-badass-yellow-300 pt-28">
        {content.byline}
      </p>
    </section>
  )
}
