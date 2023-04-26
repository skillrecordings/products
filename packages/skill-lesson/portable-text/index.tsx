import React from 'react'
import type {ArbitraryTypedObject, PortableTextBlock} from '@portabletext/types'
import {
  toPlainText,
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from '@portabletext/react'
import speakingurl from 'speakingurl'
import Image from 'next/image'
import Link from 'next/link'
import {TableOfContents} from './table-of-contents'

import Refractor from 'react-refractor'
import js from 'refractor/lang/javascript'
import markdown from 'refractor/lang/markdown'
import yaml from 'refractor/lang/yaml'
import css from 'refractor/lang/css'
import jsx from 'refractor/lang/jsx'
import tsx from 'refractor/lang/tsx'
import {Icon} from '../icons'

Refractor.registerLanguage(js)
Refractor.registerLanguage(css)
Refractor.registerLanguage(markdown)
Refractor.registerLanguage(yaml)
Refractor.registerLanguage(jsx)
Refractor.registerLanguage(tsx)

const BodyImage = ({
  value,
  loadingIndicator = <>loading</>,
}: BodyImageProps & {loadingIndicator: React.ReactElement}) => {
  const {alt, caption, href} = value
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const imageUrl = value.src || value?.image?.url
  const imageWidth = value.width || value?.image?.width
  const imageHeight = value.height || value?.image?.height

  if (!imageUrl) return <figure data-status="failed">⚠️ missing image</figure>

  const Figure = () => {
    return (
      <figure
        data-body-image=""
        data-status={isLoading ? 'loading' : 'success'}
      >
        <Image
          data-image=""
          onLoadingComplete={() => {
            setIsLoading(false)
          }}
          src={imageUrl}
          alt={alt}
          width={Number(imageWidth)}
          height={Number(imageHeight)}
          quality={100}
        />
        {isLoading && loadingIndicator}
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
      data-external-link=""
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      title="Link opens in a new window"
    >
      {children}
    </a>
  ) : (
    <a data-external-link="" href={href} {...props}>
      {children}
    </a>
  )
}

const InternalLink: React.FC<InternalLinkProps> = ({value, children}) => {
  return (
    <Link
      href={{
        pathname: '/tutorials/[module]/[lesson]',
        query: {
          module: value.module.slug,
          lesson: value.slug,
        },
      }}
    >
      {children}
    </Link>
  )
}

type BodyTweetProps = {
  value: {
    text: any[]
    url: string
    author: {
      name: string
      handle: string
      avatar: string
    }
  }
}

const BodyTweet: React.FC<BodyTweetProps> = ({value}) => {
  const {text, url, author} = value
  const {avatar, name, handle} = author
  return (
    <blockquote data-body-tweet="">
      <div data-header="">
        <a
          href={`https://twitter.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          data-author=""
        >
          <Image src={avatar} alt={name} width={48} height={48} />
          <div data-name="">
            {name} <div data-handle="">@{handle}</div>
          </div>
        </a>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Icon name="Twitter" size="20" />
        </a>
      </div>
      <div data-body="">
        <PortableText value={text} />
      </div>
    </blockquote>
  )
}

const BodyTestimonial: React.FC<
  React.PropsWithChildren<
    BodyTestimonialProps & {loadingIndicator: React.ReactElement}
  >
> = ({value, children, loadingIndicator, ...props}) => {
  const {body, author} = value
  return (
    <div data-body-testimonial="" {...props}>
      <div data-content="">
        <blockquote>
          <PortableText
            components={portableTextComponents({loadingIndicator})}
            value={body}
          />
        </blockquote>
        {author?.name && (
          <div data-author="">
            {author.image ? (
              <div data-image="">
                <Image
                  src={author.image}
                  alt={author.name}
                  width={40}
                  height={40}
                />
              </div>
            ) : (
              '— '
            )}
            <span data-name="">{author.name}</span>
          </div>
        )}
      </div>
      <div data-border="" aria-hidden="true" />
      <div data-quote="" aria-hidden="true">
        ”
      </div>
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
        <div data-highlighted-line="">{children}</div>
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
      <pre data-codeblock="" aria-hidden="true">
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

const portableTextComponents = ({
  loadingIndicator,
}: {
  loadingIndicator: React.ReactElement
}): PortableTextComponents => {
  return {
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
      internalLink: ({value, children}) => {
        return <InternalLink value={value}>{children}</InternalLink>
      },
      code: ({value, children}) => {
        return <code data-body-code="">{children}</code>
      },
    },
    types: {
      bodyTweet: ({value}: BodyTweetProps) => {
        return <BodyTweet value={value} />
      },
      bodyHlsVideo: ({value}: BodyVideoProps) => {
        const {url, title, caption} = value
        return (
          <figure className="video">
            {/* TODO: use Mux player */}
            <figcaption>
              <details
                className="group marker:text-transparent"
                aria-label="Video transcript"
                role="contentinfo"
              >
                <summary className="inline-flex cursor-pointer items-center space-x-2 text-gray-600 transition hover:text-gray-800">
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
        return (
          <BodyTestimonial loadingIndicator={loadingIndicator} value={value} />
        )
      },
      bodyImage: ({value}: BodyImageProps) => {
        return <BodyImage value={value} loadingIndicator={loadingIndicator} />
      },
      code: ({value}: CodeProps) => {
        return <HighlightedCode value={value} />
      },
      callout: ({value}: CalloutProps) => {
        const {body, type} = value
        return (
          <div data-body-callout={type}>
            <div>
              <span
                data-image=""
                role="img"
                aria-label={getCalloutImage(type).alt}
              >
                {getCalloutImage(type).src}
              </span>
            </div>
            <div data-content="">
              <PortableText value={body} />
            </div>
          </div>
        )
      },
      divider: ({value}: DividerProps) => {
        const {image} = value
        return image ? (
          <div data-body-divider="img">
            <Image
              src={image}
              alt=""
              aria-hidden="true"
              width={100 / 1.2}
              height={66 / 1.2}
            />
          </div>
        ) : (
          <div data-body-divider="svg">
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
    image?: {
      url: string
      width: string
      height: string
    }
  }
}

type CodeProps = {
  value: {
    language: string
    code: string
    highlightedLines: (number | Refractor.Marker)[]
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

export {portableTextComponents, TableOfContents}
