import {
  LinkedIn,
  Twitter,
  Facebook,
  Reddit,
  CopyToClipboard,
} from '@skillrecordings/react'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'

const Share: React.FC<{title: string}> = ({title}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const className =
    'p-2 hover:bg-white/5 rounded-md transition scale-105 text-slate-300 hover:text-slate-50 hover:shadow-lg hover:shadow-slate-800 hover:border hover:border-slate-800 border border-slate-900'
  const message = `${title} by @marcysutton`

  return (
    <div className="flex space-x-2">
      <Twitter className={className} link={url} message={message} />
      <LinkedIn className={className} link={url} message={message} />
      <Reddit className={className} link={url} message={message} />
      <Facebook className={className} link={url} message={message} />
      <CopyToClipboard
        className={className}
        link={url}
        message={message}
        onSuccess={() => toast.success('Copied to clipboard')}
      />
    </div>
  )
}

export default Share
