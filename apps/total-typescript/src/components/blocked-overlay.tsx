import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useQuery} from '@tanstack/react-query'

import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import {ProEssentialsBanner} from './book/pro-essentials-banner'
import {
  InviteTeam,
  Subscribe,
} from '@skillrecordings/skill-lesson/video/video-overlays'

export const BlockedOverlay: React.FC<{
  product?: SanityProduct
}> = ({product}) => {
  const {lesson, module} = useLesson()
  const {videoResourceId} = useVideoResource()
  const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${videoResourceId}`
  const {refetchAbility, ability} = useMuxPlayer()
  const {data: ctaText} = useQuery(
    [`exercise-free-tutorial`, lesson.slug, module.slug.current],
    async () => {
      return sanityClient
        .fetch(
          `
      *[_type == 'cta' && slug.current == "${
        module.moduleType === 'tutorial' ? 'free-tutorial' : 'paid-workshop'
      }"][0]{
        body
      }
    `,
        )
        .then((response: SanityDocument) => response.body)
    },
    {
      enabled: module.moduleType === 'tutorial',
    },
  )

  const canViewTeam = ability.can('view', 'Team')
  return (
    <div data-video-overlay="blocked" id="video-overlay">
      <Image
        data-thumbnail=""
        src={thumbnail}
        fill
        alt=""
        aria-hidden="true"
        priority
      />
      {module?.moduleType === 'tutorial' ? (
        <>
          <div data-subscribe="">
            <div data-col="1">
              {module?.image && (
                <Image
                  data-image=""
                  src={module.image}
                  width={190}
                  height={190}
                  alt={module.title}
                />
              )}
              <h2 data-title="">
                <Balancer>Level up with "{module.title}"</Balancer>
              </h2>
              <h3 data-subtitle="">
                Access all lessons in this {module.moduleType}.
              </h3>
              <Subscribe />
              <p data-nospam="">No spam, unsubscribe at any time.</p>
            </div>
          </div>
          <div data-col="2">
            <div data-markdown="">
              <h3 data-title="">This is a free tutorial</h3>
              {ctaText && <PortableText value={ctaText} />}
            </div>
          </div>
        </>
      ) : product ? (
        <div data-buy="">
          {canViewTeam ? (
            <InviteTeam product={product} />
          ) : (
            <div className="mx-auto flex justify-center shadow-2xl">
              <ProEssentialsBanner />
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
