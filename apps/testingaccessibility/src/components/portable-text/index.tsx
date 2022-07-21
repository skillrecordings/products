import React from 'react'
import type {ArbitraryTypedObject, PortableTextBlock} from '@portabletext/types'
import {getPathForLesson, getPathForSection} from 'utils/get-resource-paths'
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid'
import {
  toPlainText,
  PortableText,
  PortableTextComponents as PortableTextComponentsProps,
  PortableTextMarkComponentProps,
} from '@portabletext/react'
import {useSelector} from '@xstate/react'
import {
  HLSSource,
  Player,
  selectIsFullscreen,
  useVideo,
  VideoProvider,
} from '@skillrecordings/player'
import Spinner from 'components/spinner'
import speakingurl from 'speakingurl'
import isEmpty from 'lodash/isEmpty'
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'

import Refractor from 'react-refractor'
import js from 'refractor/lang/javascript'
import markdown from 'refractor/lang/markdown'
import yaml from 'refractor/lang/yaml'
import jsx from 'refractor/lang/jsx'
import css from 'refractor/lang/css'

Refractor.registerLanguage(js)
Refractor.registerLanguage(markdown)
Refractor.registerLanguage(jsx)
Refractor.registerLanguage(yaml)
Refractor.registerLanguage(css)

const Video: React.FC<{
  url: string
  title: string
  videoResource: {_ref: string}
}> = ({url, title, videoResource}) => {

  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)
  const videoService: any = useVideo()
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  const poster = url
    .replace('stream.mux.com', 'image.mux.com')
    .replace('.m3u8', '/thumbnail.png?width=1600&height=1000&fit_mode=pad')
  return isMounted ? (
    <div className="">
      {title && (
        <strong className="font-semibold inline-block pb-2">
          <span className="sr-only">Video:</span> {title}
        </strong>
      )}
      <div
        ref={fullscreenWrapperRef}
        className={cx('w-full rounded-md overflow-hidden', {
          'absolute top-0 left-0 z-50': isFullscreen,
          'relative ': !isFullscreen,
        })}
      >
        <div className="rounded-md overflow-hidden">
          <Player
            enableGlobalShortcuts={false}
            aria-label={title}
            container={fullscreenWrapperRef.current || undefined}
            aspectRatio="8:5"
            className={'font-sans'}
            poster={poster}
          >
            {url && <HLSSource src={url} />}
            {videoResource && (
              <track
                label="English"
                kind="subtitles"
                srcLang="en"
                src={`/api/srt/${videoResource._ref}`}
              />
            )}
          </Player>
        </div>
      </div>
    </div>
  ) : null
}

const BodyImage = ({value}: BodyImageProps) => {
  const {alt, caption, image, href} = value
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  if (!image) return <figure>⚠️ missing image</figure>
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
        {isLoading && <Spinner className="w-8 h-8 absolute" />}
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

export const InternalLink: React.FC<InternalLinkProps> = ({
  value,
  children,
  ...props
}) => {
  const {slug = {}, type = 'lesson', hash, modules} = value
  const resourceSlug = slug.current

  const getPath = () => {
    switch (type) {
      case 'lesson':
        return {
          pathname: '/learn/[module]/[section]/[lesson]',
          query: getPathForLesson(resourceSlug, modules),
          hash,
        }
      case 'section':
        return {
          pathname: '/learn/[module]/[section]',
          query: getPathForSection(resourceSlug, modules),
          hash,
        }
      default:
        return {
          pathname: '/learn/[module]',
          query: {module: resourceSlug},
          hash,
        }
    }
  }
  return (
    <Link href={getPath()}>
      <a {...props}>{children}</a>
    </Link>
  )
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
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

// https://github.com/portabletext/react-portabletext

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
      return <InternalLink value={value}>{children}</InternalLink>
    },
    link: ({value, children}) => {
      return <ExternalLink value={value}>{children}</ExternalLink>
    },
  },
  types: {
    bodyVideo: ({value}: BodyVideoProps) => {
      const {url, title, caption, videoResource} = value
      return (
        <figure className="video">
          <VideoProvider>
            <Video url={url} title={title} videoResource={videoResource} />
          </VideoProvider>
          <figcaption>
            <details className="group marker:text-transparent no-marker">
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
    bodyImage: ({value}: BodyImageProps) => <BodyImage value={value} />,
    code: ({value}: CodeProps) => {
      const {language, code, highlightedLines, filename: label} = value
      return (
        <>
          <pre
            role="region"
            aria-label={label ? label : 'code sample'}
            tabIndex={0}
            className="sr-only"
          >
            <code>{code}</code>
          </pre>
          <pre aria-hidden="true">
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
              markers={highlightedLines}
            />
          </pre>
        </>
      )
    },
    callout: ({value}: CalloutProps) => {
      const {body, type} = value
      const title = getCalloutTitle(type)
      const image = getCalloutImage(type)
      return (
        <figure
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
        </figure>
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
        <hr />
      )
    },
  },
}

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
    videoResource: {
      _ref: string
    }
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

type CodeProps = {
  value: {
    language: string
    code: string
    highlightedLines: (number | Refractor.Marker)[]
    filename?: string
  }
}

const getCalloutStyles = (type: string): string => {
  switch (type) {
    case 'tip':
      return 'bg-moss-100 text-green-800'
    case 'big-idea':
      return 'bg-blue-100 text-cyan-900'
    case 'reflection':
      return 'bg-orange-100 text-orange-800'
    case 'caution':
      return 'bg-pink-100 text-pink-900'
    case 'link':
      return 'bg-yellow-100 text-yellow-900'
    default:
      return 'bg-gray-100 text-gray-800'
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
    case 'exercise':
      return 'Exercise'
    case 'link':
      return ''
    default:
      return 'Callout'
  }
}

const getCalloutImage = (type: string): {alt: string; src: string} => {
  switch (type) {
    case 'tip':
      return {alt: 'light bulb', src: '💡'}
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
      return {alt: 'speech balloon', src: '💬'}
  }
}

export default PortableTextComponents
