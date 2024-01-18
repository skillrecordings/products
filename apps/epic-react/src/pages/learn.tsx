import Layout from '@/components/app/layout'
import {getAllWorkshops} from '@/lib/workshops'
import {GetStaticProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import config from '@/config'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Header from '@/components/app/header'
import {getOgImage} from '@/utils/get-og-image'

export const getStaticProps: GetStaticProps = async (context) => {
  const workshops = await getAllWorkshops()

  return {
    props: {workshops},
    revalidate: 10,
  }
}

const Learn: React.FC<{workshops: any[]}> = ({workshops}) => {
  console.log({WORKSHOPS: workshops})
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
                <Image src={workshop.image} alt="" width={200} height={200} />
                <div className="space-y-3">
                  <h3 className="text-2xl">{workshop.title}</h3>
                  <ul>
                    {workshop.sections.map((section: any) => {
                      return (
                        <Link
                          key={section._id}
                          href={`/workshops/${workshop.slug.current}/${section.slug}/${section.lessons[0].slug}`}
                          className="block"
                        >
                          {section.title}
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
