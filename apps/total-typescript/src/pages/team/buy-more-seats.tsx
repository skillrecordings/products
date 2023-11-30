import React from 'react'
import Layout from '@/components/app/layout'
import {GetServerSideProps} from 'next'
import BuyMoreSeats from '@skillrecordings/skill-lesson/team/buy-more-seats'
import {TicketIcon} from '@heroicons/react/outline'
import {getToken} from 'next-auth/jwt'
import {getSdk} from '@skillrecordings/database'
import Card from '@skillrecordings/skill-lesson/team/card'
import {z} from 'zod'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import pluralize from 'pluralize'

const productDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  title: z.string(),
  image: z.object({url: z.string()}),
  features: z.array(z.object({value: z.string()})),
  modules: z.array(
    z.object({
      title: z.string(),
      image: z.object({url: z.string()}),
      state: z.string(),
      slug: z.string(),
      moduleType: z.string(),
      sections: z.array(
        z.object({
          _id: z.string(),
          lessons: z.array(
            z.object({
              _id: z.string(),
            }),
          ),
        }),
      ),
    }),
  ),
})

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const token = await getToken({req})
  const {getPurchasesForUser, getProduct} = getSdk()

  let productId: string | undefined = undefined

  if (query.productId) {
    productId = query.productId as string
  } else {
    const purchases = await getPurchasesForUser(token?.sub)

    // try to find a bulk purchase first
    const bulkPurchases = purchases.filter(
      (purchase) => purchase.bulkCoupon !== null,
    )

    // try to find individual-access purchase
    const individualPurchase = purchases.find(
      (purchase) =>
        purchase.bulkCoupon === null && purchase.redeemedBulkCouponId === null,
    )

    const existingPurchase = bulkPurchases[0] || individualPurchase

    productId = existingPurchase.productId
  }

  if (!productId) {
    return {
      redirect: {
        destination: `/products`,
        permanent: false,
      },
    }
  }

  const product = await getProduct({where: {id: productId}})

  // Load product `description` from Sanity
  const productQuery = groq`*[_type == "product" && productId == $productId][0]{
      description,
      title,
      image {
        url
      },
      features[]{
        value
      },
      modules[]->{
        title,
        "slug": slug.current,
        "image": image.asset->{url},
        moduleType,
        state,
        "sections": resources[@->._type == 'section']->{
          _id,
          "lessons": resources[@->._type in ['exercise', 'explainer']]->{_id}
        }
      }
    }`

  const sanityProduct = await sanityClient.fetch(productQuery, {
    productId: productId,
  })

  if (token?.sub && Boolean(product)) {
    const productData = productDataSchema.parse({...product, ...sanityProduct})

    return {
      props: {
        product: productData,
        userId: token.sub,
      },
    }
  } else {
    return {
      redirect: {
        destination: `/products`,
        permanent: false,
      },
    }
  }
}

type BuyMoreSeatsPageProps = {
  product: z.infer<typeof productDataSchema>
  userId: string
}

const BuyMoreSeatsPage: React.FC<
  React.PropsWithChildren<BuyMoreSeatsPageProps>
> = ({product, userId}) => {
  const {description, title, id, image, features, modules} = product

  return (
    <Layout
      meta={{
        title: `Buy more seats`,
      }}
    >
      <div
        id="buy-more-seats"
        className="flex h-full w-full flex-grow flex-col items-center justify-center px-5 py-16 sm:py-28"
      >
        <header className="flex max-w-4xl flex-col items-center justify-center ">
          <div className="flex flex-col items-center justify-center gap-5 lg:flex-row">
            <Image
              src={image.url}
              alt=""
              aria-hidden="true"
              width={300}
              height={300}
              className="flex-grow"
            />
            <div className="">
              <h1 className="font-text text-4xl font-semibold">
                <Balancer>
                  Level up your team with Total TypeScript {title}
                </Balancer>
              </h1>
              <Balancer>
                <ReactMarkdown className="pt-5 text-lg text-gray-300">
                  {description}
                </ReactMarkdown>
              </Balancer>
            </div>
          </div>
        </header>
        <main className="flex w-full max-w-3xl flex-col items-center">
          <span className="pb-3 pt-10 text-center text-base font-medium uppercase text-cyan-300">
            <Balancer>
              Includes access to {modules.length} professional self-paced
              workshops
            </Balancer>
          </span>
          <ul className="auto-cols-fr grid-flow-col gap-3 sm:grid sm:pt-5">
            {modules.map((module) => {
              const {sections, slug, moduleType} = module
              return (
                <li
                  key={slug}
                  className="flex w-full flex-col items-center rounded-md p-5 text-center"
                >
                  <Image
                    src={module.image.url}
                    alt=""
                    aria-hidden="true"
                    width={150}
                    height={150}
                  />
                  <Link
                    target="_blank"
                    href={`/${pluralize(moduleType)}/${slug}`}
                    className="pt-2 text-xl font-semibold hover:underline"
                  >
                    {module.title}
                  </Link>
                  <span className="pt-1 text-gray-300">
                    {sections.length} sections,{' '}
                    {sections.reduce(
                      (acc: number, section: {lessons?: any[]}) =>
                        section.lessons?.length
                          ? section.lessons?.length + acc
                          : acc,
                      0,
                    )}{' '}
                    exercises
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="mx-auto w-full max-w-xl pt-5">
            <Card
              title={{content: 'Get more seats', as: 'h2'}}
              icon={
                <TicketIcon className="w-5 text-cyan-500" aria-hidden="true" />
              }
            >
              <BuyMoreSeats productId={id} userId={userId} />
            </Card>
          </div>

          <ul className="flex flex-col gap-1 pt-16">
            <span className="text-lg font-semibold">Features</span>
            {features.map(({value}) => {
              return (
                <li
                  className="text-lg before:pr-2 before:text-cyan-300 before:content-['✓']"
                  key={value}
                >
                  {value}
                </li>
              )
            })}
          </ul>
          <Image
            src="https://res.cloudinary.com/total-typescript/image/upload/v1669928567/money-back-guarantee-badge-16137430586cd8f5ec2a096bb1b1e4cf_o5teov.svg"
            width={130}
            height={130}
            className="mt-16"
            alt="Money Back Guarantee"
          />
        </main>
      </div>
    </Layout>
  )
}

export default BuyMoreSeatsPage
