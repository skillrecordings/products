import Layout from '@/components/app/layout'
import {getAllArticles, type Article} from '@/lib/articles'
import {GetStaticProps} from 'next'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import config from '@/config'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Header from '@/components/app/header'
import {motion} from 'framer-motion'
import {format} from 'date-fns'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@skillrecordings/skill-lesson/ui'

export const getStaticProps: GetStaticProps = async (context) => {
  const articles = (await getAllArticles()).filter(
    (article) => article.state === 'published',
  )

  return {
    props: {articles},
    revalidate: 10,
  }
}

const Articles: React.FC<{articles: Article[]}> = ({articles}) => {
  const title = 'Articles'

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const item = {
    hidden: {opacity: 0, y: 20},
    show: {opacity: 1, y: 0},
  }

  return (
    <Layout
      meta={{
        title,
        openGraph: {
          images: [
            {
              url: 'https://res.cloudinary.com/dr0vx1dcs/image/upload/v1691061214/card-articles_2x_wvn4bs.png',
              alt: 'Pro Next.JS Articles',
            },
          ],
        },
      }}
    >
      <Header title={title} />
      <main className="mx-auto w-full max-w-3xl px-5 pb-10">
        <motion.ul
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 justify-center gap-5 sm:grid-cols-2"
        >
          {articles.map((article) => {
            const {title, image, summary, slug, _createdAt} = article
            return (
              <motion.li variants={item} key={slug} className="flex h-full">
                <Link
                  href={`/${article.slug}`}
                  passHref
                  onClick={() => {
                    track('clicked view article', {
                      article: slug,
                    })
                  }}
                  className="flex w-full rounded"
                >
                  <Card className="mx-auto flex h-full w-full flex-col justify-between bg-transparent p-5 shadow-none">
                    <div>
                      <CardHeader className="p-0">
                        {image && image.secure_url && (
                          <Image
                            className="aspect-video rounded"
                            src={image.secure_url}
                            width={image.width}
                            height={image.height}
                            alt="article illustration"
                          />
                        )}

                        <p className="pb-1.5 text-sm opacity-60">
                          {format(new Date(_createdAt), 'MMMM do, y')}
                        </p>
                        <CardTitle className="text-xl font-semibold leading-tight">
                          {title}
                        </CardTitle>
                      </CardHeader>
                      {summary && (
                        <CardContent className="p-0">
                          <p className="pt-4 text-sm opacity-75">
                            <Balancer ratio={0.3}>{summary}</Balancer>
                          </p>
                        </CardContent>
                      )}
                    </div>
                    <CardFooter className="mt-8 flex items-center gap-1.5 p-0 text-sm">
                      <Image
                        src={require('../../public/jack-herrington.jpg')}
                        alt={config.author}
                        width={32}
                        height={32}
                        placeholder="blur"
                        className="rounded-full bg-gray-200"
                      />
                      <span>{config.author}</span>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </main>
    </Layout>
  )
}

export default Articles
