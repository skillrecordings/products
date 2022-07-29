import * as React from 'react'
import {
  Twitter,
  Facebook,
  Reddit,
  CopyToClipboard,
  LinkedIn,
  Hacker,
} from '@skillrecordings/react'
import {toast} from 'react-hot-toast'

const Share: React.FC<
  React.PropsWithChildren<{link: string; message: string}>
> = ({link, message}) => {
  return (
    <div className="flex">
      <Twitter link={link} message={message} />
      <Facebook link={link} message={message} />
      <Reddit link={link} message={message} />
      <CopyToClipboard
        link={link}
        message={message}
        onSuccess={() => toast.success('Link copied to clipboard')}
      />
      <LinkedIn link={link} message={message} />
      <Hacker link={link} message={message} />
    </div>
  )
}

export default Share
