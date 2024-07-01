import {isBrowser} from '@/utils/is-browser'
import {CopyToClipboard, Twitter} from '@skillrecordings/react'
import cx from 'classnames'
import {type MDXComponents as MDXComponentsType} from 'mdx/types'
import Image, {ImageProps} from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'
import toast from 'react-hot-toast'
import {useCopyToClipboard} from 'react-use'
import Balancer from 'react-wrap-balancer'
import {twMerge} from 'tailwind-merge'
import {MDXEditor, MDXTranspilePreview} from '../code-editor/mdx-editor'
import {useFeedback} from '@/feedback-widget/feedback-context'
import {cn} from '@skillrecordings/ui/utils/cn'
import {ChatAltIcon} from '@heroicons/react/outline'

export const MDXComponents = {
  TypeError: (props) => <TypeError {...props} />,
  Topics: (props) => <Topics {...props} />,
  Image: (props) => <DecorativeImage {...props} />,
  Section: (props) => <Section {...props} />,
  SectionHeading: (props) => <SectionHeading {...props} />,
  ErrorFromHell: (props) => <ErrorFromHell {...props} />,
  Testimonial: (props) => <Testimonial {...props} />,
  Module: (props) => <Module {...props} />,
  Editor: (props) => <MDXEditor {...props} />,
  TranspilePreview: (props) => <MDXTranspilePreview {...props} />,
} satisfies Record<string, React.FC<any>>

type TypeErrorProps = {
  children: React.ReactNode
  header?: React.ReactNode
}

const TypeError: React.FC<TypeErrorProps> = ({children, header}) => {
  return (
    <div className="mx-auto max-w-2xl border-y-2 border-[#E11D48] border-opacity-20 bg-[#1C1427] font-mono text-sm leading-relaxed text-white prose-p:max-w-none first-of-type:prose-p:mt-0 last-of-type:prose-p:mb-0 sm:rounded-md sm:border-2">
      {header && (
        <div className="border-b border-gray-800/50 px-5 py-3">{header}</div>
      )}
      <div className="not-prose px-5 py-5 sm:text-lg">{children}</div>
    </div>
  )
}

type TopicsProps = {
  children: React.ReactNode
  header?: React.ReactNode
}

const Topics: React.FC<TopicsProps> = ({children, header}) => {
  const childrenArr = React.Children.toArray(children)
  return (
    <div className="">
      <ul className="max-w-2xl">
        {childrenArr.map((children, i) => {
          return (
            <li
              key={i}
              className="relative -ml-2 list-none before:absolute before:left-0 before:h-full before:w-0.5 before:bg-cyan-300/80"
            >
              {children}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const SectionHeading: React.FC<any> = ({
  children,
  dividerTop = null,
  dividerBottom = null,
  className,
}) => {
  return (
    <div className="not-prose flex flex-col items-center px-5 pb-5 sm:pb-16">
      {/* {dividerTop && (
        <DecorativeImage
          alt=""
          src={dividerTop}
          width={1440 / 2}
          height={217 / 2}
          className="pointer-events-none select-none"
        />
      )} */}
      <h2
        className={cx(
          'mx-auto text-balance py-12 text-center font-heading text-4xl font-bold md:text-5xl',
          className,
        )}
      >
        {children}
      </h2>
      {/* {dividerBottom && (
        <DecorativeImage
          alt=""
          src={dividerBottom}
          width={1440 / 2}
          height={217 / 2}
          className="pointer-events-none select-none"
        />
      )} */}
    </div>
  )
}

const Section: React.FC<any> = ({
  children,
  backgroundImage,
  slot = null,
  className,
}) => {
  return (
    <section className={twMerge('relative w-full overflow-hidden', className)}>
      {slot}
      <div className={cx('relative z-10')}>{children}</div>
      {/* {backgroundImage && (
        <DecorativeImage
          src={backgroundImage}
          fill
          alt=""
          style={{
            marginTop: '0 !important',
          }}
          className="pointer-events-none z-0 mt-0 select-none object-cover object-top lg:object-contain"
        />
      )} */}
    </section>
  )
}

const ErrorFromHell: React.FC<any> = ({children}) => {
  return (
    <div className="relative mx-auto mt-10 max-w-3xl rounded-md border-2 border-[#E11D48] border-opacity-20 bg-[#1C1427] px-12 py-10 text-left font-mono text-sm leading-relaxed text-[#E7DFEB] text-white">
      <div className="relative z-10">{children}</div>
      <div className="pointer-events-none absolute left-[-85px] top-[-206px] select-none">
        <DecorativeImage
          alt=""
          src="/assets/landing/flame-corner-left@2x.png"
          width={970 / 2}
          height={868 / 2}
        />
      </div>
      <div className="pointer-events-none absolute bottom-[-52px] right-[-45px] select-none">
        <DecorativeImage
          alt=""
          src="/assets/landing/flame-corner-right@2x.png"
          width={482 / 2}
          height={868 / 2}
        />
      </div>
    </div>
  )
}

const DecorativeImage: React.FC<ImageProps> = (props) => {
  return <Image aria-hidden="true" quality={100} priority {...props} />
}

const Testimonial: React.FC<
  React.PropsWithChildren<{
    author: {name: string; image?: string}
    className?: string
  }>
> = ({children, className, author}) => {
  return (
    <div
      className={cn(
        'not-prose -mx-5 border-t px-5 py-5 sm:border-0 sm:py-0',
        className,
      )}
    >
      <blockquote className="relative flex h-full flex-col justify-between">
        <div
          className="text-base font-normal sm:text-balance sm:text-lg"
          // before:absolute before:bottom-9 before:right-8 before:flex before:items-center before:justify-center before:font-heading before:text-3xl before:font-extrabold before:leading-none before:text-cyan-300 before:content-['”']
        >
          {children}
        </div>
        {author?.name && (
          <div className="mt-5 flex items-center gap-3">
            {author.image && (
              <Image
                src={author.image}
                width={40}
                height={40}
                alt={author.name}
                className="rounded-full"
              />
            )}
            <span className="font-heading text-sm">{author.name}</span>
          </div>
        )}
      </blockquote>
    </div>
  )
}

const Module: React.FC<React.PropsWithChildren<any>> = ({
  title,
  slug,
  sub,
  image,
  metaLabel,
  children,
}) => {
  return (
    <div className="not-prose">
      <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center gap-5 md:flex-row">
        <Link
          href={`/workshops/${slug}`}
          className="flex flex-shrink-0 items-center justify-center md:items-start"
        >
          <Image src={image} alt={title} width={400} height={400} />
        </Link>
        <div className="px-5">
          <Link href={`/workshops/${slug}`}>
            <h3 className="text-center font-text text-3xl font-semibold sm:text-4xl md:text-left">
              {title}
            </h3>
          </Link>
          {/* {metaLabel && <p className="text-center md:text-left">{metaLabel}</p>} */}
          <h4 className="pt-2 text-center text-lg font-normal text-primary sm:text-xl sm:font-medium md:pt-3 md:text-left">
            {sub}
          </h4>
          <div className="flex flex-col space-y-3 pt-5 text-foreground sm:text-lg md:pt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export const ShareImageMDX: React.FC<{src: string}> = ({src}) => {
  const router = useRouter()

  return src ? (
    <section className="not-prose flex flex-col p-5 sm:-mx-5">
      <div className="relative flex items-center justify-center">
        <Link
          href={src}
          passHref
          target="_blank"
          rel="noopener"
          className="scale-90 rounded-xl border border-white/5 hover:cursor-pointer"
        >
          <img
            src={src}
            alt=""
            aria-hidden
            className="relative  transform rounded-xl  shadow-2xl transition-all duration-500 ease-in-out"
          />
          <div className="pointer-events-none absolute left-0 top-0 h-full w-full  rounded-xl bg-gradient-to-tr from-transparent to-white/40 mix-blend-overlay" />
        </Link>
      </div>
      <div className="-mt-24 flex w-full items-center justify-center gap-5 rounded-lg border border-white/5 bg-white/5 pb-10 pt-24">
        <Twitter
          svgClassName="text-cyan-500 w-4 h-4"
          className="mt-0 flex items-center gap-1.5 text-base text-gray-300 transition hover:text-white"
          link={process.env.NEXT_PUBLIC_URL + router.asPath}
          message={''}
        >
          Share on Twitter
        </Twitter>
        <CopyToClipboard
          link={src}
          className="text-base text-gray-300 transition hover:text-white"
          svgClassName="hidden"
          onSuccess={() => toast.success('Copied')}
        >
          Copy image url
        </CopyToClipboard>
      </div>
    </section>
  ) : null
}

interface LinkedHeadingProps extends React.HTMLProps<HTMLHeadingElement> {
  as?: Extract<
    keyof JSX.IntrinsicElements,
    'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  >
}

export const LinkedHeading: React.FC<LinkedHeadingProps> = ({
  as = 'h2',
  ...props
}) => {
  const [state, copyToClipboard] = useCopyToClipboard()
  const linkToTitle = `#${props.id}`

  const handleOnClick = () => {
    if (isBrowser()) {
      const url = window.location.href
      const hash = window.location.hash
      const strippedUrl = url.replace(hash, '')

      copyToClipboard(strippedUrl + linkToTitle)
      toast.success('Copied')
    }
  }

  const newChildren = (
    <>
      <a
        href={linkToTitle}
        className="absolute left-[-1.5ch] pr-3 !text-gray-600 no-underline opacity-0 transition group-hover:opacity-100 hover:!text-cyan-300"
        aria-hidden="true"
      >
        #
      </a>
      {props.children}
    </>
  )

  const H = () =>
    React.createElement(
      as,
      {
        className: 'group cursor-pointer relative scroll-mt-20',
        onClick: handleOnClick,
        ...props,
      },
      props.children,
    )

  return (
    <span className="group">
      <a
        href={linkToTitle}
        className="absolute left-[-1.5ch] pr-3 !text-gray-600 no-underline opacity-0 transition group-hover:opacity-100 hover:!text-cyan-300"
        aria-hidden="true"
      >
        #
      </a>
      <H />
    </span>
  )
}

export const linkedHeadingComponents: MDXComponentsType = {
  h1: (props) => <LinkedHeading as="h1" {...props} />,
  h2: (props) => <LinkedHeading as="h2" {...props} />,
  h3: (props) => <LinkedHeading as="h3" {...props} />,
  h4: (props) => <LinkedHeading as="h4" {...props} />,
}

export const FeedbackFormButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
  const {setIsFeedbackDialogOpen} = useFeedback()
  return (
    <button
      {...props}
      type="button"
      className={cn(
        'flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-center text-base font-semibold text-primary-foreground transition hover:brightness-105',
        props.className,
      )}
      onClick={() => {
        setIsFeedbackDialogOpen(true)
      }}
    >
      {props.children ? (
        props.children
      ) : (
        <>
          <ChatAltIcon aria-hidden="true" className="h-5 w-5" />{' '}
          {'Send Me a Message'}
        </>
      )}
    </button>
  )
}
