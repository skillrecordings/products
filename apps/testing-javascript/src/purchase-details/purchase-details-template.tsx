import * as React from 'react'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import type {LessonProgress} from '@skillrecordings/database'
import type {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {find, isArray, isEmpty} from 'lodash'
import {format} from 'date-fns'
import {trpc} from '@/trpc/trpc.client'
import BuyMoreSeats from '@skillrecordings/skill-lesson/team/buy-more-seats'
import Balancer from 'react-wrap-balancer'
import Layout from '@/components/layout'
import Link from 'next/link'
import Image from 'next/image'
import InviteTeam from '@skillrecordings/skill-lesson/team'
import {useSession} from 'next-auth/react'
import {Icon, type IconNames} from '@skillrecordings/skill-lesson/icons'
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
    <Layout meta={{title: `Purchase details for ${product.name}`}}>
      {welcome ? <WelcomeHeader /> : null}
      <div className="mx-auto w-full max-w-3xl py-16" id="purchase-detail">
        <main className="flex flex-col items-start gap-4 bg-gray-50 md:flex-row py-6">
          <Image
            src={sanityProduct.image.url}
            alt=""
            aria-hidden="true"
            width={200}
            height={200}
            className="flex-shrink-0"
          />
          <div className="w-full px-6">
            <p className="pb-3 font-heading font-extrabold uppercase text-sky-500">
              Your purchase details for
            </p>
            <h1 className="font-heading text-4xl font-black">
              <Balancer>{product.name}</Balancer>
            </h1>
            <div className="flex flex-col items-center justify-center divide-y divide-slate-200 pt-10">
              <Row label="Invoice" icon="Receipt">
                <InvoiceLink merchantChargeId={purchase.merchantChargeId} />
              </Row>
              {canInviteTeam && purchase?.bulkCoupon && (
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
              {/* {(purchase.status === 'Valid' ||
                (purchase.status === 'Restricted' && personalPurchase) ||
                canViewContent) && (
                <Row label="Progress" icon="PlayOutline">
                  <Progress sanityProduct={sanityProduct} />
                </Row>
              )} */}
              {!purchase.bulkCoupon && <PurchaseTransfer purchase={purchase} />}
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
      <div className="flex items-center gap-2">
        {icon && <Icon className="text-gray-600" name={icon} />} {label}
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
      <div className="flex flex-shrink-0 items-center gap-2">
        <Icon className="text-gray-600" name="MoveDown" /> Transfer this
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
    <header className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#31AEF6] pb-32 text-center text-white sm:pb-10">
      {/* <Image
        src={require('../../public/assets/corgi-waving-upside-down.svg')}
        alt=""
        aria-hidden="true"
        className="relative z-0"
      /> */}
      <div className="absolute z-10 w-full px-5 pt-40">
        <h2 className="font-heading text-3xl font-black sm:text-4xl md:text-5xl">
          <Balancer>Welcome to Testing Javascript!</Balancer>
        </h2>
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
        Get your team to level up with Testing Javascript Pro
      </p>
      <Dialog.Root>
        <Dialog.Trigger className="group flex shrink-0 items-center gap-1 rounded-md px-5 py-2 text-lg font-semibold text-white transition hover:bg-indigo-700 ml-3 bg-indigo-600">
          Buy more seats
        </Dialog.Trigger>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-40 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-6 py-8 shadow-2xl shadow-gray-500/10">
          <Dialog.Title className="pb-5 text-center font-heading text-2xl font-black leading-tight">
            <Balancer>Buy more seats for {productName}</Balancer>
          </Dialog.Title>
          <BuyMoreSeats productId={productId} userId={userId} />
          <Dialog.Close className="absolute right-2 top-2 rounded-full p-2 hover:bg-gray-100">
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
        <Icon name="Team" className="text-gray-600" /> Your Team
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
  const tweet = `https://twitter.com/intent/tweet/?text=Testing Javascript by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER} 🧙 https%3A%2F%2Fwww.testingjavascript.com%2F`
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

// const Progress: React.FC<{
//   sanityProduct: {
//     slug: string
//     lessons: {_id: string; slug: string}[]
//     sections: Section[]
//   }
// }> = ({sanityProduct}) => {
//   const {lessons} = sanityProduct
//   const {data: userProgress} = trpc.progress.get.useQuery()
//   const completedLessons = getCompletedLessons({userProgress, lessons})
//   return (
//     <div className="flex items-center gap-2">
//       {completedLessons?.length}/{lessons.length} lessons completed
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
