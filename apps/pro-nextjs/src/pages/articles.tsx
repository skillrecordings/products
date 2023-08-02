import Layout from '@/components/app/layout'
import {getAllArticles, type Article} from '@/lib/articles'
import {GetStaticProps} from 'next'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import config from '@/config'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Header from '@/components/app/header'
import {getOgImage} from '@/utils/get-og-image'
import {format} from 'date-fns'

export const getStaticProps: GetStaticProps = async (context) => {
  const articles = await getAllArticles()

  return {
    props: {articles},
    revalidate: 10,
  }
}

const Articles: React.FC<{articles: Article[]}> = ({articles}) => {
  const title = 'Articles'

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
      <main className="mx-auto w-full max-w-3xl px-5">
        <ul className="grid grid-cols-1 justify-center gap-5 sm:grid-cols-2">
          {articles.map((article) => {
            const {title, image, summary, slug, _createdAt} = article
            return (
              <li key={slug} className="w-full rounded border p-5">
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

                    <div className="">
                      <p className="pb-1.5 text-sm opacity-60">
                        {format(new Date(_createdAt), 'MMMM do, y')}
                      </p>
                      <h2 className="text-xl font-semibold leading-tight">
                        <Balancer>{title}</Balancer>
                      </h2>
                      {summary && <p>{summary}</p>}
                    </div>
                    <div className="mt-8 flex items-center gap-1.5 text-sm">
                      <Image
                        src={require('../../public/jack-herrington.jpg')}
                        alt={config.author}
                        width={32}
                        height={32}
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
        </ul>
      </main>
    </Layout>
  )
}

export default Articles
