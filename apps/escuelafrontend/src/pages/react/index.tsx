import * as React from 'react'
import Layout from 'layouts'
import Image from 'next/image'
import reactPageData from '../../data/react-page-data'
import {find} from 'lodash'
import Markdown from 'react-markdown'
import HeroWave from 'components/waves/hero-wave'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'

export default function ReactLandingPage() {
  const introduction: any = find(reactPageData, {id: 'introduction'})
  const curriculum: any = find(reactPageData, {id: 'curriculum'})
  const instructor: any = find(reactPageData, {id: 'instructor'})
  const curriculumText: any = find(reactPageData, {id: 'curriculumText'})
  const ctaText: any = find(reactPageData, {id: 'ctaText'})

  const router = useRouter()

  const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath

  return (
    <>
      <NextSeo
        title="React desde Cero"
        description="Un viaje por los fundamentos de React. Aprende los conceptos esenciales para empezar a construir interfaces profesionales con React."
        openGraph={{
          title: 'React desde Cero un Workshop',
          description:
            'Un viaje por los fundamentos de React. Aprende los conceptos esenciales para empezar a construir interfaces profesionales con React.',
          url,
          images: [
            {
              url: 'https://res.cloudinary.com/escuela-frontend/image/upload/v1626891360/assets/ogimage_cgn567.png',
              alt: 'React desde Cero',
            },
          ],
        }}
      />
      <>
        <div className="flex-grow relative">
          <Waves />
          <HeroWave />
          <div className="-mt-20 relative z-50">
            <TextSection resource={introduction} />
          </div>
          <Instructor resource={instructor} />
          <TextSection resource={curriculumText} />
          <CurriculumItems resource={curriculum} />
          <TextSection resource={ctaText} />
        </div>
      </>
    </>
  )
}

const CurriculumItems: React.FC<any> = ({resource}) => {
  return (
    <>
      <h1 className="text-5xl font-extrabold text-center mb-10">
        {resource.title}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-10 mx-auto max-w-screen-xl">
        {resource.resources &&
          resource.resources.map((resource: any, i: any) => {
            return (
              <div
                className="h-full bg-white dark:bg-gray-800 backdrop-filter backdrop-blur-lg dark:bg-opacity-80 bg-opacity-80 rounded-xl overflow-hidden ease-in-out duration-200 px-6 py-8 shadow"
                key={i}
              >
                <h2 className="text-2xl font-bold text-center mb-10">
                  {resource.title}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {resource.items &&
                    resource.items.map((item: any, i: any) => {
                      return (
                        <div className="grid grid-cols-6 items-center " key={i}>
                          <span className="col-span-1 bg-white dark:bg-gray-800 rounded-full p-2 h-12 relative w-12 m-auto">
                            {item.icon === 'lesson-icon' ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 fill-current text-gray-600 dark:text-gray-200"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : item.icon === 'challenge-icon' ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 fill-current text-gray-600 dark:text-gray-200"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : item.icon === 'extra-credit-icon' ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 fill-current text-gray-600 dark:text-gray-200"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ) : null}

                            <span className="bg-black h-10 w-10"></span>
                          </span>
                          <span className="col-span-5">
                            <strong>{item.title}</strong>
                            <Markdown className="text-sm">
                              {item.description}
                            </Markdown>
                          </span>
                        </div>
                      )
                    })}
                </div>
              </div>
            )
          })}
      </div>
    </>
  )
}

const TextSection: React.FC<any> = ({
  resource,
  className = 'my-20',
  ...props
}) => {
  className = `${className} `

  return (
    <div {...props} className={className}>
      <Markdown className="prose dark:prose-dark dark:prose-dark-lg prose-lg  mx-auto max-w-screen-md">
        {resource.description}
      </Markdown>
    </div>
  )
}

const Waves = () => {
  return (
    <section className="relative overflow-hidden w-auto -m-5 top-0 -z-10 react-landing-page-gradiente">
      <div
        className="absolute w-full bg-no-repeat bg-left-top bg-contain md:bg-cover -z-10 h-full sm:top-32 top-64 hero-animation-1"
        style={{
          backgroundImage: `url(/images/hero-image-1.svg)`,
        }}
      ></div>

      <div
        className="absolute w-full bg-no-repeat bg-left-top bg-contain  md:bg-cover h-full top-wave -z-10 hero-animation-3"
        style={{
          backgroundImage: `url(/images/hero-image-3.svg)`,
        }}
      ></div>

      <div
        className="absolute w-full bg-no-repeat bg-left-top bg-cover top-96 -z-10 h-full hero-animation-4"
        style={{
          backgroundImage: `url(/images/hero-image-4.svg)`,
        }}
      ></div>
      <div className="relative z-10 px-4 pb-80 pt-24 opacity-0 initial-load-hero">
        <div className="text-center mb-10">
          <Image
            src="/images/react-icon.svg"
            width={120}
            height={120}
            alt="React Icon"
          />
        </div>
        <p className="mt-6 max-w-lg mx-auto text-center text-base sm:text-lg  text-white">
          <span className="bg-gray-100 backdrop-filter backdrop-blur-lg dark:bg-opacity-30 bg-opacity-30 rounded-full px-4 py-1 text-xs md:text-base">
            Curso Profesional · Próximamente Octubre, 2021
          </span>
        </p>
        <h1 className="lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-extrabold max-w-screen-lg text-white transition-all ease-in-out duration-500 text-center mx-auto mt-4">
          React Desde Cero
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-center text-xl sm:text-2xl md:text-3xl text-white sm:max-w-3xl">
          <span className="opacity-80">
            Aprende los conceptos esenciales para empezar a construir interfaces
            profesionales con React.
          </span>
        </p>
      </div>
    </section>
  )
}

const includedFeatures = [
  'Acceso al workshop',
  'Acesso al material del workshop',
  'Grabación del workshop',
  'Desafíos y retos verificados',
]

const Instructor: React.FC<any> = ({resource}) => {
  return (
    <div key={resource.name} className="max-w-screen-md mx-auto">
      <div className="space-y-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-6 sm:space-y-0">
        <div className="aspect-w-3 aspect-h-2 sm:aspect-w-3 sm:aspect-h-4">
          <img
            className="object-cover shadow rounded-lg"
            src={resource.imageUrl}
            alt={resource.name}
          />
        </div>
        <div className="sm:col-span-2">
          <div className="space-y-4">
            <div className="leading-6 font-medium space-y-1">
              <h3 className="text-3xl">{resource.name}</h3>
              <p className="text-lg dark:text-blue-400 text-blue-500">
                {resource.role}
              </p>
            </div>

            <Markdown className="prose dark:prose-dark dark:prose-dark-lg prose-lg">
              {resource.description}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  )
}
