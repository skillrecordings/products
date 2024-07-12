import * as React from 'react'
import {useLocalStorage} from 'react-use'
import Link from 'next/link'
import Image from 'next/image'
// import {useEggheadUser} from '../hooks/useEggheadUser'
import {isEmpty} from 'lodash'

const WelcomeBanner: React.FC<{purchases: any}> = ({purchases}) => {
  console.log('purchases', purchases)
  const [isOn, setOn] = useLocalStorage('welcome-banner', true)
  const hasTeamPurchase = !isEmpty(purchases[0]?.bulkCoupon)
  if (!isOn) return null

  return (
    <div className="relative z-10 mx-auto max-w-screen-md px-5 pb-5 sm:pb-8 lg:px-16">
      <div className="rounded-lg bg-indigo-600 text-white">
        <div className="relative mx-auto items-start p-8">
          <div className="flex flex-col items-start text-base md:col-span-4">
            <h4 className="my-2 text-2xl font-semibold leading-tight">
              {`Welcome! Thank you so much for purchasing Epic React${
                hasTeamPurchase ? ' for your team.' : '.'
              } I know you'll love it.`}
            </h4>
            <p>
              {'You can '}
              <Link href="/invoices" className="underline">
                download your invoice here
              </Link>
              .
            </p>
            <div className="flex w-full flex-wrap items-center justify-between">
              <div className="my-5 grid w-full grid-flow-row gap-3 sm:w-auto sm:grid-flow-col-dense">
                <div className="rounded-md shadow-sm">
                  <Link
                    href={`/invoices/${
                      purchases?.sort(
                        (a: any, b: any) => b.createdAt - a.createdAt,
                      )[0]?.merchantChargeId
                    }`}
                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-800 px-4 py-2 text-base font-semibold leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-900 focus:shadow-outline focus:outline-none"
                  >
                    {hasTeamPurchase ? 'Invite Your Team' : 'View Invoice'}
                  </Link>
                </div>
                <div className="rounded-md shadow-sm">
                  <Link
                    href={'/discord'}
                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-800 px-4 py-2 text-base font-semibold leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-900 focus:shadow-outline focus:outline-none"
                  >
                    ⭐️ Join Epic Web Discord
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <p className="mr-4 text-base italic text-indigo-200">
                  Thanks, Kent
                </p>
                <div className="w-[90px]">
                  <Image
                    src="/assets/signature.png"
                    width={208}
                    height={110}
                    alt="Kent's fake signature"
                  />
                </div>
              </div>
            </div>
          </div>
          {!hasTeamPurchase && (
            <div className="absolute right-4 top-4">
              <button
                onClick={() => setOn(false)}
                type="button"
                className="flex rounded-md p-2 transition duration-150 ease-in-out hover:bg-indigo-500 focus:bg-indigo-500 focus:outline-none"
                aria-label="Dismiss"
              >
                {/* prettier-ignore */}
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WelcomeBanner
