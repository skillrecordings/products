import Layout from '@/components/app/layout'
import {Button} from '@skillrecordings/ui'
import {GetStaticProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import ExamplesMDX from './examples.mdx'
import RulesMDX from './rules.mdx'
import {motion, useReducedMotion} from 'framer-motion'
import {
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from '@skillrecordings/ui'
import {ReactMarkdown} from 'react-markdown/lib/react-markdown'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {MDXProvider} from '@mdx-js/react'
import hljs from 'highlight.js'
import {CheckIcon} from '@heroicons/react/solid'
import React from 'react'
import Head from 'next/head'

hljs.registerLanguage(
  'typescript',
  require('highlight.js/lib/languages/typescript'),
)

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {content: {examples: null}},
    revalidate: 10,
  }
}

type PageProps = {
  content: {
    examples: MDXRemoteSerializeResult
  }
}

const TSResetLandingPage: React.FC<PageProps> = ({content}) => {
  const getStartedRef = React.useRef<HTMLDivElement>(null)

  return (
    <MDXProvider
      components={{
        pre: (props: any) => {
          const codeElement = props.children.props.children
          const highlightedCode = hljs.highlight(codeElement, {
            language: 'typescript',
          })

          return (
            <pre className="overflow-x-auto rounded border border-white/5 bg-gray-900 scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-white/20">
              <code dangerouslySetInnerHTML={{__html: highlightedCode.value}} />
            </pre>
          )
        },
      }}
    >
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/night-owl.min.css"
        />
      </Head>
      <Layout
        meta={{
          title: `TS Reset - Official Docs`,
          ogImage: {
            url: 'https://res.cloudinary.com/total-typescript/image/upload/v1693411308/ts-reset-card_2x_p42z2y.png',
          },
        }}
      >
        <Header getStartedRef={getStartedRef} />
        <main className="-mb-16 overflow-hidden md:mb-0">
          <Features />
          <div />
          <GetStarted ref={getStartedRef} />
          <CTA />
          <Examples />
          <Rules />
        </main>
      </Layout>
    </MDXProvider>
  )
}

export default TSResetLandingPage

const GetStarted = React.forwardRef<HTMLDivElement>((props, ref) => {
  const container = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.3,
        type: 'easeInOut',
        duration: 1,
      },
    },
  }

  const item = {
    hidden: {opacity: 0, x: -50},
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        damping: 10,
      },
    },
  }

  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      ref={ref}
      id="get-started"
      className="flex flex-col items-center bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 pb-28 pt-5 md:pt-16"
    >
      <h2 className="pb-20 text-center font-heading text-4xl font-semibold sm:text-5xl">
        Get Started
      </h2>
      <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center sm:pl-32">
        <motion.ul
          variants={!shouldReduceMotion ? container : undefined}
          initial="hidden"
          whileInView="show"
          viewport={{once: true}}
          className="relative space-y-16 from-gray-800 via-gray-800 to-emerald-300 px-5 before:absolute before:h-full before:bg-gradient-to-b before:content-[''] sm:px-0 sm:before:-ml-20 sm:before:w-px"
        >
          <motion.li
            variants={!shouldReduceMotion ? item : undefined}
            className="group relative flex flex-col items-center space-y-2 sm:items-start"
          >
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gray-800 bg-gray-950 text-2xl font-light text-gray-500 transition group-hover:text-cyan-300 sm:absolute sm:-ml-28">
              01
            </div>
            <h3 className="pt-10 sm:pt-0 sm:text-lg">Install</h3>
            <pre className="inline-block rounded border border-white/5 bg-white/10 py-3 pl-4 pr-5 font-mono text-sm">
              npm i -D @total-typescript/ts-reset
            </pre>
          </motion.li>
          <motion.li
            variants={!shouldReduceMotion ? item : undefined}
            className="group relative flex flex-col items-center space-y-2 sm:items-start"
          >
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gray-800 bg-gray-950 text-2xl font-light text-gray-500 transition group-hover:text-cyan-300 sm:absolute sm:-ml-28">
              02
            </div>
            <h3 className="pt-10 text-center sm:pt-0 sm:text-left sm:text-lg">
              Create a <code>reset.d.ts</code> file in your project with these
              contents:
            </h3>
            <div>
              <pre className="inline-block w-80 overflow-x-auto rounded border border-white/5 bg-white/10 py-3 pl-4 pr-5 font-mono text-xs leading-relaxed scrollbar-thin sm:w-full sm:text-sm">
                <div className="text-gray-500">
                  {'// Do not add any other lines of code to this file!'}
                </div>
                <span>
                  <span className="text-[#F97C79]">import</span>{' '}
                  {'"@total-typescript/ts-reset";'}
                </span>
              </pre>
            </div>
          </motion.li>
          <motion.li
            variants={!shouldReduceMotion ? item : undefined}
            className="group relative flex flex-col items-center justify-center space-y-2 sm:items-start"
          >
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gray-800 bg-gray-950 text-2xl font-light text-gray-500 transition group-hover:text-cyan-300 sm:absolute sm:-ml-28">
              <Image
                src={require('../../../public/assets/circle-check@2x.png')}
                aria-hidden
                alt=""
                width={64}
              />
              <CheckIcon className="absolute w-6 text-white" />
            </div>
            <h3 className="pb-2.5 pt-10 text-center sm:pt-0 sm:text-left sm:text-lg">
              Enjoy improved typings across your entire project!
            </h3>
          </motion.li>
        </motion.ul>
      </div>
    </section>
  )
})

const withoutTsReset = [
  {
    icon: '🚨',
    text: (
      <>
        <code>.json</code> (in fetch) and <code>JSON.parse</code> both return{' '}
        <code>any</code>
      </>
    ),
  },
  {
    icon: '🤦',
    text: (
      <>
        <code>.filter(Boolean)</code> doesn't behave how you expect
      </>
    ),
  },
  {
    icon: '😡',
    text: (
      <>
        <code>array.includes</code> often breaks on readonly arrays
      </>
    ),
  },
]
const withTsReset = [
  {
    icon: '👍',
    text: (
      <>
        <code>.json</code> (in fetch) and <code>JSON.parse</code> return{' '}
        <code>unknown</code>
      </>
    ),
  },
  {
    icon: '✅',
    text: (
      <>
        <code>.filter(Boolean)</code> behaves EXACTLY how you expect
      </>
    ),
  },
  {
    icon: '🥹',
    text: (
      <>
        <code>array.includes</code> is widened to be more ergonomic
      </>
    ),
  },
  {
    icon: '🚀',
    text: <>And several more improvements!</>,
  },
]

export const RuleItem: React.FC<React.PropsWithChildren<{title: string}>> = ({
  children,
  title,
}) => {
  return (
    <AccordionItem
      value={title}
      className="-mx-5 border-b-0 odd:bg-gray-900/50 data-[state='open']:bg-gray-900 [&>h3>button>p]:mt-0 [&>h3]:my-0"
    >
      <AccordionHeader>
        <AccordionTrigger className="px-5 py-3 text-left text-base font-normal text-white opacity-100 transition hover:bg-gray-900 sm:py-5 sm:text-lg">
          <ReactMarkdown>{title}</ReactMarkdown>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent className="border-gray-white/5 prose w-full max-w-none border-t px-6 pb-10 pt-5 text-lg prose-p:text-gray-300 prose-pre:text-sm">
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}

const Header: React.FC<{getStartedRef: any}> = ({getStartedRef}) => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <header className="relative mx-auto flex w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 px-5 pt-24 md:flex-row md:px-16 lg:px-0 lg:pl-32">
      <div className="relative z-10 flex w-full flex-col pb-16 text-center sm:text-left lg:w-auto">
        <motion.h1
          initial={!shouldReduceMotion ? {opacity: 0, x: -30} : undefined}
          animate={!shouldReduceMotion ? {opacity: 1, x: 0} : undefined}
          transition={{
            type: 'spring',
            damping: 10,
            duration: 1,
          }}
          className="whitespace-nowrap font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-7xl"
        >
          TS Reset
        </motion.h1>
        <motion.h2
          initial={!shouldReduceMotion ? {opacity: 0, x: -30} : undefined}
          animate={!shouldReduceMotion ? {opacity: 1, x: 0} : undefined}
          transition={{
            type: 'spring',
            damping: 10,
            duration: 1,
            delay: 0.15,
          }}
          className="pt-2 font-text text-2xl text-gray-300 sm:max-w-sm sm:text-3xl md:text-2xl lg:text-3xl"
        >
          TypeScript's Built-In
          <br />
          Typings, Improved
        </motion.h2>
        <motion.div
          initial={{opacity: 0, x: -30}}
          animate={{opacity: 1, x: 0}}
          transition={{
            type: 'spring',
            damping: 10,
            duration: 1,
            delay: 0.3,
          }}
          className="mt-10 flex items-center justify-center gap-3 sm:justify-start lg:mt-16"
        >
          <Button
            onClick={() => {
              scrollTo({
                // top: document.getElementById('get-started').offsetTop,
                top: getStartedRef?.current?.offsetTop,
                behavior: 'smooth',
              })
            }}
            className="bg-gradient-to-t from-[#FF615C] to-[#FF928F] px-5 py-4 font-semibold text-white shadow-[inset_0_2px_4px_0_rgb(255,255,255/0.05)] transition"
          >
            <span className="drop-shadow-sm">Get Started</span>
          </Button>
          <Button asChild>
            <Link
              href="https://github.com/total-typescript/ts-reset"
              target="_blank"
              className="gap-1.5 border border-gray-700 bg-transparent px-5 py-4 font-semibold text-white shadow-[inset_0_2px_4px_0_rgb(255,255,255/0.05)] transition hover:bg-gray-900"
            >
              <Icon name="Github" className="h-4 w-4" />{' '}
              <span className="drop-shadow-sm">GitHub</span>
            </Link>
          </Button>
        </motion.div>
      </div>
      <div className="relative z-0 -mt-16 w-[600px] flex-shrink-0 md:-mr-16 md:mt-0 md:w-[450px] lg:-ml-24 lg:mr-0 lg:w-auto">
        <Image
          src={require('../../../public/assets/ts-reset@2x.png')}
          quality={100}
          alt="TS Reset by Matt Pocock"
          className="pointer-events-none select-none"
          width={760}
          placeholder="empty"
          priority
        />
      </div>
      <Image
        src={require('../../../public/assets/landing/bg-divider-1.png')}
        className="pointer-events-none select-none object-contain object-top"
        fill
        aria-hidden
        alt=""
      />
    </header>
  )
}

const Features = () => {
  return (
    <section className="relative flex w-full scale-105 flex-col items-center justify-center bg-gray-950 py-24">
      <div className="relative z-10 scale-90 rounded-lg bg-gray-800 px-10 pb-16 pt-8 md:translate-x-[-15%] md:-rotate-3 md:scale-100 md:pb-10">
        <h3 className="absolute left-0 top-0 -translate-y-2/3 rounded-t-lg bg-gray-800 px-5 py-3 text-sm font-medium uppercase">
          without ts-reset
        </h3>
        <ul className="flex flex-col space-y-2 text-lg text-gray-200">
          {withoutTsReset.map((item) => {
            return (
              <li
                key={item.icon}
                className={`relative [&>code]:rounded-sm [&>code]:bg-gray-900 [&>code]:px-1.5 [&>code]:py-1`}
              >
                <span className="pr-2">{item.icon}</span> {item.text}
              </li>
            )
          })}
        </ul>
      </div>
      <div className="relative z-10 -mt-5 rounded-lg bg-gray-50 px-10 py-8 text-gray-900 shadow-2xl shadow-gray-950 md:mt-5 md:translate-x-[18%] md:rotate-2">
        <h3 className="absolute left-0 top-0 -translate-y-2/3 rounded-t-lg bg-gray-50 px-5 py-3 text-sm font-medium uppercase text-background">
          with ts-reset
        </h3>
        <ul className="flex flex-col space-y-2 text-lg text-gray-700">
          {withTsReset.map((item) => {
            return (
              <li
                key={item.icon}
                className={`relative [&>code]:rounded-sm [&>code]:bg-gray-200 [&>code]:px-1.5 [&>code]:py-1`}
              >
                <span className="pr-2">{item.icon}</span> {item.text}
              </li>
            )
          })}
        </ul>
      </div>
      <Image
        src={require('../../../public/assets/ts-reset-features-bg.png')}
        alt=""
        aria-hidden
        fill
        className="object-contain"
      />
      <div className="absolute top-1/2 h-48 w-2/3 rounded-full bg-gray-600 opacity-60 blur-[100px]" />
    </section>
  )
}

const CTA = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="level-up"
      className="relative flex flex-col-reverse items-center justify-center border-y border-white/10 bg-gray-950 pb-20 pt-0 text-center sm:flex-row sm:justify-center sm:pb-0 sm:pl-24 sm:pt-0 sm:text-left"
    >
      <motion.div
        initial={{x: shouldReduceMotion ? 0 : -30}}
        viewport={{once: true}}
        whileInView={
          !shouldReduceMotion
            ? {
                x: [-30, 0],
                transition: {
                  duration: 1.5,
                  type: 'spring',
                },
              }
            : undefined
        }
        className="flex max-w-lg flex-col items-center sm:items-start"
      >
        <h2 className="pb-4 font-heading text-3xl sm:text-4xl lg:text-5xl">
          Become the
          <div className="font-semibold">TypeScript Wizard</div>
          at Your Company
        </h2>
        <h3 className="max-w-[320px] font-light leading-relaxed text-gray-300">
          A collection of professional, exercise-driven, in-depth, self-paced
          TypeScript workshops for you to achieve TypeScript wizardry.
        </h3>
        <Button asChild>
          <Link
            className="mt-10 inline-flex rounded bg-white px-6 py-5 font-semibold"
            href="/typescript-learning-path"
          >
            Embark on Your TypeScript Adventure
          </Link>
        </Button>
      </motion.div>
      <motion.div
        viewport={{once: true}}
        whileInView={
          !shouldReduceMotion
            ? {
                rotate: [65, 0],
                scale: [0.5, 1],
                opacity: [0, 1],
                transition: {
                  duration: 2,
                  type: 'spring',
                },
              }
            : undefined
        }
        className="pointer-events-none select-none sm:-ml-16"
      >
        <Image
          src={require('../../../public/assets/tt-learning-path-compass@2x.png')}
          alt="total typescript learning path"
          width={600}
          placeholder="blur"
        />
      </motion.div>
    </section>
  )
}

const Examples = () => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <section className="w-full bg-gray-950/50 py-0 sm:py-16">
      <motion.div
        initial={!shouldReduceMotion ? {y: -50, opacity: 0} : undefined}
        viewport={{once: true}}
        whileInView={
          !shouldReduceMotion
            ? {
                y: [-50, 0],
                opacity: [0, 1],
                transition: {
                  duration: 1,
                  type: 'spring',
                },
              }
            : undefined
        }
        className="prose mx-auto grid w-full max-w-screen-lg grid-cols-1 flex-col items-start justify-start gap-10 px-5 prose-h3:mt-10 prose-p:mb-0 prose-pre:mb-0 prose-pre:w-full sm:grid-cols-2 lg:px-0"
      >
        <ExamplesMDX />
      </motion.div>
    </section>
  )
}

const Rules = () => {
  const shouldReduceMotion = useReducedMotion()
  return (
    <section className="w-full bg-gray-950/50 px-5 pb-16 pt-10 lg:px-0">
      <motion.div
        initial={!shouldReduceMotion ? {y: -50, opacity: 0} : undefined}
        viewport={{once: true}}
        whileInView={
          !shouldReduceMotion
            ? {
                y: [-50, 0],
                opacity: [0, 1],
                transition: {
                  duration: 1,
                  type: 'spring',
                },
              }
            : undefined
        }
      >
        <h2 className="mx-auto w-full max-w-screen-md pb-10 font-heading text-5xl font-semibold">
          Rules
        </h2>
        <div className="prose mx-auto flex w-full max-w-screen-md flex-col items-start justify-start space-y-16 prose-h3:mt-10 prose-p:mb-0 prose-pre:mb-0 prose-pre:w-full">
          <RulesMDX />
        </div>
      </motion.div>
    </section>
  )
}
