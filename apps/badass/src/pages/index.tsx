import * as React from 'react'
import {GetStaticProps} from 'next'
import Link from 'next/link'
import Image from 'next/legacy/image'
import Layout from 'components/layout'
import Icon, {IconNames} from 'components/icons'

import {type CaseStudy, getAllCaseStudies} from 'lib/case-studies'
import ContentSection from 'components/content-section'
import Card from 'components/card'
import {
  projects,
  headerContent,
  secretSauceContent,
  genericCallToActionContent,
} from 'components/landing-content'
import {CallToActionForm} from '../components/call-to-action-form'
import ImageLevelUp from '../../public/assets/level-up@2x.png'
import ImageSecretSauce from '../../public/assets/sauce@2x.png'
// import ImageSecretSauce from '../../public/assets/secret-sauce@2x.png'
// import ImageSecretSauceDrop from '../../public/assets/secret-sauce-drop@2x.png'
import ImageStars1 from '../../public/assets/stars-1-new@2x.png'
import ImageStars2 from '../../public/assets/stars-2-new@2x.png'

type LandingPageProps = {
  caseStudies: CaseStudy[]
}

const Header: React.FC<React.PropsWithChildren<any>> = ({content}) => {
  return (
    <header className="py-5">
      <div className="container">
        <div className="flex md:flex-row flex-col-reverse items-center justify-between md:text-left text-center gap-4">
          <div className="flex items-center justify-center max-w-[660px] w-full">
            <Image
              src={ImageLevelUp}
              width={660}
              height={660}
              placeholder="blur"
              quality={100}
              priority
              loading="eager"
              alt="illustration of amanita muscoria mushroom with a level up label and little floating stars around it"
            />
          </div>
          <div className="w-full flex flex-col md:items-start items-center">
            <h3 className="font-condensed text-badass-pink-500 sm:text-[1.75rem]">
              {content.caption}
            </h3>
            <h1 className="font-heading text-[2rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem] leading-[1.14] mt-10">
              {content.heading}
            </h1>
            <p className="pt-5 text-white/70 text-xl leading-[1.75] mt-3">
              {content.byline}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

const SecretSauceSection: React.FC<React.PropsWithChildren<any>> = ({
  content,
}) => {
  return (
    <section className="pt-40">
      <div className="container">
        <div className="relative flex flex-col items-center justify-center text-center">
          <Image
            loading="eager"
            src={ImageSecretSauce}
            placeholder="blur"
            width={660}
            height={660}
            quality={100}
            alt="a dripping bottle of badass secret sauce"
            aria-hidden="true"
          />
          <div className="relative -top-48">
            <h3 className="font-condensed text-badass-yellow-300 text-[1.75rem] leading-[1.28]">
              {content.caption}
            </h3>
            <h2 className="lg:max-w-4xl max-w-2xl font-heading text-[2rem] mt-9">
              {content.heading}
            </h2>
            <div className="absolute -left-28">
              <Image
                src={ImageStars1}
                width={209}
                height={99}
                alt="stars"
                aria-hidden="true"
                loading="eager"
              />
            </div>
            <div className="absolute -right-28 -bottom-24">
              <Image
                loading="eager"
                src={ImageStars2}
                width={96}
                height={96}
                alt="stars"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
// const SecretSauceSection: React.FC<React.PropsWithChildren<any>> = ({
//   content,
// }) => {
//   return (
//     <section className="relative sm:pb-16 pb-8 flex flex-col items-center justify-center text-center px-5">
//       <div className="relative translate-y-10">
//         <div className="absolute sm:translate-x-40 translate-x-28 translate-y-8">
//           <Image
//             loading="eager"
//             src={ImageSecretSauce}
//             placeholder="blur"
//             width={850}
//             height={426}
//             quality={100}
//             alt="a dripping bottle of badass secret sauce"
//             aria-hidden="true"
//           />
//         </div>
//         <div className="sm:translate-y-24 translate-y-16">
//           <Image
//             loading="eager"
//             src={ImageSecretSauceDrop}
//             placeholder="blur"
//             width={512}
//             height={512}
//             quality={100}
//             alt="a shining drop from badass secret sauce"
//             aria-hidden="true"
//           />
//         </div>
//       </div>
//       <p className="font-expanded text-badass-yellow-300 sm:text-xl text-lg pb-5">
//         {content.caption}
//       </p>
//       <h2 className="lg:max-w-4xl max-w-2xl font-heading lg:text-5xl sm:text-4xl lg:leading-tight leading-tight text-3xl pt-4">
//         {content.heading}
//       </h2>
//       <div className="absolute sm:-bottom-5 -bottom-16 sm:-translate-x-72 -translate-x-40">
//         <Image
//           src={ImageStars1}
//           width={159}
//           height={108}
//           alt="stars"
//           aria-hidden="true"
//           loading="eager"
//         />
//       </div>
//       <div className="absolute sm:-bottom-5 -bottom-16 sm:translate-x-72 translate-x-40">
//         <Image
//           loading="eager"
//           src={ImageStars2}
//           width={72}
//           height={72}
//           alt="stars"
//           aria-hidden="true"
//         />
//       </div>
//     </section>
//   )
// }

type ProjectsSectionSection = {
  content: any
  caseStudies: CaseStudy[]
}

type CaseStudiesSection = {
  caseStudies: CaseStudy[]
}

const CaseStudiesSection: React.FC<CaseStudiesSection> = ({caseStudies}) => {
  return (
    <ContentSection
      title="badass case studies"
      subtitle="A Deep Dive into our Processes"
    >
      <div className="grid lg:grid-cols-2 w-full gap-4 mt-[4.5rem]">
        {caseStudies.map((caseStudy) => {
          return (
            <Card
              key={caseStudy._id}
              imageUrl={caseStudy.cardImage}
              title={caseStudy.title}
              subtitle={caseStudy.partnerName}
              slug={caseStudy.slug}
              type="caseStudy"
            />
          )
        })}
      </div>
    </ContentSection>
  )
}

const otherProducts = [
  {
    title: 'egghead.io',
    url: 'https://egghead.io/',
  },
  {
    title: 'TotalTypeScript.com',
    url: 'https://www.totaltypescript.com/',
  },
  {
    title: 'TestingJavaScript.com',
    url: 'https://testingjavascript.com/',
  },
  {
    title: 'ProTailwind.com',
    url: 'https://www.protailwind.com/',
  },
]

const OtherProductsSection: React.FC<any> = ({}) => {
  return (
    <ContentSection title="other product's we've shipped" className="mt-9">
      <ul className="grid md:grid-cols-2 gap-x-3 mt-2">
        {otherProducts.map((item) => {
          return (
            <li key={item.title}>
              <Link
                href={item.url}
                className="flex justify-between items-center h-[57px] md:h-[80px] border-b border-[#5a5a5a] hover:text-badass-green-500 duration-150 text-2xl font-bold px-2"
              >
                {item.title}
                <Icon
                  aria-hidden="true"
                  name={'arrow-top-right'}
                  className="w-8 h-8 shrink-0"
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </ContentSection>
  )
}

const ProjectsSection: React.FC<
  React.PropsWithChildren<ProjectsSectionSection>
> = ({content, caseStudies}) => {
  return (
    <section className="flex flex-col items-center justify-center py-16 px-5">
      {/* <div
        className="font-symbol sm:pb-32 pb-24 text-2xl sm:scale-90 scale-75"
        aria-hidden="true"
      >
        <span className="inline-block rotate-180 text-badass-gray-300">!</span>{' '}
        <span className="text-badass-yellow-300 text-4xl">*</span>{' '}
        <span className=" text-badass-gray-300">!</span>
      </div> */}
      <CaseStudiesSection caseStudies={caseStudies} />
      <OtherProductsSection />
      <div className="my-40">**************************</div>
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
              {/* <p className="text-badass-gray-300">{byline}</p> */}
              <div className="sm:p-10 p-5 pb-8 w-full gap-5 text-sm flex sm:flex-row flex-col items-center sm:justify-between justify-center absolute">
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

const LandingPage: React.FC<LandingPageProps> = ({caseStudies}) => {
  return (
    <Layout className="overflow-hidden">
      <Header content={headerContent} />
      <main>
        <SecretSauceSection content={secretSauceContent} />
        <ProjectsSection content={projects} caseStudies={caseStudies} />
        <CallToActionForm content={genericCallToActionContent} />
      </main>
    </Layout>
  )
}

export default LandingPage

export const getStaticProps: GetStaticProps = async () => {
  const caseStudies = await getAllCaseStudies()

  return {
    props: {
      caseStudies,
    },
    revalidate: 10,
  }
}
