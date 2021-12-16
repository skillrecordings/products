import * as React from 'react'
import useClipboard from 'react-use-clipboard'

type ShareProps = {
  link: string
  message?: string
}

const links = {
  twitter: (link = '', message = '') =>
    `https://twitter.com/intent/tweet/?text=${encodeURIComponent(
      message,
    )}&url=${encodeURIComponent(link)}`,
  facebook: (link = '') =>
    `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
  reddit: (link = '', message = '') =>
    `https://reddit.com/submit/?url=${encodeURIComponent(
      link,
    )}&title=${encodeURIComponent(message)}`,
  linkedin: (link = '') =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      link,
    )}`,
  hacker: (link = '', message = '') =>
    `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
      link,
    )}&t=${encodeURIComponent(message)}`,
}

const icons = {
  twitter: (
    <svg
      aria-hidden="true"
      height="16"
      width="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <path d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z" />
      </g>
    </svg>
  ),
  facebook: (
    <svg
      aria-hidden="true"
      height="16"
      width="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <path
          d="M16,8.048a8,8,0,1,0-9.25,7.9V10.36H4.719V8.048H6.75V6.285A2.822,2.822,0,0,1,9.771,3.173a12.2,12.2,0,0,1,1.791.156V5.3H10.554a1.155,1.155,0,0,0-1.3,1.25v1.5h2.219l-.355,2.312H9.25v5.591A8,8,0,0,0,16,8.048Z"
          fill="currentColor"
        />
      </g>
    </svg>
  ),
  reddit: (
    <svg
      aria-hidden="true"
      height="16"
      width="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <path
          d="M16,7.9c0-1.1-0.9-1.9-1.9-1.9c-0.5,0-0.9,0.2-1.2,0.4c-1.2-0.7-2.7-1.2-4.3-1.3l0.8-2.6L11.7,3 c0.1,0.8,0.8,1.5,1.6,1.5c0.9,0,1.6-0.7,1.6-1.6c0-0.9-0.7-1.6-1.6-1.6c-0.6,0-1.2,0.4-1.4,0.9L9.2,1.5C9,1.5,8.8,1.6,8.7,1.8 l-1,3.3C6,5.1,4.4,5.6,3.1,6.3C2.8,6.1,2.4,5.9,1.9,5.9C0.9,5.9,0,6.8,0,7.9c0,0.7,0.3,1.2,0.8,1.6c0,0.2,0,0.3,0,0.5 c0,1.3,0.8,2.6,2.2,3.5c1.3,0.9,3.1,1.4,5,1.4c1.9,0,3.7-0.5,5-1.4c1.4-0.9,2.2-2.1,2.2-3.5c0-0.1,0-0.3,0-0.4 C15.6,9.1,16,8.5,16,7.9z M4.5,9c0-0.6,0.5-1.1,1.1-1.1c0.6,0,1.1,0.5,1.1,1.1s-0.5,1.1-1.1,1.1C5,10.1,4.5,9.6,4.5,9z M10.6,12.2 c-0.6,0.6-1.4,0.8-2.6,0.8c0,0,0,0,0,0c0,0,0,0,0,0c-1.2,0-2.1-0.3-2.6-0.8c-0.2-0.2-0.2-0.4,0-0.6c0.2-0.2,0.4-0.2,0.6,0 c0.4,0.4,1,0.6,2,0.6c0,0,0,0,0,0c0,0,0,0,0,0c1,0,1.6-0.2,2-0.6c0.2-0.2,0.4-0.2,0.6,0C10.8,11.8,10.8,12.1,10.6,12.2z M10.4,10.1 c-0.6,0-1.1-0.5-1.1-1.1c0-0.6,0.5-1.1,1.1-1.1c0.6,0,1.1,0.5,1.1,1.1C11.5,9.6,11,10.1,10.4,10.1z"
          fill="currentColor"
        />
      </g>
    </svg>
  ),
  link: (
    <svg
      aria-hidden="true"
      height="16"
      width="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <path d="M4.5,16c-1.2,0-2.3-0.5-3.2-1.3c-1.8-1.8-1.8-4.6,0-6.4L2,7.6L3.4,9L2.7,9.7 c-1,1-1,2.6,0,3.6c1,1,2.6,1,3.6,0l3-3c1-1,1-2.6,0-3.6L8.6,6L10,4.6l0.7,0.7c1.8,1.8,1.8,4.6,0,6.4l-3,3C6.9,15.5,5.7,16,4.5,16z" />
        <path
          d="M6,11.4l-0.7-0.7c-1.8-1.8-1.8-4.6,0-6.4l3-3c0.9-0.9,2-1.3,3.2-1.3s2.3,0.5,3.2,1.3c1.8,1.8,1.8,4.6,0,6.4 L14,8.4L12.6,7l0.7-0.7c1-1,1-2.6,0-3.6c-1-1-2.6-1-3.6,0l-3,3c-1,1-1,2.6,0,3.6L7.4,10L6,11.4z"
          fill="currentColor"
        />
      </g>
    </svg>
  ),
  linkedin: (
    <svg
      height="16"
      width="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <path
          d="M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16h14.7c0.4,0,0.7-0.3,0.7-0.7V0.7 C16,0.3,15.7,0,15.3,0z M4.7,13.6H2.4V6h2.4V13.6z M3.6,5C2.8,5,2.2,4.3,2.2,3.6c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4 C4.9,4.3,4.3,5,3.6,5z M13.6,13.6h-2.4V9.9c0-0.9,0-2-1.2-2c-1.2,0-1.4,1-1.4,2v3.8H6.2V6h2.3v1h0c0.3-0.6,1.1-1.2,2.2-1.2 c2.4,0,2.8,1.6,2.8,3.6V13.6z"
          fill="currentColor"
        />
      </g>
    </svg>
  ),
  hacker: (
    <svg
      width="16"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 140 140"
    >
      <path
        className="scale-90 origin-center"
        fillRule="evenodd"
        fill="currentColor"
        d="M60.94 82.314L17 0h20.08l25.85 52.093c.397.927.86 1.888 1.39 2.883.53.994.995 2.02 1.393 3.08.265.4.463.764.596 1.095.13.334.262.63.395.898.662 1.325 1.26 2.618 1.79 3.877.53 1.26.993 2.42 1.39 3.48 1.06-2.254 2.22-4.673 3.48-7.258 1.26-2.585 2.552-5.27 3.877-8.052L103.49 0h18.69L77.84 83.308v53.087h-16.9v-54.08z"
      />
    </svg>
  ),
}

const style =
  'rounded-md bg-gray-400 bg-opacity-10 hover:bg-opacity-20 transition-all ease-in-out duration-200 flex items-center justify-center p-3 m-1'

const Twitter: React.FC<ShareProps> = ({link, message}) => (
  <a
    href={links.twitter(link, message)}
    className={style}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="sr-only">share on twitter</span>
    {icons.twitter}
  </a>
)

const Facebook: React.FC<ShareProps> = ({link}) => (
  <a
    href={links.facebook(link)}
    className={style}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="sr-only">share on facebook</span>
    {icons.facebook}
  </a>
)

const Reddit: React.FC<ShareProps> = ({link, message}) => (
  <a
    href={links.reddit(link, message)}
    className={style}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="sr-only">share on reddit</span>
    {icons.reddit}
  </a>
)

const CopyToClipboard: React.FC<ShareProps> = ({link}) => {
  const [copied, copyToClipboard] = useClipboard(link, {
    successDuration: 700,
  })

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      className={`${style} relative `}
    >
      <span className="sr-only">copy url to clipboard</span>
      {icons.link}
      {copied && (
        <div className="absolute w-full text-center bg-black px-2 py-1 text-xs scale-50 rounded-md transition-all animate-ping">
          copied
        </div>
      )}
    </button>
  )
}

const LinkedIn: React.FC<ShareProps> = ({link}) => (
  <a
    href={links.linkedin(link)}
    className={style}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="sr-only">share on linkedin</span>
    {icons.linkedin}
  </a>
)

const Hacker: React.FC<ShareProps> = ({link, message}) => (
  <a
    href={links.hacker(link, message)}
    className={style}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="sr-only">share on hacker news</span>
    {icons.hacker}
  </a>
)

export {Twitter, Facebook, Reddit, CopyToClipboard, LinkedIn, Hacker}
