import Layout from '@/components/app/layout'
import {getWorkshopsForProduct} from '@/lib/workshops'
import {BonusSchema, getBonusesForProduct} from '@/lib/bonuses'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/app/header'
import {getOgImage} from '@/utils/get-og-image'
import {WorkshopSchema} from '@/lib/workshops'
import React from 'react'

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
}> = ({title, workshopSlug, resourceSlug}) => {
  return (
    <Link href={`/workshops/${workshopSlug}/${resourceSlug}`} className="block">
      {title}
    </Link>
  )
}

const Learn: React.FC<{workshops: any[]; bonuses: any[]}> = ({
  workshops: unparsedWorkshops,
  bonuses: unparsedBonuses,
}) => {
  const title = 'Learn'

  const workshops = WorkshopSchema.array().parse(unparsedWorkshops)
  const bonuses = BonusSchema.array().parse(unparsedBonuses)

  console.log({workshops})

  return (
    <Layout
      meta={{
        title,
        openGraph: {
          images: [getOgImage({title})],
        },
      }}
    >
      <Header title={title} />
      <main className="mx-auto w-full max-w-screen-lg px-5">
        <h2 className="text-center text-5xl">Learn Page</h2>
        <ul className="space-y-6">
          {workshops.map((workshop) => {
            return (
              <li key={workshop._id} className="flex space-x-6">
                <div className="shrink-0">
                  <Image src={workshop.image} alt="" width={200} height={200} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl">{workshop.title}</h3>
                  <ul>
                    {workshop.resources.map((resource) => {
                      if (resource._type === 'explainer') {
                        return (
                          <ResourceLink
                            key={resource._id}
                            title={resource.title}
                            workshopSlug={workshop.slug.current}
                            resourceSlug={resource.slug}
                          />
                        )
                      }

                      if (resource._type === 'section' && resource?.resources) {
                        return (
                          <ResourceLink
                            key={resource._id}
                            title={resource.title}
                            workshopSlug={workshop.slug.current}
                            resourceSlug={resource.resources[0].slug}
                          />
                        )
                      }
                    })}
                  </ul>
                </div>
              </li>
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
