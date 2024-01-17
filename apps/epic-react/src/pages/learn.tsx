import Layout from '@/components/app/layout'
import {getAllWorkshops, type Workshop} from '@/lib/workshops'
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

const Learn: React.FC<{workshops: Workshop[]}> = ({workshops}) => {
  console.log({workshops})
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
        <ul>
          {workshops.map((workshop: Workshop) => {
            return (
              <li key={workshop._id}>
                <Image src={workshop.image} alt="" width={200} height={200} />
              </li>
            )
          })}
        </ul>
        {/* <ul className="grid grid-cols-2 justify-center gap-5">
          {articles.map((article) => {
            const {title, image, summary, slug} = article
            return (
              <li key={slug} className="w-full">
                <Link
                  href={`/${article.slug}`}
                  passHref
                  onClick={() => {
                    track('clicked view article', {
                      article: slug,
                    })
                  }}
                >
                  <article className="mx-auto w-full max-w-screen-md">
                    {image && image.secure_url && (
                      <header>
                        <Image
                          className="aspect-video rounded"
                          src={image.secure_url}
                          width={image.width}
                          height={image.height}
                          alt="article illustration"
                        />
                      </header>
                    )}

                    <div className="py-5">
                      <h2 className="text-3xl font-bold">{title}</h2>
                      {summary && <p>{summary}</p>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Image
                        src={require('../../public/instructor.png')}
                        alt={config.author}
                        width={40}
                        height={40}
                        placeholder="blur"
                        className="rounded-full bg-gray-200"
                      />
                      <span>{config.author}</span>
                    </div>
                  </article>
                </Link>
              </li>
            )
          })}
        </ul> */}
      </main>
    </Layout>
  )
}

export default Learn
