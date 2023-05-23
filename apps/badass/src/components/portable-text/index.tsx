import React from 'react'
import type {ArbitraryTypedObject, PortableTextBlock} from '@portabletext/types'
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid'
import Balancer from 'react-wrap-balancer'
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
import Link from 'next/link'
import cx from 'classnames'

import Refractor from 'react-refractor'
import js from 'refractor/lang/javascript'
import markdown from 'refractor/lang/markdown'
import yaml from 'refractor/lang/yaml'
import Spinner from 'components/spinner'
import {TwitterTweetEmbed} from 'react-twitter-embed'

Refractor.registerLanguage(js)
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
      className={cx('flex flex-col items-center justify-center relative', {
        'bg-white/10': isLoading,
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
    blockquote: ({children, value}) => {
      return (
        <blockquote className="not-prose p-5 border-badass-yellow-500 border-l-[3px] bg-white/10 text-gray-200 relative not-italic font-normal">
          {children}
        </blockquote>
      )
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
    bodyGrid: ({value}: any) => {
      const {items} = value
      return (
        <div
          className={cx(`grid gap-5 overflow-x-auto auto-cols-fr`, {
            'sm:grid-cols-2 grid-cols-1': items.length === 2,
            'md:grid-cols-3 sm:grid-cols-2 grid-cols-1': items.length === 3,
          })}
        >
          {items.map((item: any) => {
            return (
              <>
                <PortableText
                  components={PortableTextComponents}
                  value={item}
                />
              </>
            )
          })}
        </div>
      )
    },
    bodyClientProfile: ({value}: any) => {
      const {name, description, image} = value
      return (
        <div className="flex items-center gap-10">
          {image && (
            <Image
              src={image}
              alt={name}
              width={200}
              height={200}
              className="flex-shrink-0 rounded"
            />
          )}
          <div className="flex flex-col w-full">
            <span className="text-3xl font-semibold">{name}</span>
            <span className="text-lg text-gray-300 pt-3">
              <Balancer>{description}</Balancer>
            </span>
          </div>
        </div>
      )
    },
    bodyContributorProfile: ({value}: any) => {
      const {name, description, image} = value
      return (
        <div className="flex items-center p-5 gap-5 bg-white/10 rounded">
          {image && (
            <Image
              src={image}
              alt={name}
              width={60}
              height={60}
              className="flex-shrink-0 rounded-full !my-0"
            />
          )}
          <div className="flex flex-col w-full">
            <span className="text-xl font-semibold">{name}</span>
            <span className="text-base opacity-80 leading-tight pt-1">
              <Balancer>{description}</Balancer>
            </span>
          </div>
        </div>
      )
    },
    tweet: ({value}: any) => {
      const {tweetId} = value
      return (
        <TwitterTweetEmbed
          tweetId={tweetId}
          options={{theme: 'dark'}}
          placeholder={
            <div className="aspect-square w-full h-full flex items-center justify-center">
              <Spinner className="w-5 h-5" />
            </div>
          }
        />
      )
    },
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
          className={cx(`p-5 sm:my-8 my-4 rounded-md`, getCalloutStyles(type))}
        >
          <div>
            <span
              role="img"
              aria-label={getCalloutImage(type).alt}
              className="text-lg font-bold"
            >
              {getCalloutImage(type).src}
            </span>
            <span className="pl-2 font-semibold">{getCalloutTitle(type)}</span>
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
            width={260}
            height={80}
          />
        </div>
      ) : (
        <hr />
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
      return 'bg-moss-100 text-green-800'
    case 'big-idea':
      return 'bg-blue-100 text-cyan-900'
    case 'reflection':
      return 'bg-orange-100 text-orange-800'
    case 'caution':
      return 'bg-pink-100 text-pink-900'
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
