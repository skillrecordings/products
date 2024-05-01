import get from 'lodash/get'
import useClipboard from 'react-use-clipboard'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'

const shareCallToActionForTitle = {
  manager: 'Share This Article with Your Team',
  senior: 'Share This Article With Your Coworkers',
  junior: 'Share This Article',
  novice: 'Share This Article With Your Community',
  none: 'Share This Article With Your Friends',
}
type ShareCallToActionForTitleKeys = keyof typeof shareCallToActionForTitle

type Fields = {
  job_title?: ShareCallToActionForTitleKeys | 'none'
}

const ShareCta = ({title, slug}: {title: string; slug: string}) => {
  const [isCopiedToClipboard, setCopiedToClipboard] = useClipboard(
    `https://epicreact.dev/${slug}`,
  )
  const {subscriber} = useConvertkit()

  const fields: Fields = get(subscriber, 'fields', {})

  return (
    <div className="mx-auto mb-32 flex max-w-screen-lg flex-col items-center justify-center px-7 py-24">
      <h2 className="text-center text-xl font-bold leading-tight sm:text-2xl">
        {shareCallToActionForTitle[fields.job_title ?? 'none']}
      </h2>
      <div className="mt-4 flex flex-wrap items-center justify-center">
        <a
          className="m-1 flex items-center rounded-lg bg-blue-500 px-3 py-2 leading-6 transition-all duration-200 ease-in-out hover:bg-blue-600"
          href={`https://twitter.com/intent/tweet/?text=${encodeURIComponent(
            title + ', article by @kentcdodds',
          )}&url=${encodeURIComponent(`https://epicreact.dev/${slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* prettier-ignore */}
          <svg className="mr-1 prose" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><g fill="currentColor"><path fill="none" d="M0 0h24v24H0z"></path><path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"></path></g></svg>
          <span>Tweet</span>
        </a>
        <button
          className="m-1 flex items-center rounded-lg bg-blue-500 px-3 py-2 leading-6 transition-all duration-200 ease-in-out hover:bg-blue-600"
          onClick={() => setCopiedToClipboard()}
        >
          {/* prettier-ignore */}
          <svg className="mr-1 prose" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><g fill="none"><path d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
          <span>
            {isCopiedToClipboard ? 'Copied!' : 'Copy link to clipboard'}
          </span>
        </button>
      </div>
    </div>
  )
}

export default ShareCta
