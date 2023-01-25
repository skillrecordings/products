import React from 'react'
import {GetServerSideProps} from 'next'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {getActiveProduct} from 'path-to-purchase-react/products.server'
import {getSdk, LessonProgress} from '@skillrecordings/database'
import {getToken} from 'next-auth/jwt'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {find, first, get, indexOf, isEmpty, isString} from 'lodash'
import {format} from 'date-fns'
import {trpc} from 'utils/trpc'
import BuyMoreSeats from 'team/buy-more-seats'
import Balancer from 'react-wrap-balancer'
import Layout from 'components/layout'
import Link from 'next/link'
import Image from 'next/image'
import InviteTeam from 'team'
import {useSession} from 'next-auth/react'
import Icon, {type IconNames} from 'components/icons'
import * as Dialog from '@radix-ui/react-dialog'
import {XIcon} from '@heroicons/react/solid'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  query,
}) => {
  const sessionToken = await getToken({req})
  const {purchaseId, welcome} = query

  const {getProduct, getPurchase, getUserById, getPurchaseDetails} = getSdk()

  if (purchaseId && sessionToken && isString(sessionToken?.sub)) {
    const purchase = await getPurchase({
      where: {
        id: purchaseId as string,
      },
      select: {
        productId: true,
        totalAmount: true,
        createdAt: true,
        merchantChargeId: true,
        userId: true,
        product: true,
        bulkCoupon: true,
      },
    })
    if (purchase) {
      const product = await getProduct({
        where: {id: purchase?.productId},
        select: {
          id: true,
          name: true,
        },
      })

      const user = await getUserById({
        where: {id: purchase.userId as string},
        select: {
          email: true,
        },
      })

      const {existingPurchase} = await getPurchaseDetails(
        purchase.id,
        sessionToken.sub,
      )

      const sanityProduct = await getActiveProduct(purchase?.productId)

      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      return {
        props: {
          purchase: convertToSerializeForNextResponse(purchase),
          product: convertToSerializeForNextResponse(product),
          existingPurchase,
          user,
          sanityProduct,
          welcome: Boolean(isString(welcome)),
        },
      }
    }
  }

  return {
    redirect: {
      destination: '/purchases',
      permanent: false,
    },
  }
}

type PurchaseDetailProps = {
  welcome: boolean
  product: {
    slug: string
    lessons: {_id: string; slug: string}[]
    sections: Section[]
    name: string
  }
  user: {
    email: string
  }
  purchase: {
    merchantChargeId: string | null
    bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
    product: {id: string; name: string}
    productId: string
    userId: string
    createdAt: string
    totalAmount: number
  }
  sanityProduct: {
    image: {
      url: string
    }
    slug: string
    lessons: {_id: string; slug: string}[]
    sections: Section[]
  }
  existingPurchase: {id: string; product: {id: string; name: string}}
}

const PurchaseDetail: React.FC<PurchaseDetailProps> = ({
  welcome,
  product,
  user,
  purchase,
  sanityProduct,
  existingPurchase,
}) => {
  const ability = useAbilities()
  const canInviteTeam = ability.can('invite', 'Team')
  const canViewContent = ability.can('view', 'Content')
  const [personalPurchase, setPersonalPurchase] = React.useState(
    purchase.bulkCoupon ? existingPurchase : purchase,
  )

  return (
    <Layout meta={{title: `Purchase details for ${product.name}`}}>
      {welcome ? <WelcomeHeader /> : null}
      <div className="mx-auto w-full max-w-3xl py-16">
        <main className="flex flex-col items-start gap-10 bg-gray-50 md:flex-row">
          <Image
            src={sanityProduct.image.url}
            alt=""
            aria-hidden="true"
            width={200}
            height={200}
            className="flex-shrink-0"
          />
          <div className="w-full">
            <p className="pb-3 font-heading font-extrabold uppercase text-sky-500">
              Your purchase details for
            </p>
            <h1 className="font-heading text-4xl font-black">
              <Balancer>{product.name}</Balancer>
            </h1>
            <div className="-mx-3 flex flex-col items-center justify-center divide-y divide-slate-200 pt-10">
              <Row label="Invoice" icon="Receipt">
                <InvoiceLink merchantChargeId={purchase.merchantChargeId} />
              </Row>
              {canInviteTeam && (
                <ManageTeam
                  purchase={purchase}
                  email={user.email}
                  existingPurchase={existingPurchase}
                  setPersonalPurchase={setPersonalPurchase}
                />
              )}
              <Row label="Amount paid" icon="Dollar">
                <Price amount={purchase.totalAmount} />
              </Row>
              <Row label="Purchased on" icon="Calendar">
                <DatePurchased date={purchase.createdAt} />
              </Row>
              {user && (
                <Row label="Associated email address" icon="Email">
                  {user.email}
                </Row>
              )}
              {(personalPurchase || canViewContent) && (
                <Row label="Progress" icon="PlayOutline">
                  <Progress sanityProduct={sanityProduct} />
                </Row>
              )}
            </div>
          </div>
        </main>
      </div>
      <footer className="flex w-full flex-grow items-center justify-center gap-16 bg-slate-100 py-16">
        {welcome && <Share />}
        <BuySeats
          productName={product.name}
          productId={purchase.productId}
          userId={purchase.userId}
        />
      </footer>
    </Layout>
  )
}

export default PurchaseDetail

const useAbilities = () => {
  const {data: abilityRules} = trpc.abilities.getAbilities.useQuery()

  return createAppAbility(abilityRules || [])
}

const Row: React.FC<
  React.PropsWithChildren<{label: string; icon: IconNames}>
> = ({children, label = 'Label', icon = null}) => {
  return children ? (
    <div className="flex w-full items-start justify-between py-4 px-3">
      <div className="flex items-center gap-2">
        {icon && <Icon className="text-gray-600" name={icon} />} {label}
      </div>
      <div className="w-2/5 text-left font-medium">{children}</div>
    </div>
  ) : null
}

const WelcomeHeader = () => {
  return (
    <header className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#31AEF6] pb-32 text-center text-white sm:pb-10">
      <Image
        src={require('../../../public/assets/corgi-waving-upside-down.svg')}
        alt=""
        aria-hidden="true"
        className="relative z-0"
      />
      <div className="absolute z-10 w-full px-5 pt-40">
        <h1 className="font-heading text-3xl font-black sm:text-4xl md:text-5xl">
          <Balancer>Welcome to Pro Tailwind!</Balancer>
        </h1>
        <p className="pt-3 sm:text-lg">
          <Balancer>
            You can find details about your purchase below. Happy learning!
          </Balancer>
        </p>
      </div>
    </header>
  )
}

const BuySeats: React.FC<{
  productId: string
  userId: string
  productName: string
}> = ({productId, productName, userId}) => {
  return (
    <div
      id="buy-more-seats-modal"
      className="flex max-w-xs flex-col items-center text-center"
    >
      <p className="pb-5">
        Get your team to level up with Tailwind Multi-Theme Strategy Workshop
      </p>
      <Dialog.Root>
        <Dialog.Trigger className="group flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 font-heading font-semibold text-white transition hover:bg-sky-600">
          Buy more seats
        </Dialog.Trigger>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-40 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-6 py-8 shadow-2xl shadow-gray-500/10">
          <Dialog.Title className="pb-5 text-center font-heading text-2xl font-black leading-tight">
            <Balancer>Buy more seats for {productName}</Balancer>
          </Dialog.Title>
          <BuyMoreSeats productId={productId} userId={userId} />
          <Dialog.Close className="absolute top-2 right-2 rounded-full p-2 hover:bg-gray-100">
            <XIcon className="h-5 w-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}

const ManageTeam: React.FC<{
  purchase: {
    merchantChargeId: string | null
    bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
    product: {id: string; name: string}
  }
  email: string
  existingPurchase: {
    id: string
    product: {id: string; name: string}
  }
  setPersonalPurchase: React.Dispatch<any>
}> = ({purchase, existingPurchase, setPersonalPurchase}) => {
  const {data: session, status} = useSession()

  return (
    <div className="flex w-full flex-col items-baseline justify-between border-b border-gray-200 py-4 px-3">
      <div className="flex items-center gap-2">
        <Icon name="Team" className="text-gray-600" /> Your Team
      </div>
      <InviteTeam
        setPersonalPurchase={setPersonalPurchase}
        session={session}
        purchase={purchase}
        existingPurchase={existingPurchase}
        className="flex w-full flex-col py-3"
      />
    </div>
  )
}

const InvoiceLink: React.FC<{merchantChargeId: string | null}> = ({
  merchantChargeId,
}) => {
  const ability = useAbilities()
  const canViewInvoice = ability.can('view', 'Invoice')
  return canViewInvoice ? (
    <Link
      className="text-sky-500 underline"
      href={{
        pathname: '/invoices/[merchantChargeId]',
        query: {
          merchantChargeId,
        },
      }}
    >
      View invoice
    </Link>
  ) : null
}

export const Price: React.FC<{amount: number}> = ({amount}) => {
  const {dollars, cents} = formatUsd(amount)
  return (
    <div>
      <span className="pr-1">USD</span>
      <span>{dollars}</span>
      <sup>{cents}</sup>
    </div>
  )
}

export const DatePurchased: React.FC<{date: string}> = ({date}) => {
  return <>{format(new Date(date), 'MMMM dd, y')}</>
}

const StartLearning: React.FC<{
  product: {
    slug: string
    lessons: {_id: string; slug: string}[]
    sections: Section[]
  }
}> = ({product}) => {
  const {lessons, sections} = product
  const {data: userProgress} = trpc.progress.get.useQuery()
  const completedLessons = getCompletedLessons({userProgress, lessons})
  const nextLesson = completedLessons
    ? lessons[
        indexOf(
          lessons,
          find(lessons, {_id: get(first(completedLessons), 'lessonId')}),
        ) + 1
      ]
    : first(lessons)

  return (
    <>
      <Link
        href={{
          pathname: '/workshops/[module]/[section]/[lesson]',
          query: {
            module: product.slug,
            section: first(sections)?.slug,
            lesson: nextLesson?.slug,
          },
        }}
        className="inline-flex rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white"
      >
        {isEmpty(completedLessons) ? 'Start Learning' : 'Continue Learning'}
      </Link>
    </>
  )
}

const getCompletedLessons = ({
  userProgress,
  lessons,
}: {
  userProgress: LessonProgress[] | undefined
  lessons: {_id: string}[]
}) => {
  return userProgress?.filter(
    (completedLesson) =>
      !isEmpty(find(lessons, {_id: completedLesson.lessonId})) &&
      completedLesson.completedAt,
  )
}

const Share = () => {
  const tweet = `https://twitter.com/intent/tweet/?text=Pro Tailwind by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER} 🧙 https%3A%2F%2Fwww.protailwind.com%2F`
  return (
    <div className="flex flex-col items-center justify-center gap-5 text-center">
      <p>
        Tell your friends about {process.env.NEXT_PUBLIC_SITE_TITLE},{' '}
        <br className="hidden sm:block" />
        it would help me to get a word out.{' '}
        <span role="img" aria-label="smiling face">
          😊
        </span>
      </p>
      <a
        href={tweet}
        rel="noopener noreferrer"
        target="_blank"
        className="group flex items-center gap-2 rounded-full border border-sky-500 px-5 py-2.5 font-heading font-semibold text-sky-500 transition hover:bg-sky-500 hover:text-white"
      >
        <Icon name="Twitter" className="fill-sky-500 group-hover:fill-white" />{' '}
        Share with your friends!
      </a>
    </div>
  )
}

const Progress: React.FC<{
  sanityProduct: {
    slug: string
    lessons: {_id: string; slug: string}[]
    sections: Section[]
  }
}> = ({sanityProduct}) => {
  const {lessons} = sanityProduct
  const {data: userProgress} = trpc.progress.get.useQuery()
  const completedLessons = getCompletedLessons({userProgress, lessons})
  return (
    <div className="flex flex-col items-start gap-1">
      {completedLessons?.length}/{lessons.length} lessons completed
      <StartLearning product={sanityProduct} />
    </div>
  )
}

const formatUsd = (amount: number = 0) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const formattedPrice = formatter.format(amount).split('.')

  return {dollars: formattedPrice[0], cents: formattedPrice[1]}
}
