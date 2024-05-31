import Link from 'next/link'
import Image from 'next/image'
import {useSession} from 'next-auth/react'
import {cn} from '@skillrecordings/ui/utils/cn'

import {isOnlyTeamPurchaser} from '@/utils/is-only-team-purchaser'
import {isEmpty} from 'lodash'

const Footer = () => {
  const {data: sessionData, status: sessionStatus} = useSession()
  const purchasedOnlyTeam = isOnlyTeamPurchaser(sessionData?.user)
  const hasAccessToLearn = !isEmpty(sessionData?.user?.purchases)
  return (
    <footer
      className={cn(
        'mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between px-10 sm:flex-row sm:items-center',
        hasAccessToLearn
          ? 'border-t border-er-gray-200 pb-10 pt-32 sm:pb-48'
          : 'pb-10 pt-0 sm:pb-16',
      )}
    >
      <nav className="flex flex-col items-start text-lg leading-relaxed">
        <Link
          href="/credits"
          className="flex items-center rounded-lg px-3 py-2 text-er-gray-700 transition-colors duration-150 ease-in-out hover:bg-er-gray-100 hover:text-text"
        >
          <svg
            className="mr-1 w-6 text-er-primary"
            width="21"
            height="21"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
              clipRule="evenodd"
            />
          </svg>
          Meet the Epic React team
        </Link>
        <Link
          href="/terms"
          className="flex items-center rounded-lg px-3 py-2 text-er-gray-700 transition-colors duration-150 ease-in-out hover:bg-er-gray-100 hover:text-text"
        >
          Terms & Conditions
        </Link>
        {hasAccessToLearn && !purchasedOnlyTeam && (
          <Link
            href="/discord"
            className="flex items-center rounded-lg px-3 py-2 text-er-gray-700 transition-colors duration-150 ease-in-out hover:bg-er-gray-100 hover:text-text"
          >
            <svg
              className="mr-1 w-6 text-er-primary"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 20 21"
            >
              <path
                fill="currentColor"
                d="M12,15 L8.85,11.7391304 L9.228,13.0434783 L1.5,13.0434783 C0.672,13.0434783 0,12.3130435 0,11.4130435 L0,1.63043478 C0,0.730434783 0.672,0 1.5,0 L10.5,0 C11.328,0 12,0.730434783 12,1.63043478 L12,15 M6,3.7826087 C4.392,3.7826087 3.264,4.5326087 3.264,4.5326087 C3.882,3.9326087 4.962,3.58695652 4.962,3.58695652 L4.86,3.47608696 C3.846,3.49565217 2.928,4.25869565 2.928,4.25869565 C1.896,6.6 1.962,8.62173913 1.962,8.62173913 C2.802,9.80217391 4.05,9.7173913 4.05,9.7173913 L4.476,9.13043478 C3.726,8.95434783 3.252,8.23043478 3.252,8.23043478 C3.252,8.23043478 4.38,9.06521739 6,9.06521739 C7.62,9.06521739 8.748,8.23043478 8.748,8.23043478 C8.748,8.23043478 8.274,8.95434783 7.524,9.13043478 L7.95,9.7173913 C7.95,9.7173913 9.198,9.80217391 10.038,8.62173913 C10.038,8.62173913 10.104,6.6 9.072,4.25869565 C9.072,4.25869565 8.154,3.49565217 7.14,3.47608696 L7.038,3.58695652 C7.038,3.58695652 8.118,3.9326087 8.736,4.5326087 C8.736,4.5326087 7.608,3.7826087 6,3.7826087 M4.758,6.25434783 C5.148,6.25434783 5.466,6.62608696 5.46,7.0826087 C5.46,7.5326087 5.148,7.91086957 4.758,7.91086957 C4.374,7.91086957 4.062,7.5326087 4.062,7.0826087 C4.062,6.62608696 4.368,6.25434783 4.758,6.25434783 M7.26,6.25434783 C7.65,6.25434783 7.962,6.62608696 7.962,7.0826087 C7.962,7.5326087 7.65,7.91086957 7.26,7.91086957 C6.876,7.91086957 6.564,7.5326087 6.564,7.0826087 C6.564,6.62608696 6.87,6.25434783 7.26,6.25434783 Z"
                transform="translate(4 3)"
              />
            </svg>
            Join Epic Web Discord
          </Link>
        )}
        {(hasAccessToLearn || purchasedOnlyTeam) && (
          <Link
            href="/invoices"
            className="flex items-center rounded-lg px-3 py-2 text-er-gray-700 transition-colors duration-150 ease-in-out hover:bg-er-gray-100 hover:text-text"
          >
            <svg
              className="mr-1 w-6 text-er-primary"
              width="21"
              height="21"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.414A2 2 0 0 0 15.414 6L12 2.586A2 2 0 0 0 10.586 2H6zm5 6a1 1 0 1 0-2 0v3.586l-1.293-1.293a1 1 0 1 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L11 11.586V8z"
                  fill="currentColor"
                />
              </g>
            </svg>
            {purchasedOnlyTeam
              ? 'Invite Your Team & Download Invoice'
              : 'Get Your Invoice'}
          </Link>
        )}
      </nav>

      <div className="mx-auto mt-24 w-14 sm:mx-0 sm:mt-0">
        <Link href={hasAccessToLearn ? '/learn' : '/'}>
          <Image
            src="/assets/rocket@2x.png"
            alt="a rocket"
            width={126}
            height={220}
          />
        </Link>
      </div>
    </footer>
  )
}

export default Footer
