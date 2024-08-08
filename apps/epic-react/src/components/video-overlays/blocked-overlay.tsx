import Link from 'next/link'
import * as React from 'react'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useQuery} from '@tanstack/react-query'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import type {SanityDocument} from '@sanity/client'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import {
  confirmSubscriptionToast,
  useConvertkit,
} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import snakeCase from 'lodash/snakeCase'
import {SubscribeToConvertkitForm} from '@skillrecordings/skill-lesson/convertkit'
import {usePriceCheck} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import ReactMarkdown from 'react-markdown'
import pluralize from 'pluralize'
import {Tooltip, TooltipProvider, TooltipTrigger} from '@skillrecordings/ui'
import {TooltipContent} from '@radix-ui/react-tooltip'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {useSession} from 'next-auth/react'
import {trpcSkillLessons} from '@skillrecordings/skill-lesson/utils/trpc-skill-lessons'
import SelfRedeemButton from '@skillrecordings/skill-lesson/team/self-redeem-button'

const BlockedOverlay: React.FC<{
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
            </div>
          </div>
        </>
      ) : product ? (
        <div data-buy="">
          {canViewTeam ? (
            <InviteTeam product={product} />
          ) : (
            <BuyProduct product={product} />
          )}
        </div>
      ) : null}
    </div>
  )
}

export default BlockedOverlay

const BuyProduct: React.FC<{product?: SanityProduct}> = ({product}) => {
  const {ability} = useMuxPlayer()
  const {module} = useLesson()
  const productImage = product?.image?.url || product?.image || module?.image
  const canViewRegionRestriction = ability.can('view', 'RegionRestriction')
  const legacyModules =
    product?.modules &&
    product.modules.filter(({moduleType}) => moduleType === 'legacy-module')
  const bonuses =
    product?.modules &&
    product.modules.filter(({moduleType}) => moduleType === 'bonus')

  const {merchantCoupon} = usePriceCheck()
  const showBonuses = bonuses?.length && !Boolean(merchantCoupon)

  if (!product) return null

  return (
    <div data-pricing="">
      <div data-col="1">
        {productImage && (
          <Image
            data-image=""
            src={productImage as string}
            width={200}
            height={200}
            alt=""
            aria-hidden="true"
          />
        )}
        <h2 data-title="">
          <Balancer>
            {canViewRegionRestriction
              ? 'Your License is Region Restricted'
              : `Level up your ${module.title}`}
          </Balancer>
        </h2>

        <h3 data-description="">
          <Balancer>
            {canViewRegionRestriction ? (
              'Your license is restricted to a specific region. You can upgrade to an unrestricted license to view this lesson anywhere.'
            ) : product.description ? (
              <ReactMarkdown data-markdown="">
                {product.description}
              </ReactMarkdown>
            ) : (
              'Get access to all lessons in this workshop.'
            )}
          </Balancer>
        </h3>
        {legacyModules && (
          <>
            <div data-includes="">
              Includes {legacyModules.length > 1 && 'all'}{' '}
              {legacyModules.length}{' '}
              {pluralize('workshop', legacyModules.length)}
              {showBonuses ? (
                <span data-bonus="">
                  {' '}
                  + {bonuses.length > 1 ? bonuses.length : ''}{' '}
                  {pluralize('bonus', bonuses.length)}
                </span>
              ) : (
                ''
              )}
            </div>
            {/*<div data-modules="">*/}
            {/*  <TooltipProvider delayDuration={0}>*/}
            {/*    {workshops.map((module) => {*/}
            {/*      return (*/}
            {/*        <Tooltip>*/}
            {/*          <TooltipTrigger asChild>*/}
            {/*            <Link*/}
            {/*              key={module.slug}*/}
            {/*              data-type={module.moduleType}*/}
            {/*              href={`/workshops/${module.slug}`}*/}
            {/*              target="_blank"*/}
            {/*            >*/}
            {/*              {module?.image?.url || module?.image ? (*/}
            {/*                <Image*/}
            {/*                  src={module.image?.url ?? module.image}*/}
            {/*                  alt={`${module.title} workshop`}*/}
            {/*                  width={60}*/}
            {/*                  height={60}*/}
            {/*                />*/}
            {/*              ) : (*/}
            {/*                module.title*/}
            {/*              )}*/}
            {/*            </Link>*/}
            {/*          </TooltipTrigger>*/}
            {/*          <TooltipContent className="text-sm bg-background">*/}
            {/*            {module.title}*/}
            {/*          </TooltipContent>*/}
            {/*        </Tooltip>*/}
            {/*      )*/}
            {/*    })}*/}
            {/*    {showBonuses ? (*/}
            {/*      <>*/}
            {/*        <span>+</span>*/}
            {/*        {bonuses.map((module) => {*/}
            {/*          return module.state === 'published' ? (*/}
            {/*            <Tooltip key={module.slug}>*/}
            {/*              <TooltipTrigger asChild>*/}
            {/*                <Link*/}
            {/*                  key={module.slug}*/}
            {/*                  data-type={module.moduleType}*/}
            {/*                  href={`/bonuses/${module.slug}`}*/}
            {/*                  target="_blank"*/}
            {/*                >*/}
            {/*                  {(module.image?.url || module.image) && (*/}
            {/*                    <img*/}
            {/*                      src={module.image?.url ?? module.image}*/}
            {/*                      alt={`${module.title} workshop`}*/}
            {/*                      width={60}*/}
            {/*                      height={60}*/}
            {/*                    />*/}
            {/*                  )}*/}
            {/*                </Link>*/}
            {/*              </TooltipTrigger>*/}
            {/*              <TooltipContent className="text-sm bg-background">*/}
            {/*                {module.title}*/}
            {/*              </TooltipContent>*/}
            {/*            </Tooltip>*/}
            {/*          ) : (*/}
            {/*            <Tooltip key={module.slug}>*/}
            {/*              <TooltipTrigger asChild>*/}
            {/*                {(module.image?.url || module.image) && (*/}
            {/*                  <img*/}
            {/*                    data-type={module.moduleType}*/}
            {/*                    src={module.image?.url ?? module.image}*/}
            {/*                    alt={`${module.title} workshop`}*/}
            {/*                    width={60}*/}
            {/*                    height={60}*/}
            {/*                  />*/}
            {/*                )}*/}
            {/*              </TooltipTrigger>*/}
            {/*              <TooltipContent className="text-sm bg-background">*/}
            {/*                {module.title}*/}
            {/*              </TooltipContent>*/}
            {/*            </Tooltip>*/}
            {/*          )*/}
            {/*        })}*/}
            {/*      </>*/}
            {/*    ) : null}*/}
            {/*  </TooltipProvider>*/}
            {/*</div>*/}
          </>
        )}
      </div>
      <div data-col="2">
        {product && (
          <Pricing
            allowPurchase={product.state === 'active'}
            product={product}
            canViewRegionRestriction={canViewRegionRestriction}
            cancelUrl={window.location.toString()}
            options={{showAllContent: false}}
          />
        )}
      </div>
    </div>
  )
}

const InviteTeam: React.FC<{
  product?: SanityProduct
}> = ({product}) => {
  const {refetchAbility, inviteTeamPagePath = '/team'} = useMuxPlayer()
  const {module} = useLesson()
  const {data: session} = useSession()
  const {data: purchaseDetails, status} =
    trpcSkillLessons.purchases.getPurchaseByProductId.useQuery({
      productId: product?.productId as string,
    })

  return (
    <div data-team-purchase="">
      {module?.image && (
        <Image
          data-image=""
          src={module.image}
          width={220}
          height={220}
          alt={module.title}
        />
      )}
      <h2 data-title="">Level up your {module.title}</h2>
      <h3 data-subtitle="">
        <Balancer>
          You've purchased a team license with{' '}
          {purchaseDetails?.purchase?.bulkCoupon?.maxUses} seats and haven't
          claimed a seat for yourself yet.
        </Balancer>
      </h3>
      {purchaseDetails?.purchase?.bulkCoupon?.id &&
        !purchaseDetails?.existingPurchase && (
          <SelfRedeemButton
            disabled={Boolean(purchaseDetails?.existingPurchase)}
            userEmail={session?.user?.email}
            bulkCouponId={purchaseDetails?.purchase?.bulkCoupon?.id}
            productId={product?.productId}
            onSuccess={(redeemedPurchase) => {
              if (redeemedPurchase) {
                refetchAbility()
              }
            }}
          >
            Claim one seat for yourself and start learning
          </SelfRedeemButton>
        )}
      <Link href={inviteTeamPagePath} data-invite-team="">
        Invite your team
      </Link>
    </div>
  )
}

const Subscribe: React.FC<{actionLabel?: string}> = ({
  actionLabel = 'Continue Watching',
}) => {
  const {lesson, module} = useLesson()
  const {refetch: refetchSubscriber} = useConvertkit()
  const handleOnSuccess = async (subscriber: any, email?: string) => {
    if (subscriber) {
      email && setUserId(email)
      refetchSubscriber()
      track('subscribed to email list', {
        lesson: lesson.slug,
        module: module.slug.current,
        location: 'exercise',
        moduleType: module.moduleType,
        lessonType: lesson._type,
      })
      confirmSubscriptionToast()
    }
  }

  const startedLearningField = {
    // ex: started_zod_tutorial: 2022-09-02
    [`started_${snakeCase(module.slug.current as string)}_${
      module.moduleType
    }`.toLowerCase()]: new Date().toISOString().slice(0, 10),
  }
  return (
    <SubscribeToConvertkitForm
      successMessage="Thanks! You're being redirected..."
      subscribeApiURL={process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBE_URL}
      actionLabel={actionLabel}
      fields={startedLearningField}
      onSuccess={(subscriber, email) => {
        return handleOnSuccess(subscriber, email)
      }}
    />
  )
}
