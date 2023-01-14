import React from 'react'
import type {ArbitraryTypedObject, PortableTextBlock} from '@portabletext/types'
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid'
import {
  toPlainText,
  PortableText,
  PortableTextComponents,
  PortableTextMarkComponentProps,
} from '@portabletext/react'
import speakingurl from 'speakingurl'
import Image from 'next/legacy/image'
import cx from 'classnames'

import Refractor from 'react-refractor'

import js from 'refractor/lang/javascript'
import markdown from 'refractor/lang/markdown'
import yaml from 'refractor/lang/yaml'
import css from 'refractor/lang/css'
import jsx from 'refractor/lang/jsx'
import tsx from 'refractor/lang/tsx'

const BodyImage = ({value}: BodyImageProps) => {
  const {alt, caption, src, width, height, href} = value
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  if (!src) return <figure>⚠️ missing image</figure>
  const Figure = () => {
    return (
      <figure
        className={cx(
          'relative flex items-center justify-center py-4 text-center',
          {
            'bg-slate-100': isLoading,
          },
        )}
      >
        <Image
          onLoadingComplete={() => {
            setIsLoading(false)
          }}
          src={src}
          alt={alt}
          width={Number(width)}
          height={Number(height)}
          quality={100}
          className="rounded-md"
        />
        {isLoading && 'loading'}
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      title="Link opens in a new window"
    >
      {children}
    </a>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

const BodyTestimonial: React.FC<
  React.PropsWithChildren<BodyTestimonialProps>
> = ({value, children, ...props}) => {
  const {body, author} = value
  return (
    <div className="not-prose">
      <blockquote
        className="relative -mx-5 overflow-hidden border border-gray-800 py-5 pr-5 pl-5 font-medium text-gray-200 shadow-xl sm:mx-0 sm:rounded-lg sm:pr-6 sm:pl-8"
        {...props}
      >
        <div className="relative z-10">
          <div className="prose-lg text-gray-200">
            <PortableText components={PortableTextComponents} value={body} />
          </div>
          {author?.name && (
            <div className="flex items-center gap-3 pt-5 text-gray-200">
              {author.image && (
                <div className="flex items-center justify-center overflow-hidden rounded-full">
                  <Image
                    src={author.image}
                    alt={author.name}
                    width={48}
                    height={48}
                  />
                </div>
              )}
              <span className="font-normal text-gray-200">{author.name}</span>
            </div>
          )}
        </div>
        <div
          className="absolute top-0 left-0 h-full w-0.5 bg-cyan-500 sm:w-1"
          aria-hidden="true"
        />
      </blockquote>
    </div>
  )
}

const HighlightedCode: React.FC<CodeProps> = ({value}) => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  const {language, code, highlightedLines} = value

  const lines = highlightedLines?.map((line: any) => {
    return {
      line: line,
      component: ({children}: any) => (
        <div className=" from-yellow-500/30 to-amber-500/40 before:pointer-events-none before:absolute before:left-0 before:h-6 before:w-full before:bg-gradient-to-r before:mix-blend-overlay before:content-['']">
          {children}
        </div>
      ),
    }
  })
  return mounted ? (
    <>
      <pre
        role="region"
        aria-label={'code sample'}
        tabIndex={0}
        className="sr-only"
      >
        <code>{code}</code>
      </pre>
      <pre
        aria-hidden="true"
        className="relative -mx-5 rounded-none bg-black/50 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-800 hover:scrollbar-thumb-gray-700 sm:mx-0 sm:rounded-lg"
      >
        <Refractor
          inline
          language={
            language
              ? Refractor.hasLanguage(language)
                ? language
                : 'javascript'
              : 'javascript'
          }
          value={code}
          markers={lines}
        />
      </pre>
    </>
  ) : null
}

// https://github.com/portabletext/react-portabletext

const PortableTextComponents: PortableTextComponents = {
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
    link: ({value, children}) => {
      return <ExternalLink value={value}>{children}</ExternalLink>
    },
    code: ({value, children}) => {
      return <code>{children}</code>
    },
  },
  types: {
    bodyHlsVideo: ({value}: BodyVideoProps) => {
      const {url, title, caption} = value
      return (
        <figure className="video">
          {/* TODO: Add Mux player */}
          <figcaption>
            <details
              className="group marker:text-transparent"
              aria-label="Video transcript"
              role="contentinfo"
            >
              <summary className="inline-flex cursor-pointer items-center space-x-2 text-gray-600 transition hover:text-gray-800">
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center rounded-full border border-gray-200 p-1 transition group-hover:bg-gray-50"
                >
                  <ChevronDownIcon className="h-4 w-4 group-open:hidden" />
                  <ChevronUpIcon className="hidden h-4 w-4 group-open:block" />
                </span>
                <span className="text-base">Video Transcript</span>
              </summary>
              <div className="text-gray-600">
                <PortableText value={caption} />
              </div>
            </details>
          </figcaption>
        </figure>
      )
    },
    bodyVideo: ({value}: BodyVideoProps) => {
      const {url, title, caption, videoOptions} = value
      const {autoPlay, loop, controls} = videoOptions
      return (
        <figure className="video">
          <video
            autoPlay={autoPlay}
            loop={loop}
            controls={controls}
            className="rounded-md"
          >
            <source src={url} type="video/mp4" />
          </video>
          <div className="pb-4 text-base font-medium text-slate-400">
            {title}
          </div>
          {caption && (
            <figcaption>
              <details
                className="group marker:text-transparent"
                aria-label="Video transcript"
                role="contentinfo"
              >
                <summary className="inline-flex cursor-pointer items-center space-x-2 text-gray-600 transition hover:text-gray-800">
                  <span
                    aria-hidden="true"
                    className="flex items-center justify-center rounded-full border border-gray-200 p-1 transition group-hover:bg-gray-50"
                  >
                    <ChevronDownIcon className="h-4 w-4 group-open:hidden" />
                    <ChevronUpIcon className="hidden h-4 w-4 group-open:block" />
                  </span>
                  <span className="text-base">Video Transcript</span>
                </summary>
                <div className="text-gray-600">
                  <PortableText value={caption} />
                </div>
              </details>
            </figcaption>
          )}
        </figure>
      )
    },
    bodyTestimonial: ({value}: BodyTestimonialProps) => {
      return <BodyTestimonial value={value} />
    },
    bodyImage: ({value}: BodyImageProps) => <BodyImage value={value} />,
    code: ({value}: CodeProps) => {
      return <HighlightedCode value={value} />
    },
    callout: ({value}: CalloutProps) => {
      const {body, type} = value
      return (
        <div
          className={cx(
            `my-4 flex space-x-5 rounded-md p-5 shadow-2xl shadow-black/30 sm:my-8`,
            getCalloutStyles(type),
          )}
        >
          <div>
            <span
              role="img"
              aria-label={getCalloutImage(type).alt}
              className="text-lg font-bold"
            >
              {getCalloutImage(type).src}
            </span>
            {/* <span className="pl-2 font-semibold">{getCalloutTitle(type)}</span> */}
          </div>
          {/* <b className="font-bold">{getCalloutTitle(type)}</b> */}
          <div className="min-w-0 first-of-type:prose-p:mt-0 last-of-type:prose-p:mb-0">
            <PortableText value={body} />
          </div>
        </div>
      )
    },
    divider: ({value}: DividerProps) => {
      const {image} = value
      return image ? (
        <div className="flex items-center justify-center pt-10">
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            width={100 / 1.2}
            height={66 / 1.2}
          />
        </div>
      ) : (
        <div className="pt-20">
          <svg
            className="mx-auto"
            role="presentation"
            aria-hidden="true"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.0001 0.000167999C13.369 5.15074 13.1601 8.42196 11.9274 10.5329C9.91165 13.1568 6.41815 13.4073 0 14.0001C6.31427 14.7635 9.72775 14.9298 11.7491 17.3337C13.2595 19.4622 13.5144 22.7542 14 28C14.8236 21.1958 14.9527 17.7605 17.9354 15.8047C20.0562 14.7798 23.2215 14.5567 28 14C22.0752 13.2737 18.6385 13.1075 16.5923 11.2974C14.8608 9.23457 14.6771 5.80884 14.0001 0V0.000167999Z"
              fill="rgb(252, 211, 77)"
            />
          </svg>
        </div>
      )
    },
    grid: ({value}: GridProps) => {
      const {items} = value
      return (
        <div className="prose-ul:list-outside prose-ul:pl-0 prose-li:pl-0 sm:prose-ul:pl-0">
          <ul className="mx-auto grid max-w-screen-md list-outside list-none grid-cols-1 place-content-center place-items-start py-2 pl-0 text-lg sm:text-xl md:grid-cols-2 md:gap-16 md:py-10">
            {items.map((item: any) => {
              return (
                <li key={item.title} className="pl-0 marker:text-black">
                  <strong className="text-xl font-bold sm:text-2xl">
                    {item.title}
                  </strong>
                  <div className="pl-5 prose-li:py-0.5">
                    <PortableText value={item.body} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )
    },
  },
}

type GridProps = any

type InternalLinkProps = any
type ExternalLinkProps = any

type EmojiProps = PortableTextMarkComponentProps<any>

type DividerProps = {
  value: {image?: string}
}

type CalloutProps = {
  value: {
    body: PortableTextBlock | ArbitraryTypedObject
    type: string
  }
}

type BodyVideoProps = {
  value: {
    url: string
    title: string
    caption: PortableTextBlock | ArbitraryTypedObject
    videoOptions: {
      controls: boolean
      autoPlay: boolean
      loop: boolean
    }
  }
}

type BodyTestimonialProps = {
  value: {
    body: PortableTextBlock | ArbitraryTypedObject
    author: {
      name: string
      image?: string
    }
    external_url?: string
  }
}

type BodyImageProps = {
  value: {
    alt: string
    caption: PortableTextBlock | ArbitraryTypedObject
    href?: string
    src: string
    width?: string
    height?: string
  }
}

type CodeProps = {
  value: {
    language: string
    code: string
    highlightedLines: (number | Refractor.Marker)[]
  }
}

const getCalloutStyles = (type: string): string => {
  switch (type) {
    case 'tip':
      return 'bg-gray-800'
    case 'big-idea':
      return 'bg-gray-800'
    case 'reflection':
      return 'bg-gray-800'
    case 'caution':
      return 'bg-gray-800'
    default:
      return 'bg-gray-800'
  }
}

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
    default:
      return 'Callout'
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
    default:
      return {alt: 'speech baloon', src: '💬'}
  }
}

export default PortableTextComponents

Refractor.registerLanguage(js)
Refractor.registerLanguage(css)
Refractor.registerLanguage(markdown)
Refractor.registerLanguage(yaml)
Refractor.registerLanguage(jsx)
Refractor.registerLanguage(tsx)
