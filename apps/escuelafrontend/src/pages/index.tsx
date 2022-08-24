import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import HeroWave from 'components/waves/hero-wave'
import {HorizontalResourceCard} from 'components/cards/horizontal-resource-card'
import LandingCopy from 'components/landing-copy.mdx'
import SignUpForm from 'components/sign-up-form'

export default function Home({allArticles}: any) {
  return (
    <>
      <div className="flex-grow">
        <section className="relative top-0 w-auto -m-5 overflow-hidden -z-10 hero-gradiente">
          <div
            className="absolute w-full h-full bg-left-top bg-no-repeat bg-contain md:bg-cover -z-10 top-32 hero-animation-1"
            style={{
              backgroundImage: `url(/images/hero-image-1.svg)`,
            }}
          />

          <div
            className="absolute w-full h-full bg-left-top bg-no-repeat bg-contain md:bg-cover top-64 -z-10 hero-animation-2"
            style={{
              backgroundImage: `url(/images/hero-image-2.svg)`,
            }}
          />
          <div
            className="absolute w-full h-full bg-left-top bg-no-repeat bg-contain md:bg-cover top-96 -z-10 hero-animation-3"
            style={{
              backgroundImage: `url(/images/hero-image-3.svg)`,
            }}
          />

          <div
            className="absolute w-full h-full bg-left-top bg-no-repeat bg-cover top-64 -z-10 hero-animation-4"
            style={{
              backgroundImage: `url(/images/hero-image-4.svg)`,
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center max-w-screen-lg px-4 pt-48 mx-auto opacity-0 sm:pb-96 pb-80 initial-load-hero">
            <h1 className="text-4xl font-extrabold tracking-tight text-center text-white transition-all duration-500 ease-in-out sm:text-5xl lg:text-6xl xl:text-7xl">
              Avanza tu Carrera con Entrenamiento de Ingeniería Front-End
              Profesional
            </h1>
            <p className="mt-6 text-xl text-center text-white sm:text-2xl md:text-3xl sm:max-w-3xl">
              <span className="opacity-80">
                Accede a workshops prácticos e interactivos
              </span>
            </p>
          </div>
        </section>

        <HeroWave />

        <section className="max-w-screen-xl py-10 mx-auto lg:py-24 sm:py-16">
          <article className="prose-h2:text-3xl md:prose-h2:text-5xl md:prose-xl sm:prose-lg prose-base opacity-90 prose-p:font-light w-full prose-pre:overflow-auto prose-p:max-w-2xl prose-p:mx-auto prose-headings:max-w-2xl prose-headings:mx-auto prose-pre:max-w-2xl prose-pre:mx-auto prose-ul:max-w-2xl prose-ul:mx-auto prose-ul:list-disc marker:text-primary prose-headings:font-bold prose-p:px-5 prose-headings:px-5 prose-headings:font-text prose-h2:text-center">
            <LandingCopy />
          </article>
          <SignUpForm content={signUpFormContent} />
          <h2 className="w-full max-w-screen-lg py-16 m-auto mb-10 text-2xl font-extrabold text-center lg:text-5xl md:text-4xl sm:text-3xl leading-tighter">
            Artículos Recientes
          </h2>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8`}>
            {allArticles.map((resource: any) => {
              return (
                <div key={resource.path}>
                  <HorizontalResourceCard resource={resource} />
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}

const allArticlesQuery = groq`
*[_type == "post" && publishedAt < now()]|order(publishedAt desc) {
  title,
  slug,
  path,
  publishedAt,
  "instructor": collaborators[0]->{
    title,
    'slug': person->slug.current,
    'name': person->name,
    'path': person->website,
    'twitter': person->twitter,
    'image': person->image.url
  },
  "image":{
    'url': image.url
  },
  "tag": softwarelibraries[0]-> {
    name,
    "image": image.url
  }
}[0..8]
`

export async function getStaticProps() {
  const allArticles = await sanityClient.fetch(allArticlesQuery)

  return {
    props: {
      allArticles,
    },
  }
}

const signUpFormContent = {
  heading:
    'Avanza tu Carrera con Entrenamiento de Ingeniería Front-End Profesional',
  description:
    'Adquiere los conocimientos y las habilidades que necesitas para avanzar en tu carrera profesional. Regístrate y accede a entrenamiento efectivo hoy mismo.',
  button: (
    <div className="flex flex-row justify-center align-middle items-center mx-auto">
      Suscríbete
    </div>
  ),
  info: `Sin spam, cancele en cualquier momento.`,
}
