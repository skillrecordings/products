import {trpc} from '@/trpc/trpc.client'
import Countdown, {type CountdownRenderProps} from 'react-countdown'
import {cn} from '@skillrecordings/ui/utils/cn'
import Link from 'next/link'

const SaleMessageBar: React.FC<{className?: string}> = ({className}) => {
  const {data: defaultCouponData, status: defaultCouponStatus} =
    trpc.pricing.defaultCoupon.useQuery()

  const coupon = defaultCouponData

  return coupon ? (
    <div className={cn(className)}>
      <div className="text-sm font-medium sm:text-xs lg:text-sm ">
        <span className="font-semibold">
          <span aria-hidden>❤️‍🔥</span> Save{' '}
          {Number(coupon.percentageDiscount) * 100}%
        </span>{' '}
        on{' '}
        <span className="">
          {coupon?.product?.name
            ? `${process.env.NEXT_PUBLIC_SITE_TITLE} ${coupon.product.name}`
            : process.env.NEXT_PUBLIC_SITE_TITLE}
        </span>{' '}
        for limited time only!{' '}
        <Countdown
          date={coupon.expires?.toUTCString()}
          renderer={countdownRenderer}
        />
      </div>

      <div className="flex-shrink-0">
        <Link
          href="/buy"
          className="flex items-center justify-center rounded bg-white px-2 py-0.5 text-sm font-semibold text-black shadow-md transition hover:scale-105"
        >
          Buy Now
        </Link>
      </div>
    </div>
  ) : null
}

export default SaleMessageBar

const countdownRenderer = (props: CountdownRenderProps) => {
  return (
    <span className="font-semibold tabular-nums">
      Sale ends in: {props.days}d {props.hours}h {props.minutes}m{' '}
      {props.seconds}s
    </span>
  )
}
