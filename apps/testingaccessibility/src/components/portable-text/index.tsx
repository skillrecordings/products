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
    <div
      ref={fullscreenWrapperRef}
      className={cx('w-full', {
        'absolute top-0 left-0 z-50': isFullscreen,
        relative: !isFullscreen,
      })}
    >
      {title && (
        <strong className="font-bold">
          <span className="sr-only">Video:</span> {title}
        </strong>
      )}
      <div className="rounded-sm overflow-hidden">
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
  )
}

// https://github.com/portabletext/react-portabletext

const PortableTextComponents: PortableTextComponents = {
  marks: {
    emoji: ({text, value}: EmojiProps) => {
      const label = value?.emoji?.label || ''
      return (
        <span role="img" aria-label={label} aria-hidden={!label}>
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
        <figure>
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
          {caption && <figcaption>{caption}</figcaption>}
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
        <div
          className={cx(
            `flex space-x-3 p-5 rounded-lg`,
            getCalloutStyles(type),
          )}
        >
          <div role="img" aria-label={getCalloutImage(type).alt}>
            {getCalloutImage(type).src}
          </div>{' '}
          {/* <b className="font-bold">{getCalloutTitle(type)}</b> */}
          <div className="first-of-type:prose-p:mt-0 last-of-type:prose-p:mb-0">
            <PortableText value={body} />
          </div>
        </div>
      )
    },
  },
}

type InternalLinkProps = any

type EmojiProps = PortableTextMarkComponentProps<any>

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
      return 'bg-green-100 text-green-800'
    case 'big-idea':
      return 'bg-blue-100 text-blue-800'
    case 'reflection':
      return 'bg-orange-100 text-orange-800'
    case 'caution':
      return 'bg-red-100 text-red-800'
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
