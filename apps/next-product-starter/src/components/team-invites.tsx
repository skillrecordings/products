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
          className="font-mono overflow-hidden text-xxs rounded-l-lg bg-transparent hover:bg-gray-100 hover:bg-opacity-25 dark:hover:bg-opacity-10 border border-gray-200 dark:border-gray-700 text-text flex items-center justify-start p-3 transition-all ease-in-out duration-200 leading-none w-full"
        >
          <span className="whitespace-no-wrap flex items-center text-sm">
            {teamPurchase.bulk_coupon_url}
          </span>
        </a>
        <Tippy
          animation={false}
          hideOnClick={false}
          content={
            <span className="text-text sm:text-opacity-75 text-xs p-2 rounded-md bg-background border border-gray-100 ">
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
            className="rounded-r-lg -ml-px bg-transparent hover:bg-gray-100 hover:bg-opacity-25 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-200 hover:text-text flex items-center justify-center p-3 transition-colors ease-in-out duration-200 leading-none"
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
        <div className="mb-5 p-5 bg-gray-50 dark:bg-coolGray-900 rounded-md print:hidden">
          <h1 className="text-2xl leading-tight sm:mb-0 px-2 font-bold">
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
