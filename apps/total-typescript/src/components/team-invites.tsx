import * as React from 'react'
import {format, parseISO} from 'date-fns'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import useClipboard from 'react-use-clipboard'
import Tippy from '@tippyjs/react'

const InviteTeam = ({teamPurchase}: any) => {
  const [isCopied, setIsCopied] = React.useState(false)
  const [state, copyToClipboard] = useClipboard(teamPurchase?.bulk_coupon_url)

  if (isEmpty(teamPurchase.bulk_coupon_url)) {
    return null
  }

  return (
    <>
      <p className="mt-0 text-sm">
        Purchased on{' '}
        {format(parseISO(get(teamPurchase, 'created_at')), 'yyyy/MM/dd')}.
      </p>
      <p className="mb-4 mt-4">
        Your team has {teamPurchase.licenses_left} licenses left to claim.{' '}
        {teamPurchase.licenses_left > 0 &&
          'Send a link to your team member so that they can join your team on PureReact.com'}
      </p>

      <div className="flex w-full">
        <a
          href={teamPurchase.bulk_coupon_url}
          target="_blank"
          aria-label={teamPurchase.bulk_coupon_url}
          className="text-xxs text-text flex w-full items-center justify-start overflow-hidden rounded-l-lg border border-gray-200 bg-transparent p-3 font-mono leading-none transition-all duration-200 ease-in-out hover:bg-gray-100 hover:bg-opacity-25 dark:border-gray-700 dark:hover:bg-opacity-10"
          rel="noreferrer"
        >
          <span className="whitespace-no-wrap flex items-center text-sm">
            {teamPurchase.bulk_coupon_url}
          </span>
        </a>
        <Tippy
          animation={false}
          hideOnClick={false}
          content={
            <span className="text-text bg-background rounded-md border border-gray-100 p-2 text-xs sm:text-opacity-75 ">
              {isCopied ? 'Copied!' : 'Copy invite url'}
            </span>
          }
        >
          <button
            onClick={(e) => {
              e.preventDefault()
              copyToClipboard()
              setIsCopied(true)
              setTimeout(() => setIsCopied(false), 1000)
            }}
            aria-label="Copy to clipboard"
            className="hover:text-text -ml-px flex items-center justify-center rounded-r-lg border border-gray-200 bg-transparent p-3 leading-none text-gray-600 transition-colors duration-200 ease-in-out hover:bg-gray-100 hover:bg-opacity-25 dark:border-gray-700 dark:text-gray-200"
            type="button"
          >
            {isCopied ? (
              // prettier-ignore
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
            ) : (
              // prettier-ignore
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0l3-3m-3 3l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
            )}
          </button>
        </Tippy>
      </div>
    </>
  )
}

const TeamInvites = ({teamPurchases}: any) => {
  return (
    <>
      {!isEmpty(teamPurchases) && (
        <div className="mb-5 rounded-md bg-gray-50 p-5 dark:bg-gray-900 print:hidden">
          <h1 className="px-2 text-2xl font-bold leading-tight sm:mb-0">
            Invite your team
          </h1>
          <div className="p-2">
            {teamPurchases.map((teamPurchase: any) => {
              return (
                <div>
                  <InviteTeam
                    key={teamPurchase.id}
                    teamPurchase={teamPurchase}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default TeamInvites
