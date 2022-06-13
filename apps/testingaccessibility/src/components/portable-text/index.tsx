import React from 'react'
import type {ArbitraryTypedObject, PortableTextBlock} from '@portabletext/types'
import {getPathForLesson, getPathForSection} from 'utils/get-resource-paths'
import {
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
import js from 'refractor/lang/javascript'
import Refractor from 'react-refractor'
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'

Refractor.registerLanguage(js)

const Video: React.FC<{url: string; title: string}> = ({url, title}) => {
  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)
  const videoService: any = useVideo()
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  const poster = url
    .replace('stream.mux.com', 'image.mux.com')
    .replace('.m3u8', '/thumbnail.png?width=1600&height=1000&fit_mode=pad')
  return (
    <div>
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

// https://github.com/portabletext/react-portabletext

const PortableTextComponents: PortableTextComponents = {
  marks: {
    emoji: ({text, value}: EmojiProps) => {
      const label = value?.emoji?.label || ''
      return (
        <span role={label ? "img" : "presentation"} aria-label={label} aria-hidden={!label}>
          {text}
        </span>
      )
    },
    internalLink: ({value, children}: InternalLinkProps) => {
      const {slug = {}, type = 'lesson', modules} = value
      const resourceSlug = slug.current

      const getPath = () => {
        switch (type) {
          case 'lesson':
            return {
              pathname: '/learn/[module]/[section]/[lesson]',
              query: getPathForLesson(resourceSlug, modules),
            }
          case 'section':
            return {
              pathname: '/learn/[module]/[section]',
              query: getPathForSection(resourceSlug, modules),
            }
          default:
            return {
              pathname: '/learn/[module]',
              query: {module: resourceSlug},
            }
        }
      }
      return (
        <Link href={getPath()}>
          <a>{children}</a>
        </Link>
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
        <figure id="video">
          <VideoProvider>
            <Video url={url} title={title} />
          </VideoProvider>
          <figcaption>
            <details>
              <summary>Video Transcript</summary>
              <PortableText value={caption} />
            </details>
          </figcaption>
        </figure>
      )
    },
    bodyImage: ({value}: BodyImageProps) => {
      const {alt, caption, image} = value
      if (!image) return <figure>⚠️ missing image</figure>
      const {url, width, height} = image

      return (
        <figure>
          <Image
            src={url}
            alt={alt}
            width={width}
            height={height}
            quality={100}
            className="rounded-sm"
          />
          {caption && (
            <figcaption>
              <PortableText value={caption} />
            </figcaption>
          )}
        </figure>
      )
    },
    code: ({value}: CodeProps) => {
      const {language, code, highlightedLines} = value
      return (
        <Refractor
          language={language}
          value={code}
          markers={highlightedLines}
        />
      )
    },
    callout: ({value}: CalloutProps) => {
      const {body, type} = value
      return (
        <div className={cx(`p-5 mb-4 rounded-md`, getCalloutStyles(type))}>
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
      console.log({image})
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
