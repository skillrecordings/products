import React, {useCallback} from 'react'
import Layout from 'components/app/layout'
import type {GetServerSideProps, GetStaticProps, NextPage} from 'next'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import AboutKent from 'components/contributor-bio'
import Balancer from 'react-wrap-balancer'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {track} from 'utils/analytics'
import Image from 'next/image'
import LandingCopy from 'components/megabundle-2024-copy.mdx'
import Particles, {initParticlesEngine} from '@tsparticles/react'
import type {Engine} from '@tsparticles/engine'
import {loadSlim} from '@tsparticles/slim'
import KentImage from '../../../public/kent-c-dodds.png'
import {loadStarsPreset} from 'tsparticles-preset-stars'

import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import {trpc} from 'trpc/trpc.client'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {useRouter} from 'next/router'
import {getProduct} from 'lib/products'
import {
  CommerceProps,
  SanityProduct,
  SanityProductModule,
} from '@skillrecordings/commerce-server/dist/@types'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {getPricing} from '@skillrecordings/skill-lesson/lib/pricing'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Sparkles} from '../buy'
import ReactMarkdown from 'react-markdown'
import {useTheme} from 'next-themes'
import Link from 'next/link'
import MuxPlayer from '@mux/mux-player-react'
import '@mux/mux-player/themes/minimal'
import {getAvailableBonuses} from 'lib/available-bonuses'
import {XIconTwitter} from 'components/x-icon'
import path from 'path'
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'
import Head from 'next/head'
import {calculateOptimalDiscount} from 'utils/mega-bundle-discount-calculator'
import {getToken} from 'next-auth/jwt'
import {getUserAndSubscriber} from 'lib/users'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import SaleCountdown from '@skillrecordings/skill-lesson/path-to-purchase/sale-countdown'
import {drop, take} from 'lodash'
import {PoweredByStripe} from 'components/powered-by-stripe'
import Testimonials from 'components/testimonials'
import {Companies} from 'components/companies'
import {MoreCompanies} from 'components/more-companies'

const productId = '4a3706d4-7154-45ad-b9c6-05f25fae51df' // megabundle

const Index: NextPage<{
  product: SanityProduct
  products: SanityProduct[]
  bonuses: any[]

  commerceProps: CommerceProps
}> = ({product, products, bonuses, commerceProps}) => {
  const router = useRouter()
  const ALLOW_PURCHASE = true
  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []
  const hasPurchased = purchasedProductIds.includes(productId)

  React.useEffect(() => {
    if (hasPurchased) {
      router.push('/purchases')
    }
  }, [hasPurchased, router])

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
    {
      id: product.productId,
      image: {
        url: 'https://res.cloudinary.com/epic-web/image/upload/v1695972887/coupon_2x.png',
        width: 132,
        height: 112,
      },
      title: product.title as string,
      description: product?.description,
    },
  )

  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? commerceProps?.couponFromCode?.id : undefined)

  return !hasPurchased ? (
    <>
      <Layout
        meta={{
          titleAppendSiteName: false,
          title: 'Epic Megabundle',
          ogImage: {
            url: 'https://res.cloudinary.com/epic-web/image/upload/v1733220830/megabundle-2024/card_2x.jpg',
          },
        }}
        navigationClassName=""
        withContentNav={false}
      >
        <Head>
          <link
            rel="alternate"
            type="application/rss+xml"
            title={`RSS feed for ${process.env.NEXT_PUBLIC_SITE_TITLE}`}
            href="/rss.xml"
          />
        </Head>
        <Header commerceProps={commerceProps} />
        <main className="">
          <Article
            workshops={product.modules}
            commerceProps={commerceProps}
            products={products}
            purchasedProductIds={purchasedProductIds}
            bonuses={bonuses}
            couponId={couponId}
            hasPurchased={hasPurchased}
          />
          <section className="relative mt-16 flex flex-col items-center justify-start dark:bg-black/30">
            <div className="flex flex-col items-center justify-center py-16">
              <h2 className="max-w-lg text-center text-2xl font-bold sm:text-3xl lg:text-4xl">
                <Balancer>
                  Become a Professional Full Stack Web Developer
                </Balancer>
              </h2>
              <h3 className="max-w-lg pt-5 text-center text-lg text-gray-600 dark:text-gray-400">
                <Balancer>
                  The most comprehensive guide to professional web development
                  by Kent C. Dodds.
                </Balancer>
              </h3>
            </div>
            <div
              id="megabundle-2024"
              className="relative flex flex-col items-center justify-start"
            >
              <Sparkles />
              {products
                ?.filter((product: any) => product.state !== 'unavailable')
                .map((product, i) => {
                  return (
                    <PriceCheckProvider
                      key={product.slug}
                      purchasedProductIds={purchasedProductIds}
                    >
                      <div data-pricing-container="" key={product.name}>
                        <Pricing
                          bonuses={bonuses}
                          allowPurchase={ALLOW_PURCHASE}
                          userId={commerceProps?.userId}
                          product={product}
                          purchased={purchasedProductIds.includes(
                            product.productId,
                          )}
                          index={i}
                          couponId={couponId}
                          couponFromCode={commerceProps?.couponFromCode}
                          options={{
                            saleCountdownRenderer: (props: any) => {
                              return (
                                <SaleCountdown
                                  data-pricing-product-sale-countdown=""
                                  size="lg"
                                  {...props}
                                />
                              )
                            },
                          }}
                        />
                      </div>
                    </PriceCheckProvider>
                  )
                })}
            </div>
            <div className="mx-auto flex items-center justify-center">
              <PoweredByStripe />
            </div>
            <Image
              className="mb-16 mt-3"
              src="https://res.cloudinary.com/total-typescript/image/upload/v1669928567/money-back-guarantee-badge-16137430586cd8f5ec2a096bb1b1e4cf_o5teov.svg"
              width={130}
              height={130}
              alt="30-Day Money Back Guarantee"
            />
          </section>

          <AboutKent />
          <MoreCompanies />
          <Testimonials />
          <div className="relative mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center px-5 py-16 lg:py-20">
            <div
              className="absolute top-0 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800"
              aria-hidden="true"
            />
            <h2 className="w-full text-balance pb-20 text-center text-3xl font-bold sm:text-3xl lg:text-4xl">
              Frequently Asked Questions
            </h2>
            <FaqBody />
          </div>
        </main>
      </Layout>
    </>
  ) : null
}

const Article: React.FC<{
  workshops: SanityProductModule[]
  commerceProps: CommerceProps
  products: SanityProduct[]
  purchasedProductIds: string[]
  bonuses: any[]
  couponId: string | undefined
  hasPurchased: boolean
}> = ({
  workshops,

  commerceProps,
  products,
  purchasedProductIds,
  bonuses,
  couponId,
  hasPurchased,
}) => {
  return (
    <article className="prose mx-auto max-w-3xl px-5 pt-8 dark:prose-invert sm:prose-lg prose-headings:pt-8 prose-headings:font-bold prose-p:max-w-2xl prose-ul:pl-0 sm:pt-5">
      <LandingCopy
        // @ts-ignore
        commerceProps={commerceProps}
        hasPurchased={hasPurchased}
        components={{
          // ...linkedHeadingComponents,
          Buy: ({children}: any) => {
            return (
              <div
                id="megabundle-2024"
                className="not-prose relative flex flex-col items-center justify-start"
              >
                <Sparkles />
                {products
                  ?.filter((product: any) => product.state !== 'unavailable')
                  .map((product, i) => {
                    return (
                      <PriceCheckProvider
                        key={product.slug}
                        purchasedProductIds={purchasedProductIds}
                      >
                        <div data-pricing-container="" key={product.name}>
                          <Pricing
                            bonuses={bonuses}
                            allowPurchase={true}
                            userId={commerceProps?.userId}
                            product={product}
                            purchased={purchasedProductIds.includes(
                              product.productId,
                            )}
                            index={i}
                            couponId={couponId}
                            couponFromCode={commerceProps?.couponFromCode}
                            options={{
                              withGuaranteeBadge: true,
                              showAllContent: false,
                              saleCountdownRenderer: (props: any) => {
                                return (
                                  <div className="pb-5">
                                    <SaleCountdown
                                      data-pricing-product-sale-countdown=""
                                      size="lg"
                                      {...props}
                                    />
                                  </div>
                                )
                              },
                            }}
                          />
                        </div>
                      </PriceCheckProvider>
                    )
                  })}
              </div>
            )
          },
          Testimonial: ({children, author, url}: any) => {
            return (
              <blockquote className="relative !my-0 flex flex-col justify-between rounded-md border-l-0 bg-white !p-5 not-italic text-foreground dark:bg-white/5 lg:!p-8">
                <div className="prose dark:prose-invert sm:prose-lg prose-p:font-medium">
                  {children}
                </div>
                <div className="mt-8 flex w-full items-center justify-between gap-1.5 text-base">
                  <div className="flex items-center gap-2">
                    {author.image ? (
                      <Image
                        src={author.image}
                        alt={author.name}
                        width={48}
                        height={48}
                        className="!my-0 rounded-full"
                      />
                    ) : (
                      <span className="opacity-75">—</span>
                    )}
                    <span className="opacity-75">{author.name}</span>
                  </div>
                  {url && (
                    <a
                      href={url}
                      className=""
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <XIconTwitter className="h-5 w-5 text-foreground opacity-50 transition hover:opacity-100" />
                    </a>
                  )}
                </div>
              </blockquote>
            )
          },

          Image,
          WorkshopListItem: ({children, imageUrl, size = 'default'}: any) => {
            const getImageSize = (size: string) => {
              switch (size) {
                case 'sm':
                  return 40
                case 'default':
                  return 60
                case 'large':
                  return 80
                default:
                  return 60
              }
            }
            return (
              <li className="not-prose flex flex-row items-center gap-5">
                <Image
                  src={imageUrl}
                  alt={children}
                  width={getImageSize(size)}
                  height={getImageSize(size)}
                />
                {children}
              </li>
            )
          },
          WorkshopAppScreenshot,
          AboutKent: ({children}: any) => {
            return (
              <div className="rounded-lg border bg-white px-8 py-3 dark:bg-white/5 sm:px-10 sm:py-5">
                <Image
                  src={KentImage}
                  width={150}
                  height={150}
                  alt="Kent C. Dodds"
                  className="float-right ml-5 aspect-square w-32 rounded-full bg-white/5 sm:ml-10 sm:w-auto"
                  style={{
                    shapeOutside: 'circle()',
                  }}
                />
                <div className="pt-2">{children}</div>
              </div>
            )
          },
          li: ({children}: any) => {
            return (
              <li className='list-none py-1 pl-7 before:-ml-7 before:pr-3 before:text-emerald-500 before:content-["✓"] dark:before:text-emerald-300 sm:before:-ml-2'>
                {children}
              </li>
            )
          },
        }}
      />
    </article>
  )
}

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

const Header = ({commerceProps}: {commerceProps: CommerceProps}) => {
  const percentageDiscount =
    Number(commerceProps.couponFromCode?.percentageDiscount) * 100 || null
  return (
    <header className="relative mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#fff_0%,transparent_65%)] px-5 pt-5 text-center dark:bg-[radial-gradient(ellipse_at_top,#1a1e2c_0%,transparent_65%)] sm:pt-10">
      <h1 className="relative z-10 pb-5 text-3xl font-bold sm:pb-2 sm:text-4xl lg:text-5xl">
        <span className="inline-flex text-balance pb-3 text-[0.35em] font-semibold uppercase tracking-widest text-blue-600 shadow-cyan-200/50 dark:text-blue-300 dark:brightness-110 dark:drop-shadow-xl sm:pb-8 md:text-sm">
          Start your journey to becoming an Epic Web Developer
        </span>
        {percentageDiscount ? (
          <div className="text-balance text-gray-900 dark:text-white">
            Save{' '}
            {percentageDiscount && (
              <span className="font-extrabold text-amber-600 dark:text-amber-300">
                {percentageDiscount}%
              </span>
            )}{' '}
            on everything you need to become an Epic web developer
          </div>
        ) : (
          <div className="text-balance text-gray-900 dark:text-white">
            Everything you need to become an Epic web developer
          </div>
        )}
      </h1>
      <Image
        alt=""
        quality={100}
        priority
        width={1158}
        src={require('../../../public/assets/megabundle/bundle-hero-dark@2x.png')}
        aria-hidden="true"
        className="invisible hidden scale-125 dark:visible dark:block sm:scale-100"
      />
      <Image
        alt=""
        quality={100}
        priority
        width={1158}
        src={require('../../../public/assets/megabundle/bundle-hero-light@2x.png')}
        aria-hidden="true"
        className="visible block scale-125 dark:invisible dark:hidden sm:scale-100"
      />
    </header>
  )
}

type SubscribeProps = {
  subscriber: any
}

const Subscribe: React.FC<SubscribeProps> = ({subscriber}) => {
  return (
    <section
      aria-label="Newsletter sign-up"
      className="px-5 pb-32 pt-10"
      id="primary-newsletter-cta"
    >
      {!subscriber ? (
        <PrimaryNewsletterCta
          onSubmit={() => {
            track('subscribed from landing page')
          }}
        />
      ) : (
        <div className="text-center text-2xl font-bold sm:text-3xl lg:text-4xl">
          You're subscribed <span aria-hidden="true">✧</span> Thanks!
        </div>
      )}
    </section>
  )
}

export default Index

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, res, query} = context
  const token = await getToken({req})
  const {user, subscriber} = await getUserAndSubscriber({req, res, query})
  const sanityProduct = await getProduct(productId as string)
  const pricing = await getPricing('megabundle-2024')

  const purchasedProductIds =
    user?.purchases?.map((purchase: any) => purchase.productId) || []

  const couponIdOrCode = query.coupon || query.code

  const coupon = couponIdOrCode
    ? couponIdOrCode
    : calculateOptimalDiscount(purchasedProductIds).discountCode

  const products = pricing && pricing.products
  const availableBonuses = await getAvailableBonuses()

  const {props: commerceProps} = await propsForCommerce({
    query: {
      ...query,
      coupon,
    },
    token,
    products,
  })

  const hasPurchased = purchasedProductIds.includes(productId)

  if (hasPurchased) {
    return {
      redirect: {
        destination: '/purchases',
        permanent: false,
      },
    }
  }

  return {
    props: {
      product: sanityProduct,
      products,
      bonuses: availableBonuses,
      commerceProps,
    },
  }
}

const WorkshopAppScreenshot = () => {
  const {theme} = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="aspect-[1520/1090] h-full w-full">
      {mounted ? (
        <Image
          src={
            theme === 'light'
              ? 'https://res.cloudinary.com/epic-web/image/upload/v1696929540/workshop-app-screenshot-light-1_2x.png'
              : 'https://res.cloudinary.com/epic-web/image/upload/v1696929542/workshop-app-screenshot-1_2x.png'
          }
          width={1520}
          quality={100}
          height={1090}
          alt=""
          aria-hidden
          priority
        />
      ) : null}
    </div>
  )
}

function FaqBody() {
  const questions = markdownContent
    .split('## ')
    .filter((item) => item.trim() !== '')
  const formattedQuestions = questions.map((question) => {
    const parts = question.split('\n')
    const title = parts[0].trim()
    const body = parts.slice(1).join('\n').trim()
    return {title, body}
  })
  return (
    <Accordion
      type="multiple"
      className="flex w-full flex-col gap-x-3 gap-y-3 md:grid md:grid-cols-2 md:gap-y-0"
    >
      <ul className="flex flex-col gap-3">
        {take(formattedQuestions, formattedQuestions.length / 2).map(
          ({title, body}) => (
            <Question title={title} body={body} key={title} />
          ),
        )}
      </ul>
      <ul className="flex flex-col gap-3">
        {drop(formattedQuestions, formattedQuestions.length / 2).map(
          ({title, body}) => (
            <Question title={title} body={body} key={title} />
          ),
        )}
      </ul>
    </Accordion>
  )
}

const Question: React.FC<{title: string; body: string}> = ({title, body}) => {
  return (
    <AccordionItem
      value={title}
      className="rounded-md border border-gray-200/50 bg-white shadow-xl shadow-gray-500/5 transition dark:border-white/5 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/10"
    >
      <li className="flex flex-col" key={title}>
        <AccordionHeader className="">
          <AccordionTrigger className="px-3 py-3 text-left text-base font-semibold sm:px-5 sm:py-5 sm:text-lg [&_[data-chevron]]:text-foreground">
            {title}
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent className="pb-5">
          <ReactMarkdown
            components={{
              a: (props) => <a {...props} target="_blank" />,
            }}
            className="prose px-5 dark:prose-invert"
          >
            {body}
          </ReactMarkdown>
        </AccordionContent>
      </li>
    </AccordionItem>
  )
}

const markdownContent = `
## What's in the Epic Megabundle?

Everything. Literally all 31 self-paced workshops we've ever published.

## How long do I have access to the course?

You have lifetime access to your purchased course. You can access it at any time.

## Is there a money-back guarantee?

Yes! We offer a 30-day, no-questions-asked refund policy. If you're not satisfied with your purchase, we'll refund you within 30 days of purchase.

## Can we share a single account with the entire team?

No. Each team member will have their own account and will be able to access the course independently.

## What discounts are available?

There are no special discounts available.

We support purchase power parity. This is automated based on IP address of the computer you are using to make the purchase. It's an imperfect system and the discount does not always display.

Note that if you use the PPP discount your purchase will be restricted to the country you purchased it from.

## Can I use multiple discounts?

No, discounts do not stack so choose the best one for you?

## How do the “team” seats work? What is a “seat” in this context

When you buy a team seat, you receive a link that can be used to register for the number of accounts you have purchased. The license is non-transferable (you cannot reassign a license from one person to another).

## If I buy a lower tier, can I upgrade later?

Yes. You pay the difference from what you paid for the lower tier to the price of Pro at the time you upgrade. This means that unless there’s still a discount on Pro, you’ll not get a discounted upgrade.

## What is PPP?

Purchasing Power Parity - a lower price for users in certain countries; content is a bit cheaper and the course is only accessible from the country it is purchased from.

## Can I gift a license to someone else?

Yes, you can! Simply enter their email address instead of your own. 

Or you can purchase a team license with 1 seat and send them the code. 

There might be a verification code they receive that you’ll have to request from them. Also, if you buy a PPP license, then make sure you’re both in the same country otherwise they won’t be able to access the content in their country.

## Is it possible to buy the course some other way? Installments? PayPal/etc?

No, the only available buying options are those on the site right now.

## Does PPP limit bonus content?

PPP purchases are limited to the content that is displayed at the time of purchase and current and future bonus materials and features might not be available.

When in doubt, and if you want to guarantee access to everything, purchase the PRO tier without PPP discount.

## Does my company own the team license(s)?

Team licenses are actually coupon codes that can be redeemed by users. Companies are not meant to own or keep the licenses.

They are meant to be distributed and are owned by the individual that claims that seat.

They cannot be transferred or "passed around"

## Can I customize the invoice? VAT/company details?

Yes, there’s a textarea that allows you to put any arbitrary information into the invoice PDF/printable.

## Who is the Epic Megabundle for?

Epic Megabundle is for anyone with a moderate understanding of JavaScript! Give this blog post a read: [https://kentcdodds.com/blog/javascript-to-know-for-react](https://kentcdodds.com/blog/javascript-to-know-for-react). If you’re comfortable with the features in that post, then you should be good to go. If not, then you’ll struggle a little bit with the syntax and JavaScript features used in the workshops.

## What if I've been working with and studying React for years?

You'll still learn something! Epic React is tailored for all experience levels! Kent covers everything from the basic levels to the advanced to the experimental!

## How much time does it take to complete the whole course?

This is 6 months to a years worth of learning. Consider starting a club: [KCD Learning Clubs Ideas](https://github.com/kentcdodds/kcd-learning-clubs-ideas)

## How do I get a rocket in Discord?

To link your KCD account with Discord navigate to [https://epicweb.dev/discord](https://epicweb.dev/discord) after you have purchased the course. Click on the button and you'll have the \`Epic React Dev\` role added to your account as well as the 🚀 added to your name!

## Is there any live aspect to Epic Megabundle or is it all self-paced?

It is all self-paced but Kent holds [office hours](https://kcd.im/office-hours) that you can join to ask questions.

You can join a learning club to check-in with other students live, learn more at https://kcd.im/clubs

In addition, [the Discord Community](https://epicweb.dev/discord) is very active.

## How can I join a learning club to study with other users?

Visit this link to learn about how to join a club [https://kcd.im/discord-active-clubs](https://kcd.im/discord-active-clubs). The learning clubs are student-driven, so if you don’t see one that has openings then feel free to create your own. Check the following link for more information about creating your own club: [https://kcd.im/clubs](https://kcd.im/clubs)

## Can I join an Epic Web club without buying it and just use the open source repositories?

No. The Epic Web learning clubs are just for those that paid for the course.

## What versions of React is this compatible with?

The course is up to date and compatible with React v19.x.

Kent plans on keeping the material up-to-date and labeling anything that changes in a way that would require code changes.

Major changes or updates may require an upgrade fee or additional purchase.

## Can I change my email address with which I bought the course?

Yes. Contact the support team at [${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}](mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}?subject=Epic%20React:%20Email%20Change%20Request). Note that you cannot transfer your license to another person.

You cannot transfer your license to another person.

## None of these are my questions, can I contact someone?

Yes! You can email the Epic React Support Email: [${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}](mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}?subject=Epic%20React%20Question)

## What are the terms and conditions?

You can [read them here](https://epicweb.dev/privacy).

`
