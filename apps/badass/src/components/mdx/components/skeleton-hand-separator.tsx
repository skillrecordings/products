import toast from 'react-hot-toast'
import Balancer from 'react-wrap-balancer'
import {useCopyToClipboard} from 'react-use'
import {isBrowser} from 'utils/is-browser'

export type SkeletonHandSeparatorProps = {
  id: string
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  title: string
  subtitle: string
}

const SkeletonHandSeparator: React.FC<SkeletonHandSeparatorProps> = ({
  id,
  number,
  title,
  subtitle,
}) => {
  const [state, copyToClipboard] = useCopyToClipboard()
  const linkToTitle = `#${id}`
  const handleOnClick = () => {
    if (isBrowser()) {
      const url = window.location.href
      const hash = window.location.hash
      const strippedUrl = url.replace(hash, '')
      copyToClipboard(strippedUrl + linkToTitle)
      toast.success('Copied')
    }
  }

  return id && number && title ? (
    <div
      data-skeleton-hand-separator=""
      className="not-prose"
      {...(id && {id})}
    >
      <div data-skeleton-hand-separator-number-holder="">
        <span data-separator-arrow="">[</span>
        <span data-separator-number="">{number}</span>
        <span data-separator-arrow="">]</span>
      </div>
      {title && (
        <h3 data-skeleton-hand-separator-title="" className="group">
          <a
            data-title-anchor-link=""
            className="group-hover:opacity-100"
            href={linkToTitle}
            onClick={handleOnClick}
          >
            #
          </a>
          <Balancer>{title}</Balancer>
        </h3>
      )}
      {subtitle && <h4 data-skeleton-hand-separator-subtitle="">{subtitle}</h4>}
    </div>
  ) : null
}

export default SkeletonHandSeparator
