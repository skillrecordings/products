import * as React from 'react'
import Image from 'next/image'
import {FunctionComponent} from 'react'
import {HorizontalResourceCard} from 'components/cards/horizontal-resource-card'
import Markdown from 'react-markdown'
import Link from 'next/link'
import {VerticalResourceCard} from 'components/cards/verticle-resource-card'
import {useRouter} from 'next/router'
import qs from 'query-string'
import {NextSeo} from 'next-seo'

type ProfileTemplateProps = {
  meta?: any
}

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({meta}) => {
  const {allArticles = {}, instructor = {name: 'Unknown instructor'}} = meta

  const featuredResource = instructor.featuredResource
  const tagSlug = featuredResource && featuredResource[0].tag.slug

  /* NextSeo urls */
  const router = useRouter()
  let url = `${process.env.NEXT_PUBLIC_VERCEL_URL}${router.asPath}`

  /*  opengraphImage */
  const contentType = 'profile'
  const instructorImage = instructor.image
  const instructorName = instructor.name
  const instructorRole = instructor.role
  const query = {
    contentType,
    instructorImage,
    instructorName,
    instructorRole,
    tagSlug,
  }
  const opengraphImage = `${
    process.env.NEXT_PUBLIC_VERCEL_URL
  }/api/opengraph?${qs.stringify(query)}`

  return (
    <>
      <NextSeo
        title={instructor.name}
        description={instructor.bio}
        openGraph={{
          title: 'Escuela Frontend' || instructor.name,
          description: instructor.name,
          url,
          type: 'profile',
          images: opengraphImage
            ? [{url: opengraphImage, width: 1200, height: 630}]
            : undefined,
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: 'Escuela Frontend',
          handle: '@EscuelaFrontend',
        }}
      />
      <div className="grid max-w-screen-xl grid-cols-1 gap-0 mx-auto mt-5 lg:gap-8 lg:grid-cols-3">
        <div className="col-span-2 mb-8 lg:mb-0">
          {instructor && <Instructor instructor={instructor} />}
        </div>
        <div>
          {featuredResource &&
            featuredResource.map((resource: any) => {
              return (
                <div key={resource.path} className="h-full">
                  <VerticalResourceCard
                    resource={resource}
                    banner={true}
                    featuredResource={true}
                  />
                </div>
              )
            })}
        </div>
      </div>

      {allArticles && <AllArticles allArticles={allArticles} />}
    </>
  )
}

export default ProfileTemplate

const AllArticles = (allArticles: any) => {
  return (
    <section className="max-w-screen-xl mx-auto ">
      <h2 className="w-full max-w-screen-lg py-16 m-auto mb-10 text-2xl font-extrabold text-center lg:text-5xl md:text-4xl sm:text-3xl leading-tighter">
        Artículos Publicados
      </h2>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-40`}>
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
    image: any
    twitter: string
    website: string
    bio: string
    title: string
  }
}> = ({instructor}) => {
  const {name, image, twitter, bio, website, title} = instructor

  return (
    <div className="h-full p-10 text-black transition-all duration-200 ease-in-out transform bg-white rounded shadow md:p-20 dark:text-white dark:bg-gray-800">
      <div className="grid gap-10">
        <div className="grid items-center grid-cols-1 text-center md:text-left md:grid-cols-[150px,auto] gap-5">
          <div>
            <Image
              src={image}
              width={150}
              height={150}
              quality={100}
              alt={name}
              className="rounded-full"
              priority={true}
            />
          </div>
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold leading-tight font-fibra">
              {name}
            </h1>

            {title && (
              <p className="uppercase font-regular text-[0.75rem] pb-2 text-gray-700 dark:text-gray-100 opacity-60">
                {title}
              </p>
            )}
            <div className="mt-2">
              <ul className="flex justify-center space-x-5 md:justify-start">
                {twitter && (
                  <li>
                    <Link href={twitter}>
                      <a
                        className="text-gray-400 hover:text-gray-500"
                        target="_blank"
                      >
                        <span className="sr-only">Twitter</span>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    </Link>
                  </li>
                )}

                {website && (
                  <li>
                    <Link href={website}>
                      <a
                        className="text-gray-400 hover:text-gray-500"
                        target="_blank"
                      >
                        <span className="sr-only">Website</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          stroke="currentColor"
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      </a>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <hr className="border border-gray-500 border-opacity-10" />
        <div>
          {bio && (
            <Markdown className="leading-snug prose prose-lg  dark:prose-dark">
              {bio}
            </Markdown>
          )}
        </div>
      </div>
    </div>
  )
}
