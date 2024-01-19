import Layout from '@/components/app/layout'
import {getAllWorkshops} from '@/lib/workshops'
import {getAllBonuses} from '@/lib/bonuses'
import {GetStaticProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import config from '@/config'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Header from '@/components/app/header'
import {getOgImage} from '@/utils/get-og-image'

export const getStaticProps: GetStaticProps = async (context) => {
  const workshops = await getAllWorkshops()
  const bonuses = await getAllBonuses()

  return {
    props: {workshops, bonuses},
    revalidate: 10,
  }
}

const Learn: React.FC<{workshops: any[]; bonuses: any[]}> = ({
  workshops,
  bonuses,
}) => {
  const title = 'Learn'

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
          {workshops.map((workshop: any) => {
            return (
              <li key={workshop._id} className="flex space-x-6">
                <div className="shrink-0">
                  <Image src={workshop.image} alt="" width={200} height={200} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl">{workshop.title}</h3>
                  <ul>
                    {workshop.resources.map((resource: any) => {
                      return (
                        <Link
                          key={resource._id}
                          href={
                            resource._type === 'section'
                              ? `/workshops/${workshop.slug.current}/${resource.resources[0].slug.current}`
                              : `/workshops/${workshop.slug.current}/${resource.slug.current}`
                          }
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
          {bonuses.map((bonus: any) => {
            return (
              <li key={bonus._id} className="flex space-x-6">
                <div className="shrink-0">
                  <Image src={bonus.image} alt="" width={200} height={200} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl">{bonus.title}</h3>
                  <ul>
                    {bonus.lessons.map((lesson: any) => {
                      return (
                        <Link
                          key={lesson._id}
                          href={`/workshops/${bonus.slug.current}/${lesson.slug}`}
                          className="block"
                        >
                          {lesson.title}
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
