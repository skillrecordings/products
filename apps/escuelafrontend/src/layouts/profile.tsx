import * as React from 'react'
import Image from 'next/image'
import {FunctionComponent} from 'react'
import Link from 'next/link'
import {HorizontalResourceCard} from 'components/cards/horizontal-resource-card'
import HeroWave from 'components/waves/hero-wave'

type ProfileTemplateProps = {
  meta?: any
}

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({meta}) => {
  const {allArticles = {}, instructor = {name: 'Unknown instructor'}} = meta

  return (
    <>
      <header className="flex flex-col items-center justify-center px-5 pt-32 mb-8 -m-5 transition-colors duration-500 ease-in-out pb-52 bg-gradient-to-t from-gray-100 to-gray-50 dark:bg-gradient-to-t dark:from-gray-800 dark:to-gray-900">
        {instructor && <Instructor instructor={instructor} />}
      </header>

      <HeroWave duration={60} />

      {allArticles && <AllArticles allArticles={allArticles} />}
    </>
  )
}

export default ProfileTemplate

const AllArticles = (allArticles: any) => {
  return (
    <section className="max-w-screen-xl py-10 mx-auto lg:py-24 sm:py-16">
      <h2 className="w-full max-w-screen-lg py-16 m-auto mb-10 text-2xl font-extrabold text-center lg:text-5xl md:text-4xl sm:text-3xl leading-tighter">
        Artículos Publicados
      </h2>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8`}>
        {allArticles.allArticles.map((resource: any) => {
          return (
            <div key={resource.path}>
              <HorizontalResourceCard resource={resource} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

const Instructor: FunctionComponent<{
  instructor: {
    name: string
    image?: any
    twitter?: string
    website?: string
  }
}> = ({instructor}) => {
  const {name, image, twitter, website} = instructor

  const path = twitter || website

  const Profile = () => (
    <>
      {image && (
        <Image
          src={image}
          width={120}
          height={120}
          quality={100}
          alt={name}
          className="rounded-full"
          priority={true}
        />
      )}
      <div className="leading-tight">
        <h1 className="w-full max-w-screen-lg py-16 m-auto mb-10 text-2xl font-extrabold text-center lg:text-5xl md:text-4xl sm:text-3xl leading-tighter">
          {name}
        </h1>
      </div>
    </>
  )
  return name ? (
    path ? (
      <Link href={path}>
        <a className="items-center space-x-2 text-center" target="_blank">
          <Profile />
        </a>
      </Link>
    ) : (
      <div className="items-center space-x-2 text-center ">
        <Profile />
      </div>
    )
  ) : null
}
