import Layout from '@/components/app/layout'
import React from 'react'
import {useCopyToClipboard} from 'react-use'
import {twMerge} from 'tailwind-merge'
import {renderToString} from 'react-dom/server'
import toast from 'react-hot-toast'
import cx from 'classnames'
import {Logo} from '@/components/logo'

const BrandPage = () => {
  return (
    <Layout
      meta={{
        title: 'Brand Assets',
        openGraph: {
          images: [{url: process.env.NEXT_PUBLIC_URL + '/logo-card@2x.jpg'}],
        },
      }}
    >
      <header className="mx-auto w-full max-w-screen-lg px-5 pb-3 pt-16 sm:pb-5 sm:pt-32">
        <h1 className="text-center font-serif text-4xl font-semibold sm:text-5xl">
          Brand Assets
        </h1>
      </header>
      <main className="mx-auto w-full max-w-screen-lg space-y-24 px-5 pb-32 pt-10">
        <Logos />
      </main>
    </Layout>
  )
}

export default BrandPage

const Logos = () => {
  return (
    <div>
      {/* <h2 className="w-full border-b border-black/5 pb-2 text-2xl font-bold dark:border-white/5">
        DevRel.fyi
      </h2> */}
      <section className="space-y-12 pt-12">
        <article>
          <h3 className="pb-2 font-mono text-xs font-semibold uppercase tracking-wide">
            Logo Mark
          </h3>
          <Grid>
            <LogoCard
              className="bg-gray-900 dark:bg-gray-900/75"
              logo={<Logo variant="dark" className="w-40" />}
            />
            <LogoCard
              className="bg-white"
              logo={<Logo variant="light" className="w-40" />}
            />
          </Grid>
        </article>
      </section>
    </div>
  )
}

const LogoCard: React.FC<
  React.PropsWithChildren<{logo: React.ReactElement; className?: string}>
> = ({className, logo}) => {
  const [copiedState, setCopied] = useCopyToClipboard()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const grayscaleLogo = React.createElement(logo.type, {
    ...logo.props,
    isGrayscale: true,
  })
  const [isGrayscale, setIsGrayscale] = React.useState(false)
  const logoEl = React.createElement(logo.type, {
    ...logo.props,
    isGrayscale,
  })
  return (
    <div>
      <div
        ref={ref}
        tabIndex={0}
        onMouseOver={() => {
          setIsExpanded(true)
        }}
        onMouseOut={() => {
          setIsExpanded(false)
        }}
        onFocus={() => {
          setIsExpanded(true)
        }}
        onBlur={(e) => {
          if (ref.current && !ref.current.contains(e.relatedTarget as Node)) {
            setIsExpanded(false)
          }
        }}
        className={twMerge(
          'relative flex aspect-video items-center justify-center rounded',
          className,
        )}
      >
        {logoEl}
        {isExpanded && (
          <div
            className={cx(
              'absolute bottom-3 right-3 flex items-center gap-2 text-black',
            )}
          >
            {/* <div className="py-1 pl-2 font-mono text-xs uppercase text-gray-500">
              Copy SVG:
            </div> */}
            <button
              type="button"
              key={logo.props.variant}
              className="rounded bg-gray-100 px-2 py-1 font-mono text-xs font-medium uppercase hover:underline"
              onClick={() => {
                setCopied(renderToString(logo))
                !copiedState.error && toast.success('Copied to clipboard')
              }}
            >
              Copy SVG
            </button>
            {/* <button
              onMouseOver={() => {
                setIsGrayscale(true)
              }}
              onMouseOut={() => {
                setIsGrayscale(false)
              }}
              onFocus={() => {
                setIsGrayscale(true)
              }}
              onBlur={(e) => {
                setIsGrayscale(false)
              }}
              type="button"
              key={logo.props.variant}
              className="rounded bg-gray-100 px-2 py-1 font-mono text-xs font-medium uppercase hover:underline"
              onClick={() => {
                setCopied(renderToString(grayscaleLogo))
                !copiedState.error && toast.success('Copied to clipboard')
              }}
            >
              Grayscale
            </button> */}
          </div>
        )}
      </div>
    </div>
  )
}

const Grid: React.FC<React.PropsWithChildren> = ({children}) => {
  return <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{children}</div>
}

const LogoMark: React.FC<{
  variant?: 'light' | 'dark'
  isGrayscale?: boolean
}> = ({variant = 'light', isGrayscale = false}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="70"
      height="70"
      fill="none"
      viewBox="0 0 70 70"
    >
      <path
        fill={
          variant === 'light'
            ? isGrayscale
              ? '#FFF'
              : 'url(#markGradient)'
            : isGrayscale
            ? '#000'
            : 'url(#markGradient)'
        }
        d="M36.277 33.738a64.504 64.504 0 0 1-4.257 2.15c-6.333 2.912-15.383 5.86-26.228 5.981l-1.249.014-.226-1.228a31.016 31.016 0 0 1-.531-5.638C3.786 17.804 17.787 3.802 35 3.802a31.05 31.05 0 0 1 13.295 2.975l4.146-2.113A34.774 34.774 0 0 0 35 0C15.712 0 0 15.712 0 35c0 7.7 2.504 14.83 6.74 20.617 7.252-1.235 11.802-4.14 11.802-4.14s-2.905 4.544-4.14 11.798A34.803 34.803 0 0 0 35 70c19.288 0 35-15.712 35-35a34.778 34.778 0 0 0-4.652-17.42l-2.11 4.138a31.037 31.037 0 0 1 2.976 13.299C66.214 52.23 52.213 66.23 35 66.23c-1.942 0-3.804-.196-5.635-.53l-1.231-.225.014-1.251c.12-10.854 3.069-19.903 5.98-26.234a64.386 64.386 0 0 1 2.149-4.253Z"
      />
      <path
        fill={variant === 'light' ? '#FFF' : isGrayscale ? '#000' : '#333753'}
        d="m53.235 27.155-8.03-2.344-2.345-8.047L69.5.5 53.235 27.155Z"
      />
      <defs>
        <linearGradient
          id="markGradient"
          x1="49.496"
          x2="20.585"
          y1="20.504"
          y2="49.431"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4F75FF" />
          <stop offset="1" stopColor="#30AFFF" />
        </linearGradient>
      </defs>
    </svg>
  )
}
