import React from 'react'
import type {ArbitraryTypedObject, PortableTextBlock} from '@portabletext/types'
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid'
import {
  toPlainText,
  PortableText,
  PortableTextComponents,
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
import speakingurl from 'speakingurl'
import Image from 'next/image'
import cx from 'classnames'

import Refractor from 'react-refractor'
import js from 'refractor/lang/javascript'
import markdown from 'refractor/lang/markdown'
import yaml from 'refractor/lang/yaml'
import css from 'refractor/lang/css'
import jsx from 'refractor/lang/jsx'
import tsx from 'refractor/lang/tsx'
import Spinner from 'components/spinner'

Refractor.registerLanguage(js)
Refractor.registerLanguage(css)
Refractor.registerLanguage(markdown)
Refractor.registerLanguage(yaml)
Refractor.registerLanguage(jsx)
Refractor.registerLanguage(tsx)

const Video: React.FC<{url: string; title: string}> = ({url, title}) => {
  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)
  const videoService: any = useVideo()
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  const poster = url
    .replace('stream.mux.com', 'image.mux.com')
    .replace('.m3u8', '/thumbnail.png?width=1600&height=1000&fit_mode=pad')
  return (
    <div className="">
      {title && (
        <strong className="inline-block pb-2 font-semibold">
          <span className="sr-only">Video:</span> {title}
        </strong>
      )}
      <div
        ref={fullscreenWrapperRef}
        className={cx('w-full', {
          'absolute top-0 left-0 z-50': isFullscreen,
          relative: !isFullscreen,
        })}
      >
        <div className="overflow-hidden rounded-md">
          <Player
            enableGlobalShortcuts={false}
            aria-label={title}
            container={fullscreenWrapperRef.current || undefined}
            aspectRatio="8:5"
            className={'font-sans'}
            poster={poster}
          >
            {url && <HLSSource src={url} />}
          </Player>
        </div>
      </div>
    </div>
  )
}

const BodyImage = ({value}: BodyImageProps) => {
  const {alt, caption, image, href} = value
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  if (!image) return <figure>⚠️ missing image</figure>
  const {url, width, height} = image
  const Figure = () => {
    return (
      <figure
        className={cx('relative flex items-center justify-center', {
          'bg-gray-800/20': isLoading,
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
        {isLoading && <Spinner className="absolute h-8 w-8" />}
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

const HighlightedCode: React.FC<CodeProps> = ({value}) => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const {language, code, highlightedLines} = value
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
        className="relative -mx-5 rounded-none p-5 leading-[1.15] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 sm:mx-0 sm:rounded-lg md:leading-tight"
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
          markers={highlightedLines}
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
      return <code className="rounded bg-gray-200 px-1 py-0.5">{children}</code>
    },
  },
  types: {
    bodyHlsVideo: ({value}: BodyVideoProps) => {
      const {url, title, caption} = value
      return (
        <figure className="video">
          <VideoProvider>
            <Video url={url} title={title} />
          </VideoProvider>
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
          <div className="pb-4 text-base font-medium text-gray-400">
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
    bodyImage: ({value}: BodyImageProps) => <BodyImage value={value} />,
    code: ({value}: CodeProps) => {
      return <HighlightedCode value={value} />
    },
    callout: ({value}: CalloutProps) => {
      const {body, type} = value
      return (
        <div
          className={cx(
            `my-4 flex space-x-5 rounded-md p-5 sm:my-8`,
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
    videoOptions: {
      controls: boolean
      autoPlay: boolean
      loop: boolean
    }
  }
}

type BodyImageProps = {
  value: {
    alt: string
    caption: PortableTextBlock | ArbitraryTypedObject
    href?: string
    image: {
      url: string
      width: number
      height: number
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

const getCalloutStyles = (type: string): string => {
  switch (type) {
    case 'tip':
      return 'bg-gray-200'
    case 'big-idea':
      return 'bg-gray-200'
    case 'reflection':
      return 'bg-gray-200'
    case 'caution':
      return 'bg-gray-200'
    default:
      return 'bg-gray-200'
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
