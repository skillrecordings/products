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
import Spinner from 'components/spinner'

Refractor.registerLanguage(js)
Refractor.registerLanguage(css)
Refractor.registerLanguage(markdown)
Refractor.registerLanguage(yaml)

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
        <strong className="font-semibold inline-block pb-2">
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
          </Player>
        </div>
      </div>
    </div>
  )
}

const BodyImage = ({value}: BodyImageProps) => {
  const {alt, caption, image} = value
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  if (!image) return <figure>⚠️ missing image</figure>
  const {url, width, height} = image
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
      const {blank, href} = value
      return blank ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <a href={href}>{children}</a>
      )
    },
  },
  types: {
    bodyVideo: ({value}: BodyVideoProps) => {
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
      const {language, code, highlightedLines} = value
      return (
        <Refractor
          language={language || 'javascript'}
          value={code}
          markers={highlightedLines}
        />
      )
    },
    callout: ({value}: CalloutProps) => {
      const {body, type} = value
      return (
        <div
          className={cx(
            `p-5 sm:my-8 my-4 rounded-md flex space-x-5`,
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
  }
}

type BodyImageProps = {
  value: {
    alt: string
    caption: PortableTextBlock | ArbitraryTypedObject
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
      return 'bg-slate-800'
    case 'big-idea':
      return 'bg-slate-800'
    case 'reflection':
      return 'bg-slate-800'
    case 'caution':
      return 'bg-slate-800'
    default:
      return 'bg-slate-800'
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
