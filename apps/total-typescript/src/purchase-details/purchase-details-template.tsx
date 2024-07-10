import React from 'react'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {LessonProgress} from '@skillrecordings/database'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {find, isArray, isEmpty} from 'lodash'
import {format} from 'date-fns'
import {trpc} from '@/trpc/trpc.client'
import BuyMoreSeats from '@skillrecordings/skill-lesson/team/buy-more-seats'
import Balancer from 'react-wrap-balancer'
import Layout from '@/components/app/layout'
import Link from 'next/link'
import Image from 'next/image'
import InviteTeam from '@skillrecordings/skill-lesson/team'
import {useSession} from 'next-auth/react'
import {Icon, IconNames} from '@skillrecordings/skill-lesson/icons'
import * as Dialog from '@radix-ui/react-dialog'
import {XIcon} from '@heroicons/react/solid'
import {Transfer} from '@/purchase-transfer/purchase-transfer'

export type PurchaseDetailsProps = {
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
    id: string
    status: 'Valid' | 'Refunded' | 'Disputed' | 'Pending' | 'Restricted'
    merchantChargeId: string | null
    bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
    product: {id: string; name: string; status: number}
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

const PurchaseDetailsTemplate: React.FC<PurchaseDetailsProps> = ({
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
    <Layout
      meta={{title: `Purchase details for ${product.name}`}}
      className="bg-black/20"
    >
      {welcome ? <WelcomeHeader /> : null}
      <div className="bg-gray-900">
        <div
          className="mx-auto w-full max-w-3xl px-5 pb-24 pt-24 sm:pt-40"
          id="purchase-detail"
        >
          <main className="flex flex-col items-center gap-10 sm:items-start md:flex-row">
            <Image
              src={sanityProduct.image.url}
              alt=""
              aria-hidden="true"
              width={240}
              height={240}
              className="flex-shrink-0"
            />
            <div className="w-full">
              <p className="pb-3 font-medium uppercase tracking-wide text-cyan-300">
                Your purchase details for
              </p>
              <h1 className="font-heading text-5xl font-extrabold">
                <Balancer>
                  {purchase.status === 'Restricted'
                    ? `${product.name} (PPP)`
                    : product.name}
                </Balancer>
              </h1>
              <div className="-mx-3 flex flex-col items-center justify-center divide-y divide-gray-800 pt-10">
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
                  <Price amount={purchase.totalAmount} />{' '}
                  {purchase.status === 'Refunded' && '(Refunded)'}
                </Row>
                <Row label="Purchased on" icon="Calendar">
                  <DatePurchased date={purchase.createdAt} />
                </Row>
                {user && (
                  <Row label="Associated email address" icon="Email">
                    {user.email}
                  </Row>
                )}
                {/* {((purchase.status === 'Valid' && personalPurchase) ||
                canViewContent) && (
                <Row label="Progress" icon="PlayOutline">
                  <Progress sanityProduct={sanityProduct} />
                </Row>
              )} */}
                {!purchase.bulkCoupon && (
                  <PurchaseTransfer purchase={purchase} />
                )}
              </div>
            </div>
          </main>
        </div>
        <footer className="flex w-full flex-col items-center justify-center gap-16 border-t border-gray-800/50 bg-black/20 px-5 py-16 sm:flex-row">
          {welcome && <Share />}
          <BuySeats
            productName={product.name}
            productId={purchase.productId}
            userId={purchase.userId}
          />
        </footer>
      </div>
    </Layout>
  )
}

export default PurchaseDetailsTemplate

const useAbilities = () => {
  const {data: abilityRules} = trpc.abilities.getAbilities.useQuery()

  return createAppAbility(abilityRules || [])
}

const Row: React.FC<
  React.PropsWithChildren<{label: string; icon: IconNames}>
> = ({children, label = 'Label', icon = null}) => {
  return children ? (
    <div className="flex w-full items-start justify-between px-3 py-4">
      <div className="flex items-center gap-2 text-gray-200">
        {icon && <Icon className="text-gray-500" name={icon} />} {label}
      </div>
      <div className="w-2/4 text-left font-medium">{children}</div>
    </div>
  ) : null
}

const PurchaseTransfer: React.FC<{purchase: {id: string}}> = ({purchase}) => {
  const {data: purchaseUserTransfers, refetch} =
    trpc.purchaseUserTransfer.forPurchaseId.useQuery({
      id: purchase.id,
    })

  return !isEmpty(purchaseUserTransfers) ? (
    <div className="flex w-full flex-col gap-3 px-3 py-4">
      <div className="flex flex-shrink-0 items-center gap-2 text-gray-200">
        <Icon className="text-gray-500" name="MoveDown" /> Transfer this
        purchase to another email address
      </div>
      <div className="w-full text-left font-medium">
        {purchaseUserTransfers && (
          <Transfer
            purchaseUserTransfers={purchaseUserTransfers}
            refetch={refetch}
          />
        )}
      </div>
    </div>
  ) : null
}

const WelcomeHeader = () => {
  return (
    <header className="relative mt-14 flex w-full flex-col items-center justify-center overflow-hidden bg-cyan-200 text-center text-gray-900 sm:mt-16">
      {/* <Image
        src={require('../../public/assets/corgi-waving-upside-down.svg')}
        alt=""
        aria-hidden="true"
        className="relative z-0"
      /> */}
      <div className="z-10 w-full px-5 py-24">
        <h1 className="font-text text-3xl font-extrabold sm:text-4xl md:text-5xl">
          <Balancer>Welcome to Total TypeScript!</Balancer>
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
      <p className="pb-5 text-lg text-gray-300">
        Get your team to level up with Total TypeScript {productName}
      </p>
      <Dialog.Root>
        <Dialog.Trigger className="group flex items-center gap-2 rounded-md bg-cyan-300 px-5 py-2.5 font-semibold text-black transition hover:bg-cyan-400">
          Buy more seats
        </Dialog.Trigger>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-40 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-800 px-6 pb-10 pt-12 shadow-2xl shadow-gray-500/10">
          <Dialog.Title className="pb-5 text-center text-2xl font-semibold leading-tight">
            <Balancer>Buy more seats for {productName}</Balancer>
          </Dialog.Title>
          <BuyMoreSeats productId={productId} userId={userId} />
          <Dialog.Close className="absolute right-2 top-2 rounded-full p-2 hover:bg-gray-700">
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
    product: {id: string; name: string; status: number}
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
    <div className="flex w-full flex-col items-baseline justify-between border-b border-gray-200 px-3 py-4">
      <div className="flex items-center gap-2">
        <Icon name="Team" className="text-gray-500" /> Your Team
      </div>
      <InviteTeam
        setPersonalPurchase={setPersonalPurchase}
        session={session}
        purchase={purchase}
        existingPurchase={existingPurchase}
      />
    </div>
  )
}

export const InvoiceLink: React.FC<{merchantChargeId: string | null}> = ({
  merchantChargeId,
}) => {
  const ability = useAbilities()
  const canViewInvoice = ability.can('view', 'Invoice')
  return canViewInvoice ? (
    <Link
      className="text-cyan-300 underline"
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
      <sup className="!top-0 text-xs">{cents}</sup>
    </div>
  )
}

export const DatePurchased: React.FC<{date: string}> = ({date}) => {
  return <>{format(new Date(date), 'MMMM dd, y')}</>
}

// const StartLearning: React.FC<{
//   product: {
//     slug: string
//     lessons: {_id: string; slug: string}[]
//     sections: Section[]
//   }
// }> = ({product}) => {
//   const {lessons, sections} = product
//   const {data: userProgress} = trpc.progress.get.useQuery()
//   const completedLessons = getCompletedLessons({userProgress, lessons})
//   const nextLesson = completedLessons
//     ? lessons[
//         indexOf(
//           lessons,
//           find(lessons, {_id: get(first(completedLessons), 'lessonId')}),
//         ) + 1
//       ]
//     : first(lessons)

//   return (
//     <>
//       <Link
//         href={{
//           pathname: '/workshops/[module]/[section]/[lesson]',
//           query: {
//             module: product.slug,
//             section: first(sections)?.slug,
//             lesson: nextLesson?.slug,
//           },
//         }}
//         className="inline-flex flex-shrink-0 rounded-full bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white focus-visible:ring-offset-1"
//       >
//         {isEmpty(completedLessons) ? 'Start Learning' : 'Continue Learning'}
//       </Link>
//     </>
//   )
// }

const getCompletedLessons = ({
  userProgress,
  lessons,
}: {
  userProgress: LessonProgress[] | undefined | {error: string}
  lessons: {_id: string}[]
}) => {
  return isArray(userProgress)
    ? userProgress?.filter(
        (completedLesson) =>
          !isEmpty(find(lessons, {_id: completedLesson.lessonId})) &&
          completedLesson.completedAt,
      )
    : []
}

const Share = () => {
  const tweet = `https://twitter.com/intent/tweet/?text=Total TypeScript by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER} 🧙 https%3A%2F%2Fwww.totaltypescript.com%2F`
  return (
    <div className="flex flex-col items-center justify-center gap-5 text-center text-lg text-gray-300">
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
        className="group flex items-center gap-2 rounded-lg border border-cyan-300 px-5 py-2.5 text-base font-medium text-cyan-200 transition hover:bg-cyan-300 hover:text-black"
      >
        <Icon
          name="Twitter"
          className="fill-cyan-300 group-hover:fill-cyan-200"
        />{' '}
        Share with your friends!
      </a>
    </div>
  )
}

// const Progress: React.FC<{
//   sanityProduct: {
//     slug: string
//     lessons: {_id: string; slug: string}[]
//     sections: Section[]
//     modules: Module[]
//   }
// }> = ({sanityProduct}) => {
//   const {modules} = sanityProduct
//   const {data: userProgress} = trpc.progress.get.useQuery()
//   const completedLessons = getCompletedLessons({userProgress, lessons})
//   return (
//     <div className="flex items-center gap-2">
//       {completedLessons?.length}/{lessons?.length} lessons completed
//       <StartLearning product={sanityProduct} />
//     </div>
//   )
// }

const formatUsd = (amount: number = 0) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const formattedPrice = formatter.format(amount).split('.')

  return {dollars: formattedPrice[0], cents: formattedPrice[1]}
}
