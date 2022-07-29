import React from 'react'
import {Button} from '@skillrecordings/react'
import {useCopyToClipboard} from 'react-use'
import toast from 'react-hot-toast'

const CopyInviteLink: React.FC<
  React.PropsWithChildren<{bulkCouponId: string}>
> = ({bulkCouponId}) => {
  const [_, setCopied] = useCopyToClipboard()
  const inviteLink = `${process.env.NEXT_PUBLIC_URL}?code=${bulkCouponId}`

  return (
    <>
      <label className="font-semibold sr-only" htmlFor="inviteLink">
        Invite Share Link
      </label>
      <div className="flex gap-3 pt-2">
        <input
          readOnly
          className="w-full text-sm rounded-md bg-gray-50 text-gray-700 shadow-inner py-2 px-3 border border-gray-300 selection:bg-green-500 selection:text-white font-semibold"
          id="inviteLink"
          onClick={(e) => {
            e.currentTarget.select()
          }}
          value={inviteLink}
        />
        <Button
          type="button"
          onClick={() => {
            setCopied(inviteLink)
            toast.success('Copied')
          }}
          className="flex text-sm flex-shrink-0 border bg-gray-100 transition hover:bg-gray-200/80 items-center px-5 py-2 rounded-md gap-1 font-semibold"
        >
          Copy Link
        </Button>
      </div>
    </>
  )
}

export default CopyInviteLink
