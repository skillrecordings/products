import React from 'react'
import type {ArbitraryTypedObject, PortableTextBlock} from '@portabletext/types'
import {
  PortableText,
  toPlainText,
  PortableTextComponents as PortableTextComponentsProps,
  PortableTextMarkComponentProps,
} from '@portabletext/react'
import isEmpty from 'lodash/isEmpty'
import Image from 'next/image'
import {TwitterTweetEmbed} from 'react-twitter-embed'
import cx from 'classnames'
import speakingurl from 'speakingurl'
import Refractor from 'react-refractor'
import Spinner from 'components/spinner'

const PortableTextComponents: PortableTextComponentsProps = {
  block: {
    h1: ({children, value}) => {
      return <h1 id={speakingurl(toPlainText(value))}>{children}</h1>
    },
    h2: ({children, value}) => {
      return <h2 id={speakingurl(toPlainText(value))}>{children}</h2>
    },
    h3: ({children, value}) => {
      return <h3 id={speakingurl(toPlainText(value))}>{children}</h3>
    },
    h4: ({children, value}) => {
      return <h4 id={speakingurl(toPlainText(value))}>{children}</h4>
    },
  },
  marks: {
    emoji: ({text, value}: EmojiProps) => {
      const label = value?.emoji?.label || ''
      return (
        <span
          role={label ? 'img' : 'presentation'}
          aria-label={label}
          aria-hidden={!label}
        >
          {text}
        </span>
      )
    },
    internalLink: ({value, children}: InternalLinkProps) => {
      return <ExternalLink value={value}>{children}</ExternalLink>
    },
    link: ({value, children}) => {
      return <ExternalLink value={value}>{children}</ExternalLink>
    },
    code: ({children}) => {
      return (
        <span className="bg-black/50 py-1 px-1.5 rounded-sm font-mono text-sm">
          {children}
        </span>
      )
    },
  },
  types: {
    bodyImage: ({value}: BodyImageProps) => <BodyImage value={value} />,
    code: ({value}: CodeProps) => {
      const {language, code, highlightedLines} = value

      return (
        <Refractor
          language={
            language
              ? Refractor.hasLanguage(language)
                ? language
                : 'javascript'
              : 'javascript'
          }
          value={code}
          markers={highlightedLines}
        />
      )
    },
    callout: ({value}: CalloutProps) => {
      const {body, type} = value
      const title = getCalloutTitle(type)
      const image = getCalloutImage(type)
      return (
        <div
          className={cx(`p-5 sm:my-8 my-4 rounded-md`, getCalloutStyles(type), {
            'sm:flex': isEmpty(title),
          })}
        >
          <div>
            <span
              role="img"
              aria-label={image.alt}
              className="text-lg font-bold"
            >
              {image.src}
            </span>
            <span className="pl-2 font-semibold">{title}</span>
          </div>
          {/* <b className="font-bold">{getCalloutTitle(type)}</b> */}
          <div className="min-w-0 first-of-type:prose-p:mt-0 last-of-type:prose-p:mb-0">
            <PortableText value={body} components={PortableTextComponents} />
          </div>
        </div>
      )
    },
    divider: ({value}: DividerProps) => {
      const {image} = value
      return image ? (
        <div className="flex items-center justify-center pt-10 pb-10">
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            width={300 / 5}
            height={30 / 5}
          />
        </div>
      ) : (
        <hr />
      )
    },
    twitter: ({value}) => {
      const {id} = value
      return (
        <div>
          <TwitterTweetEmbed tweetId={id} />
        </div>
      )
    },
  },
}

const BodyImage = ({value}: BodyImageProps) => {
  const {alt, caption, image, href} = value
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  if (!image)
    return (
      <figure>
        <span role="img">⚠️</span> missing image
      </figure>
    )
  const {url, width, height} = image
  const Figure = () => {
    return (
      <figure
        className={cx('flex items-center justify-center relative', {
          'bg-gray-100': isLoading,
        })}
      >
        <Image
          onLoadingComplete={() => {
            setIsLoading(false)
          }}
          src={url}
          alt={alt}
          width={width}
          height={height}
          quality={100}
          className="rounded-md"
        />
        {isLoading && <Spinner className="absolute w-8 h-8" />}
        {caption && (
          <figcaption>
            <PortableText value={caption} />
          </figcaption>
        )}
      </figure>
    )
  }
  return href ? (
    <ExternalLink value={{...value, blank: true}} className="flex">
      <Figure />
    </ExternalLink>
  ) : (
    <Figure />
  )
}

const ExternalLink: React.FC<React.PropsWithChildren<ExternalLinkProps>> = ({
  value,
  children,
  ...props
}) => {
  const {blank, href} = value
  return blank ? (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

type EmojiProps = PortableTextMarkComponentProps<any>
type InternalLinkProps = any
type ExternalLinkProps = any
const getCalloutTitle = (type: string): string => {
  switch (type) {
    case 'tip':
      return 'Tip'
    case 'big-idea':
      return 'Big Idea'
    case 'reflection':
      return 'Reflection'
    case 'caution':
      return 'Caution'
    case 'exercise':
      return 'Exercise'
    case 'link':
      return ''
    default:
      return 'Callout'
  }
}
const getCalloutStyles = (type: string): string => {
  switch (type) {
    case 'tip':
      return 'bg-blue-400/30 text-blue-100'
    case 'big-idea':
      return 'bg-blue-400/70 text-cyan-900'
    case 'reflection':
      return 'bg-orange-400/70 text-orange-800'
    case 'caution':
      return 'bg-pink-400/70 text-pink-900'
    case 'exercise':
      return 'bg-green-400/80 text-yellow-900'
    case 'link':
      return 'bg-yellow-400/80 text-yellow-900'
    default:
      return 'bg-gray-400/70 text-gray-800'
  }
}
const getCalloutImage = (type: string): {alt: string; src: string} => {
  switch (type) {
    case 'tip':
      return {alt: 'light bulp', src: '💡'}
    case 'big-idea':
      return {alt: 'exploding head', src: '🤯'}
    case 'reflection':
      return {alt: 'smiling face with sunglasses', src: '😎'}
    case 'caution':
      return {alt: 'warning', src: '⚠️'}
    case 'exercise':
      return {alt: 'memo', src: '📝'}
    case 'link':
      return {alt: 'waving hand', src: '👋'}
    default:
      return {alt: 'speech baloon', src: '💬'}
  }
}
type DividerProps = {
  value: {image?: string}
}
type CalloutProps = {
  value: {
    body: PortableTextBlock | ArbitraryTypedObject
    type: string
  }
}

type CodeProps = {
  value: {
    language: string
    code: string
    highlightedLines: (number | Refractor.Marker)[]
  }
}
type BodyImageProps = {
  value: {
    alt: string
    caption: PortableTextBlock | ArbitraryTypedObject
    link?: string
    image: {
      url: string
      width: number
      height: number
    }
    href?: string
  }
}

export default PortableTextComponents
