import * as React from 'react'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'

import {
  ModuleProgressProvider,
  useModuleProgress,
} from '@skillrecordings/skill-lesson/video/module-progress'
import {getWorkshopsForProduct, WorkshopSchema, Workshop} from '@/lib/workshops'
import {BonusSchema, getBonusesForProduct} from '@/lib/bonuses'
import {getOgImage} from '@/utils/get-og-image'
import Layout from '@/components/app/layout'
import Header from '@/components/app/header'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  // TODO: load the user's purchases and figure out what product they should have access to
  const productId = 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38'
  const workshops = await getWorkshopsForProduct({productId})
  const bonuses = await getBonusesForProduct({productId})

  return {
    props: {workshops, bonuses},
  }
}

const ResourceLink: React.FC<{
  title: string
  workshopSlug: string
  resourceSlug: string
  isCompleted: boolean
}> = ({title, workshopSlug, resourceSlug, isCompleted}) => {
  return (
    <Link href={`/workshops/${workshopSlug}/${resourceSlug}`} className="block">
      {isCompleted && '✅'}
      {title}
    </Link>
  )
}

// const isLessonCompleted = (
//   resourceId: string,
//   lessons: {
//     id: string
//     lessonCompleted: boolean
//   }[],
// ) => {
//   const lesson = lessons.find((lesson) => lesson.id === resourceId)
//   return lesson ? lesson.lessonCompleted : false
// }

// const isSectionCompleted = (
//   resourceId: string,
//   sections: {
//     id: string
//     sectionCompleted: boolean
//   }[],
// ) => {
//   const section = sections.find((section) => section.id === resourceId)
//   return section ? section.sectionCompleted : false
// }

const isResourceCompleted = (
  resourceId: string,
  resourceType: 'lesson' | 'section',
  arr: {
    id: string
    lessonCompleted?: boolean
    sectionCompleted?: boolean
  }[],
) => {
  const result = arr.find((item) => item.id === resourceId)
  return result
    ? resourceType === 'lesson'
      ? result.lessonCompleted
      : result.sectionCompleted
    : false
}

const WorkshopItem = ({workshop}: {workshop: Workshop}) => {
  const moduleProgress = useModuleProgress()
  return (
    <div className="space-y-3">
      <h3 className="text-2xl">{workshop.title}</h3>
      <ul>
        {workshop.resources.map((resource) => {
          if (resource._type === 'explainer') {
            const isCompleted =
              (moduleProgress &&
                isResourceCompleted(
                  resource._id,
                  'lesson',
                  moduleProgress?.lessons,
                )) ||
              false
            return (
              <ResourceLink
                key={resource._id}
                title={resource.title}
                workshopSlug={workshop.slug.current}
                resourceSlug={resource.slug}
                isCompleted={isCompleted}
              />
            )
          }

          if (resource._type === 'section' && resource?.resources) {
            const isCompleted =
              (moduleProgress &&
                isResourceCompleted(
                  resource._id,
                  'section',
                  moduleProgress?.sections,
                )) ||
              false
            return (
              <ResourceLink
                key={resource._id}
                title={resource.title}
                workshopSlug={workshop.slug.current}
                resourceSlug={resource.resources[0].slug}
                isCompleted={isCompleted}
              />
            )
          }
        })}
      </ul>
    </div>
  )
}

const Learn: React.FC<{workshops: any[]; bonuses: any[]}> = ({
  workshops: unparsedWorkshops,
  bonuses: unparsedBonuses,
}) => {
  const title = 'Learn'

  const workshops = WorkshopSchema.array().parse(unparsedWorkshops)
  const bonuses = BonusSchema.array().parse(unparsedBonuses)

  return (
    <Layout
      meta={{
        title,
        openGraph: {
          images: [getOgImage({title})],
        },
      }}
    >
      <section>
        <Image
          src="/assets/flying-rocket-xl@2x.webp"
          alt=""
          width={1600}
          height={273}
          className="hidden w-full dark:xl:block"
        />
        <Image
          src="/assets/flying-rocket-light-xl@2x.webp"
          alt=""
          width={1600}
          height={273}
          className="hidden w-full xl:block dark:xl:hidden"
        />
        <Image
          src="/assets/flying-rocket@2x.webp"
          alt=""
          width={1600}
          height={273}
          className="hidden w-full dark:md:block dark:xl:hidden"
        />
        <Image
          src="/assets/flying-rocket-light@2x.webp"
          alt=""
          width={1600}
          height={273}
          className="hidden w-full md:block dark:md:hidden xl:hidden"
        />
        <Image
          src="/assets/flying-rocket-sm@2x.webp"
          alt=""
          width={1600}
          height={273}
          className="hidden w-full dark:block dark:md:hidden"
        />
        <Image
          src="/assets/flying-rocket-light-sm@2x.webp"
          alt=""
          width={1600}
          height={273}
          className="block w-full dark:hidden md:hidden"
        />
      </section>
      <main className="mx-auto w-full max-w-screen-lg px-5">
        <h2 className="text-center text-5xl">Learn Page</h2>
        <ul className="space-y-6">
          {workshops.map((workshop) => {
            return (
              <ModuleProgressProvider moduleSlug={workshop.slug.current}>
                <li key={workshop._id} className="flex space-x-6">
                  <div className="shrink-0">
                    <Image
                      src={workshop.image}
                      alt=""
                      width={200}
                      height={200}
                    />
                  </div>
                  <WorkshopItem workshop={workshop} />
                </li>
              </ModuleProgressProvider>
            )
          })}
          {bonuses.map((bonus) => {
            return (
              <li key={bonus._id} className="flex space-x-6">
                <div className="shrink-0">
                  <Image src={bonus.image} alt="" width={200} height={200} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl">{bonus.title}</h3>
                  <ul>
                    {bonus.resources.map((resource) => {
                      // TODO: is `/workshops/...` the right path prefix for interviews?
                      return (
                        <Link
                          key={resource._id}
                          href={`/workshops/${bonus.slug}/${resource.slug}`}
                          className="block"
                        >
                          {resource.title}
                        </Link>
                      )
                    })}
                  </ul>
                </div>
              </li>
            )
          })}
        </ul>
      </main>
    </Layout>
  )
}

export default Learn
