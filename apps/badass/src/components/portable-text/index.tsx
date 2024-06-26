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
        <strong className="inline-block pb-2 font-semibold">
          <span className="sr-only">Video:</span> {title}
        </strong>
      )}
      <div
        ref={fullscreenWrapperRef}
        className={cx('w-full', {
          'absolute left-0 top-0 z-50': isFullscreen,
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
  const {alt, caption, image} = value
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  if (!image) return <figure>⚠️ missing image</figure>
  const {url, width, height} = image
  return (
    <figure
      className={cx('relative flex flex-col items-center justify-center', {
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
      {isLoading && <Spinner className="absolute h-8 w-8" />}
      {caption && (
        <figcaption>
          <PortableText value={caption} />
        </figcaption>
      )}
    </figure>
  )
}

const BodyImageFloated = ({value}: BodyImageFloatedProps) => {
  const {floatSide, image, width, height} = value
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  if (!image) return <figure>⚠️ missing image</figure>
  const {url, alt} = image
  return (
    <figure
      className={cx(
        'relative flex flex-col items-center justify-center',
        {
          'bg-white/10': isLoading,
        },
        floatSide === 'right' ? 'float-right ml-4' : 'float-left mr-4',
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
      {isLoading && <Spinner className="absolute h-8 w-8" />}
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
        <blockquote className="not-prose relative border-l-[3px] border-badass-yellow-500 bg-white/10 p-5 font-normal not-italic text-gray-200">
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
          className={cx(`grid auto-cols-fr gap-5 overflow-x-auto`, {
            'grid-cols-1 sm:grid-cols-2': items.length === 2,
            'grid-cols-1 sm:grid-cols-2 md:grid-cols-3': items.length === 3,
          })}
        >
          {items.map((item: any) => {
            return (
              <div key={item._key}>
                <PortableText
                  components={PortableTextComponents}
                  value={item}
                />
              </div>
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
          <div className="flex w-full flex-col">
            <span className="text-3xl font-semibold">{name}</span>
            <span className="pt-3 text-lg text-gray-300">
              <Balancer>{description}</Balancer>
            </span>
          </div>
        </div>
      )
    },
    bodyContributorProfile: ({value}: any) => {
      const {name, description, image} = value
      return (
        <div className="flex items-center gap-5 rounded bg-white/10 p-5">
          {image && (
            <Image
              src={image}
              alt={name}
              width={60}
              height={60}
              className="!my-0 flex-shrink-0 rounded-full"
            />
          )}
          <div className="flex w-full flex-col">
            <span className="text-xl font-semibold">{name}</span>
            <span className="pt-1 text-base leading-tight opacity-80">
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
            <div className="flex aspect-square h-full w-full items-center justify-center">
              <Spinner className="h-5 w-5" />
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
    bodyImage: ({value}: BodyImageProps) => <BodyImage value={value} />,
    bodyImageFloated: ({value}: BodyImageFloatedProps) => (
      <BodyImageFloated value={value} />
    ),
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
          className={cx(`my-4 rounded-md p-5 sm:my-8`, getCalloutStyles(type))}
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
        <div className="clear-both flex items-center justify-center pt-10">
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
    specialHeading: ({value}: SpecialHeadingProps) => {
      const {text} = value
      return (
        <h3 className="clear-both font-condensed text-[2rem] text-yellow-300">
          {text}
        </h3>
      )
    },
  },
}

type InternalLinkProps = any

type EmojiProps = PortableTextMarkComponentProps<any>

type DividerProps = {
  value: {image?: string}
}

type SpecialHeadingProps = {
  value: {text: string}
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

type BodyImageFloatedProps = {
  value: {
    floatSide: string
    image: {
      url: string
      alt: string
    }
    width: number
    height: number
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
