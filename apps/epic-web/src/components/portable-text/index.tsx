import React from 'react'
import type {ArbitraryTypedObject, PortableTextBlock} from '@portabletext/types'
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid'
import {
  toPlainText,
  PortableText,
  PortableTextComponents as PortableTextComponentsType,
  PortableTextMarkComponentProps,
} from '@portabletext/react'
import speakingurl from 'speakingurl'
import Image from 'next/image'
import cx from 'classnames'
import TweetEmbed from 'react-tweet-embed'

import Refractor from 'react-refractor'

import js from 'refractor/lang/javascript'
import markdown from 'refractor/lang/markdown'
import yaml from 'refractor/lang/yaml'
import css from 'refractor/lang/css'
import jsx from 'refractor/lang/jsx'
import tsx from 'refractor/lang/tsx'

const BodyImage = ({value}: BodyImageProps) => {
  const {alt, image, caption, href} = value
  const {secure_url: url, width, height} = image
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  if (!url) return <figure>⚠️ missing image</figure>
  const Figure = () => {
    return (
      <figure
        className={cx(
          'flex items-center text-center justify-center relative py-4 border rounded-md text-base',
          {
            'border-gray-800/80': isLoading,
            'border-transparent': !isLoading,
          },
        )}
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
        {isLoading && <div className="absolute">loading image...</div>}
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

const SyntaxHighlightedCode: React.FC<SyntaxHighlightedCodeProps> = ({
  code,
  language,
  highlightedLines,
}) => {
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])
  const lines = highlightedLines?.map((line: any) => {
    return {
      line: line,
      component: ({children}: any) => (
        <div className=" before:bg-gradient-to-r from-yellow-500/30 to-amber-500/40 before:pointer-events-none before:mix-blend-overlay before:content-[''] before:absolute before:w-full before:h-6 before:left-0">
          {children}
        </div>
      ),
    }
  })
  return (
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
        className="sm:mx-0 -mx-5 sm:rounded-lg rounded-none font-mono bg-black/30 relative scrollbar-track-transparent scrollbar-thumb-gray-800 hover:scrollbar-thumb-gray-700 scrollbar-thin"
      >
        {hasMounted && (
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
        )}
      </pre>
    </>
  )
}

const BodyTestimonial: React.FC<
  React.PropsWithChildren<BodyTestimonialProps>
> = ({value, children, ...props}) => {
  const {body, author} = value
  return (
    <div className="not-prose">
      <blockquote
        className="sm:mx-0 -mx-5 border border-gray-800 sm:pr-6 sm:pl-8 pr-5 pl-5 py-5 sm:rounded-lg shadow-xl text-gray-200 font-medium relative overflow-hidden"
        {...props}
      >
        <div className="relative z-10">
          <div className="prose-lg text-gray-200">
            <PortableText components={PortableTextComponents} value={body} />
          </div>
          {author?.name && (
            <div className="flex items-center gap-3 pt-5 text-gray-200">
              {author.image && (
                <div className="flex items-center justify-center rounded-full overflow-hidden">
                  <Image
                    src={author.image}
                    alt={author.name}
                    width={48}
                    height={48}
                  />
                </div>
              )}
              <span className="text-gray-200 font-normal">{author.name}</span>
            </div>
          )}
        </div>
        <div
          className="absolute sm:w-1 w-0.5 h-full bg-cyan-500 top-0 left-0"
          aria-hidden="true"
        />
      </blockquote>
    </div>
  )
}

// https://github.com/portabletext/react-portabletext

const PortableTextComponents: PortableTextComponentsType = {
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
              <summary className="inline-flex space-x-2 items-center cursor-pointer text-gray-600 hover:text-gray-800 transition">
                <span
                  aria-hidden="true"
                  className="group-hover:bg-gray-50 p-1 rounded-full border border-gray-200 flex items-center justify-center transition"
                >
                  <ChevronDownIcon className="group-open:hidden w-4 h-4" />
                  <ChevronUpIcon className="group-open:block hidden w-4 h-4" />
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
                <summary className="inline-flex space-x-2 items-center cursor-pointer text-gray-600 hover:text-gray-800 transition">
                  <span
                    aria-hidden="true"
                    className="group-hover:bg-gray-50 p-1 rounded-full border border-gray-200 flex items-center justify-center transition"
                  >
                    <ChevronDownIcon className="group-open:hidden w-4 h-4" />
                    <ChevronUpIcon className="group-open:block hidden w-4 h-4" />
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
      const {language, code, highlightedLines} = value

      return (
        <SyntaxHighlightedCode
          code={code}
          language={language}
          highlightedLines={highlightedLines}
        />
      )
    },
    tweet: ({value}: TweetProps) => {
      const {id} = value
      return <TweetEmbed tweetId={id} options={{theme: 'dark'}} />
    },
    callout: ({value}: CalloutProps) => {
      const {body, type} = value
      return (
        <div className={cx(getCalloutStyles(type))}>
          <div>
            {getCalloutImage(type).src && (
              <span
                role="img"
                aria-label={getCalloutImage(type).alt}
                className="text-lg font-bold"
              >
                {getCalloutImage(type).src}
              </span>
            )}
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
        <hr className="border-gray-700" />
      )
    },
    grid: ({value}: GridProps) => {
      const {items} = value
      return (
        <div className="sm:prose-ul:pl-0 prose-ul:pl-0 prose-ul:list-outside prose-li:pl-0">
          <ul className="md:py-10 py-2 max-w-screen-md mx-auto list-outside list-none pl-0 grid md:grid-cols-2 grid-cols-1 place-content-center place-items-start sm:text-xl text-lg md:gap-16">
            {items.map((item: any) => {
              return (
                <li key={item.title} className="pl-0 marker:text-black">
                  <strong className="sm:text-2xl text-xl font-bold">
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

type TweetProps = {
  value: {id: string}
}

type CalloutProps = {
  value: {
    body: PortableTextBlock | ArbitraryTypedObject
    type: string
  }
}

type SyntaxHighlightedCodeProps = {
  code: string
  language?: string
  highlightedLines?: any
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
    image: {
      width: string
      height: string
      url: string
      secure_url: string
    }
    alt: string
    caption: PortableTextBlock | ArbitraryTypedObject
    href?: string
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
    case 'highlight':
      return 'mb-2 inline-flex md:text-2xl sm:text-xl text-lg md:!leading-relaxed font-medium'
    case 'tip':
      return 'bg-gray-800 p-5 sm:my-8 my-4 rounded-md flex space-x-5'
    default:
      return ''
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

    default:
      return {alt: '', src: ''}
  }
}

export default PortableTextComponents

Refractor.registerLanguage(js)
Refractor.registerLanguage(css)
Refractor.registerLanguage(markdown)
Refractor.registerLanguage(yaml)
Refractor.registerLanguage(jsx)
Refractor.registerLanguage(tsx)
