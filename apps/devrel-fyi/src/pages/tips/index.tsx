import Layout from '@/components/app/layout'
import {getAllTips, type Tip} from '@/lib/tips'
import {GetStaticProps} from 'next'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import Image from 'next/image'
import Link from 'next/link'
import config from '@/config'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Header from '@/components/app/header'
import {getOgImage} from '@/utils/get-og-image'
import Balancer from 'react-wrap-balancer'
import {useTipComplete} from '@skillrecordings/skill-lesson/hooks/use-tip-complete'
import Container from '@/components/app/container'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {ChevronRightIcon} from '@heroicons/react/solid'

export const getStaticProps: GetStaticProps = async (context) => {
  const tips = await getAllTips()

  return {
    props: {tips},
    revalidate: 10,
  }
}

const Tips: React.FC<{tips: Tip[]}> = ({tips}) => {
  const title = 'Tips'
  const {subscriber, loadingSubscriber} = useConvertkit()

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
      {/* <main className="mx-auto w-full max-w-screen-lg px-5"> */}
      <Container
        as="main"
        className="relative flex h-full flex-col items-center border-b px-0 sm:px-0 lg:px-0"
      >
        <div
          className="absolute top-0 hidden h-full w-px bg-border lg:block"
          aria-hidden="true"
        />
        <ul className="flex h-full flex-grow grid-cols-2 flex-col divide-y divide-border lg:grid lg:divide-y-0">
          {tips.map((tip) => {
            const {title, summary, slug} = tip
            return (
              <li key={slug} className="border-b">
                <Link
                  className="group"
                  href={{
                    pathname: '/tips/[tip]',
                    query: {
                      tip: slug,
                    },
                  }}
                  passHref
                  onClick={() => {
                    track('clicked view tip', {
                      tip: slug,
                    })
                  }}
                >
                  <article className="h-full w-full px-5 py-8 transition group-hover:bg-foreground/5 sm:p-10">
                    <div className="flex h-full flex-col">
                      <h2 className="w-full text-2xl lg:text-4xl">
                        <Balancer>{title}</Balancer>
                      </h2>
                      {summary && (
                        <p className="pt-5 font-light opacity-70">{summary}</p>
                      )}
                    </div>
                    <div className="flex w-full items-center justify-between gap-1.5">
                      {/* <div className="flex items-center gap-1.5">
                        <Image
                          src={require('../../../public/theo.jpg')}
                          alt={config.author}
                          width={40}
                          height={40}
                          placeholder="blur"
                          className="rounded bg-gray-200"
                        />
                        <span>{config.author}</span>
                      </div> */}
                      <div className="flex items-center gap-1 text-primary">
                        View{' '}
                        <ChevronRightIcon className="relative w-3 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              </li>
            )
          })}
        </ul>
      </Container>
      {!subscriber && (
        <Container className="flex items-center justify-center px-0 sm:px-0 lg:px-0">
          <PrimaryNewsletterCta className="w-full" />
        </Container>
      )}
      {/* </main> */}
    </Layout>
  )
}

export default Tips
