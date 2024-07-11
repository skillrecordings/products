import React from 'react'
import toast from 'react-hot-toast'
import {useCopyToClipboard} from 'react-use'
import {isBrowser} from '@skillrecordings/skill-lesson/utils/is-browser'
import {type MDXComponents as MDXComponentsType} from 'mdx/types'

interface LinkedHeadingProps extends React.HTMLProps<HTMLHeadingElement> {
  as?: Extract<
    keyof JSX.IntrinsicElements,
    'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  >
}

export const LinkedHeading: React.FC<LinkedHeadingProps> = ({
  as = 'h2',
  ...props
}) => {
  const [state, copyToClipboard] = useCopyToClipboard()
  const linkToTitle = `#${props.id}`

  const handleOnClick = () => {
    if (isBrowser()) {
      const url = window.location.href
      const hash = window.location.hash
      const strippedUrl = url.replace(hash, '')

      copyToClipboard(strippedUrl + linkToTitle)
      toast.success('Copied')
    }
  }

  const newChildren = (
    <>
      <a
        href={linkToTitle}
        className="absolute left-[-1.5ch] pr-3 !text-gray-600 no-underline opacity-0 transition group-hover:opacity-100 hover:!text-primary"
        aria-hidden="true"
      >
        #
      </a>
      {props.children}
    </>
  )

  return React.createElement(
    as,
    {
      className: 'group cursor-pointer relative',
      onClick: handleOnClick,
      ...props,
    },
    newChildren,
  )
}

export const linkedHeadingComponents: MDXComponentsType = {
  h1: (props) => <LinkedHeading as="h1" {...props} />,
  h2: (props) => <LinkedHeading as="h2" {...props} />,
  h3: (props) => <LinkedHeading as="h3" {...props} />,
  h4: (props) => <LinkedHeading as="h4" {...props} />,
}
