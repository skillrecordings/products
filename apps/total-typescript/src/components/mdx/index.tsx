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
  TypeErrorSection: (props) => <TypeErrorSection {...props} />,
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
    <div className={cn('not-prose -mx-5 px-5 py-5 sm:py-0', className)}>
      <blockquote className="relative flex h-full flex-col justify-between">
        <div
          className="text-base font-normal leading-relaxed text-foreground sm:text-balance sm:text-lg sm:leading-relaxed lg:text-xl lg:leading-relaxed [&_strong]:font-semibold [&_strong]:text-white"
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
            <span className="text-sm sm:text-base">{author.name}</span>
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
      <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center gap-5 md:flex-row md:items-start">
        <Link
          href={`/workshops/${slug}`}
          className="flex flex-shrink-0 items-center justify-center md:items-start"
        >
          <Image src={image} alt={title} width={300} height={300} />
        </Link>
        <div className="px-5 md:pt-5">
          <Link href={`/workshops/${slug}`}>
            <h3 className="text-balance text-center font-text text-3xl font-semibold sm:text-4xl md:text-left">
              {title}
            </h3>
          </Link>
          {/* {metaLabel && <p className="text-center md:text-left">{metaLabel}</p>} */}
          <h4 className="text-balance pt-2 text-center text-lg font-normal text-primary sm:text-xl sm:font-medium md:pt-3 md:text-left lg:text-2xl">
            {sub}
          </h4>
          <div className="flex flex-col space-y-5 pt-5 leading-relaxed text-foreground sm:text-lg sm:leading-relaxed md:pt-8 lg:text-xl lg:leading-relaxed">
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

const TypeErrorSection = () => {
  return (
    <section className="relative bg-gradient-to-t from-background via-[#191427] to-[#191427] selection:bg-[#CC5344] selection:text-white">
      <div className="relative z-10 overflow-x-hidden">
        <div className="pb-16 pt-0 md:pb-64 md:pt-32">
          <div className="not-prose flex flex-col gap-8 bg-gradient-to-b from-[#866583] to-white bg-clip-text text-center font-heading font-normal text-transparent md:scale-150">
            <p className="text-lg">The feature’s working.</p>
            <p className="text-xl">The tests are passing.</p>
            <p className="text-2xl">But your IDE is a sea of red lines.</p>
            <p className="text-balance text-3xl font-semibold">
              TypeScript’s not happy again.
            </p>
          </div>
        </div>

        <div className="not-prose flex flex-col items-center gap-5 text-center text-[#CCC4E0]">
          <p>You move on to the next error:</p>
          <p className="text-balance font-heading text-3xl font-semibold text-white md:text-5xl">
            “What on earth is this?”
          </p>
          <p>you think to yourself.</p>
        </div>

        <ErrorFromHell>
          {`Element implicitly has an ‘any’ type because expression of type ‘string’ can’t be used to index type ‘{ string: string | undefined; }’`}
          <br />
          <br />
          {`No index signature with a parameter of type ‘string’ was found on type ‘{ string: string | undefined; }’`}
        </ErrorFromHell>

        <div className="not-prose mx-auto mt-16 flex w-full flex-col items-center justify-center gap-5 text-center text-white">
          <p className="max-w-2xl text-balance [&_strong]:font-semibold">
            <strong>It’s impossible to Google.</strong> Every search result is
            either <strong>"here’s 100 lines of complex code"</strong> or{' '}
            <strong>"here's a solution that doesn't work”</strong>
          </p>
          <p className="text-balance py-3 italic text-[#CCC4E0]">
            You contemplate the absurd amount of hours you spend solving these
            problems.
          </p>
          <p className="">You'd rather give up than deal with another:</p>
        </div>

        <Image
          src={require('../../../public/assets/landing/ts-errors@2x.png')}
          width={756}
          height={483}
          className="relative mx-auto mb-0 -translate-y-10 md:-translate-y-16"
          alt="TypeScript Error: The intersection 'User & PublicUser' was reduced to 'never' because property 'email' has conflicting types in some constituents."
        />
      </div>
      <Image
        alt="sea of red lines"
        aria-hidden="true"
        src={require('../../../public/assets/landing/bg-sea-of-red-lines@2x.png')}
        fill
        className="z-0 object-contain object-top mix-blend-lighten"
      />
    </section>
  )
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
