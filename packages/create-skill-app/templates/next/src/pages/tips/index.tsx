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
      <Container
        as="main"
        className="relative flex h-full flex-col items-center border-b px-0 sm:px-0 lg:px-0"
      >
        <ul className="flex h-full w-full flex-col divide-y">
          {tips ? (
            tips.map((tip) => {
              const {title, summary, slug, muxPlaybackId} = tip
              const thumbnail =
                muxPlaybackId &&
                `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=720&height=405&fit_mode=preserve&time=0`
              return (
                <li key={slug} className="">
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
                    <article className="flex h-full w-full grid-cols-5 flex-col items-center transition group-hover:bg-muted sm:grid">
                      {thumbnail && (
                        <div className="relative col-span-2 aspect-video h-full w-full">
                          <Image
                            src={thumbnail}
                            alt=""
                            aria-hidden="true"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="col-span-3 flex h-full flex-col px-10 py-8">
                        <h2 className="w-full text-xl font-semibold">
                          <Balancer>{title}</Balancer>
                        </h2>
                        {summary && <p className="pt-3">{summary}</p>}
                        <div className="mt-5 flex w-full items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1 text-primary">
                            View{' '}
                            <ChevronRightIcon className="relative w-3 transition group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </li>
              )
            })
          ) : (
            <div className="p-10 text-center text-muted-foreground">
              There are no tips yet. Add some!
            </div>
          )}
        </ul>
      </Container>
      {!subscriber && (
        <Container className="flex items-center justify-center border-b px-0 py-16 sm:px-0 lg:px-0">
          <PrimaryNewsletterCta className="w-full" />
        </Container>
      )}
    </Layout>
  )
}

export default Tips
