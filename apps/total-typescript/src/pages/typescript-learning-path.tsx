import React from 'react'
import Layout from '@/components/app/layout'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import cx from 'classnames'

const TypeScriptLearningPath = () => {
  const title = 'TypeScript Learning Path'
  return (
    <Layout
      className="overflow-hidden"
      meta={{
        title,
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1682606861/typescript-learning-path-card_2x_yx6pt2.png',
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-4xl flex-col-reverse items-center justify-between px-8 md:flex-row md:pt-0">
        <div className="text-center md:-mr-16">
          <h1 className="mb-4 w-full font-text text-4xl font-bold leading-tight md:mt-0 lg:-mt-16 lg:text-6xl">
            <span className="block pb-2 font-text text-base font-medium text-cyan-300  sm:text-xl">
              Total TypeScript
            </span>{' '}
            <span className="sm:text-nowrap">Learning Path</span>
          </h1>
          <p className="font-text text-base font-normal opacity-75 sm:text-xl">
            From Beginner To Wizard
          </p>
        </div>
        <div className="flex items-center justify-center md:-mr-48">
          <Image
            src={require('../../public/assets/tt-learning-path-compass@2x.png')}
            alt=""
            aria-hidden="true"
            placeholder="blur"
            width={700}
            height={700}
            quality={100}
          />
        </div>
      </header>
      <main className="mx-auto mt-16 w-full max-w-screen-sm px-5 pb-24 md:-mt-24">
        <article className="prose w-full max-w-none prose-headings:font-medium prose-h2:mb-2 prose-h2:mt-8 prose-h2:text-xl prose-p:text-lg prose-ul:list-inside prose-ul:pl-0 prose-li:text-lg">
          <h2>Goal</h2>
          <p>
            Learn the TypeScript skills you need to ship any application or
            library.
          </p>
          <div className="flex flex-col sm:flex-row sm:gap-5">
            <div>
              <h2>Requirements</h2>
              <ul>
                <li>Basic knowledge of JavaScript</li>
                <li>Internet Access</li>
                <li>Access to the Complete Volume of Total TypeScript</li>
              </ul>
            </div>
            <div>
              <h2>Total Time Required</h2>
              <p>22—65 hours (varies)</p>
            </div>
          </div>
          <h2>Curriculum</h2>
          <CompleteVolume />
          <h2>Background</h2>
          <p>
            The tutorials and workshops were designed and tested as half-day
            workshops before being produced as a full-length self-paced course.
            The course is designed to be completed in 13 weeks, but you can go
            at your own pace. We estimate that it will take about 2-4 hours per
            week to complete the course content.
          </p>
          <h2>Teams</h2>
          <p>
            Learning as a team, club, or party is highly recommended. We've seen
            great results with teams of 2-4 people. We suggest that learning
            teams watch and work through the course before meeting once a week
            to discuss what they've learned in the shared context of the team.
            We've found that this approach is more effective than watching the
            course together as a group!
          </p>
          {/* <Skip /> */}
        </article>
        {/* <Section week="1—2">
          <Module
            slug="/workshops/typescript-pro-essentials"
            type="workshop"
            title="Pro Essentials"
            image="https://cdn.sanity.io/images/z9io1e0u/production/80da574ffbb12904f823723d5ea0a8e20add0270-1200x1200.png"
            meta="200+ lessons"
            weeks={[]}
          />
        </Section> */}
        <Section week="1—2">
          <Module
            slug="/tutorials/beginners-typescript"
            type="tutorial"
            title="Beginner's TypeScript"
            image="https://res.cloudinary.com/total-typescript/image/upload/v1664459604/beginners-typescript-tutorial/beginners-typescript_wsl11a.png"
            meta="18 exercises"
            weeks={[
              {
                index: 1,
                title: (
                  <Link
                    href="/tutorials/beginners-typescript/beginner-s-typescript-section/implicit-any-type-error"
                    className="text-cyan-300 underline"
                  >
                    Exercises 1—9
                  </Link>
                ),
                topics: ['Basic types', 'Basic annotations', 'Arrays'],
              },
              {
                index: 2,
                title: (
                  <Link
                    href="/tutorials/beginners-typescript/beginner-s-typescript-section/passing-type-arguments"
                    className="text-cyan-300 underline"
                  >
                    Exercises 10—18
                  </Link>
                ),
                topics: [
                  'Union types intro',
                  'Typing functions',
                  'Typing async functions',
                  'Creating types from other types',
                ],
              },
            ]}
          />
        </Section>
        <Section week="3—5" align="start">
          <Module
            slug="/workshops/type-transformations"
            title="Type Transformations"
            image="https://res.cloudinary.com/total-typescript/image/upload/v1669368980/type-transformations-workshop/type-transformations-illustration_fxedc0.png"
            meta="7 sections, 55 exercises"
            weeks={[
              {
                index: 3,
                title: (
                  <>
                    Type Transformations <br />
                    <Link
                      href="/workshops/type-transformations/inference-basics/type-transformations-workshop-welcome"
                      className="text-cyan-300 underline"
                    >
                      Section 1—2
                    </Link>
                  </>
                ),
                topics: [
                  'Intro to type helpers',
                  'keyof, typeof, Return Type',
                  'Unions, discriminated unions',
                  'Indexed access to types',
                ],
              },
              {
                index: 4,
                title: (
                  <>
                    Type Transformations <br />
                    <Link
                      href="/workshops/type-transformations/template-literals/only-allow-specified-string-patterns"
                      className="text-cyan-300 underline"
                    >
                      Section 3—4
                    </Link>
                  </>
                ),
                topics: [
                  'Template literals',
                  'Build your own type helpers',
                  "Intro to 'generics' in types",
                ],
              },
              {
                index: 5,
                title: (
                  <>
                    Type Transformations <br />
                    <Link
                      href="/workshops/type-transformations/conditional-types-and-infer/add-conditional-logic-to-a-type-helper"
                      className="text-cyan-300 underline"
                    >
                      Section 5—6
                    </Link>
                  </>
                ),
                topics: [
                  'Conditional types',
                  'infer keyword',
                  'Mapped types',
                  'Transforming unions using mapped types',
                ],
              },
            ]}
          />
        </Section>
        <Section week="6—8" align="end">
          <Module
            slug="/workshops/typescript-generics"
            title="TypeScript Generics"
            image="https://res.cloudinary.com/total-typescript/image/upload/v1682599825/typescript-generics_zijmdd.png"
            meta="6 sections, 49 exercises"
            weeks={[
              {
                index: 6,
                title: (
                  <>
                    TypeScript Generics <br />
                    <Link
                      href="/workshops/typescript-generics/intro-to-generics/typescript-generics-workshop-welcome"
                      className="text-cyan-300 underline"
                    >
                      Section 1—2
                    </Link>
                  </>
                ),
                topics: [
                  'Intro to generics in functions & classes',
                  'Manually passing type arguments to functions',
                ],
              },
              {
                index: 7,
                title: (
                  <>
                    TypeScript Generics <br />
                    <Link
                      href="/workshops/typescript-generics/the-art-of-type-arguments/generics-at-different-levels"
                      className="text-cyan-300 underline"
                    >
                      Section 3—4
                    </Link>
                  </>
                ),
                topics: [
                  'Understanding type arguments',
                  'Spotting missing/useless generics',
                ],
              },
              {
                index: 8,
                title: (
                  <>
                    TypeScript Generics <br />
                    <Link
                      href="/workshops/typescript-generics/function-overloads/what-is-a-function-overload"
                      className="text-cyan-300 underline"
                    >
                      Section 5—6
                    </Link>
                  </>
                ),
                topics: ['Function overloads', 'Generics challenges'],
              },
            ]}
          />
        </Section>
        <Section week="9—12" align="start">
          <Module
            slug="/workshops/advanced-typescript-patterns"
            title="Advanced TypeScript Patterns"
            image="https://res.cloudinary.com/total-typescript/image/upload/v1682600137/advanced-typescript-patterns_tm9vzh.png"
            meta="7 sections, 45 exercises"
            weeks={[
              {
                index: 9,
                title: (
                  <>
                    Advanced Patterns{' '}
                    <Link
                      href="/workshops/advanced-typescript-patterns/branded-types/advanced-workshop-welcome"
                      className="text-cyan-300 underline"
                    >
                      Section 1—2
                    </Link>
                  </>
                ),
                topics: ['Branded types', 'Understanding globals'],
              },
              {
                index: 10,
                title: (
                  <>
                    Advanced Patterns{' '}
                    <Link
                      href="/workshops/advanced-typescript-patterns/type-predicates-and-assertion-functions/filtering-with-type-predicates"
                      className="text-cyan-300 underline"
                    >
                      Section 3—4
                    </Link>
                  </>
                ),
                topics: ['Type predicates', 'Assertion functions', 'Classes'],
              },
              {
                index: 11,
                title: (
                  <>
                    Advanced Patterns{' '}
                    <Link
                      href="/workshops/advanced-typescript-patterns/external-libraries/where-do-external-types-come-from"
                      className="text-cyan-300 underline"
                    >
                      Section 5—6
                    </Link>
                  </>
                ),
                topics: [
                  'Deep-dive into 3rd-party libraries',
                  'Indentity functions',
                ],
              },
              {
                index: 12,
                title: (
                  <>
                    <Link
                      href="/workshops/type-transformations/challenges/transform-path-parameters-from-strings-to-objects"
                      className="text-cyan-300 underline"
                    >
                      Type Transformations Challenges
                    </Link>
                    {' & '}
                    <Link
                      href="/workshops/advanced-typescript-patterns/advanced-challenges/merge-dynamic-objects-with-global-objects"
                      className="text-cyan-300 underline"
                    >
                      Advanced Patterns Challenges
                    </Link>
                  </>
                ),
                topics: [
                  'Review Type Transformations challenges',
                  'Work on Advanced Patterns challenges',
                ],
              },
            ]}
          />
        </Section>
        <Section week="13" align="end">
          <Module
            slug="/tutorials/zod"
            type="tutorial"
            title="Zod"
            image="https://res.cloudinary.com/total-typescript/image/upload/v1663163481/zod-tutorial/zod-hand-metamorphosis_2x_rlnewc.png"
            meta="10 exercises"
            weeks={[
              {
                index: '13',
                title: (
                  <Link
                    href="/tutorials/zod"
                    className="text-cyan-300 underline"
                  >
                    Zod Tutorial
                  </Link>
                ),
                topics: ['Runtime checking', 'Transforming data'],
              },
            ]}
          />
        </Section>
        <Section week="14-15" align="start">
          <Module
            slug="/tutorials/react-with-typescript"
            type="tutorial"
            title="React"
            image="https://res.cloudinary.com/total-typescript/image/upload/v1688690090/react-tutorial-typescript_qc2dhs.png"
            meta="21 exercises"
            weeks={[
              {
                index: 14,
                title: (
                  <Link
                    href="tutorials/react-with-typescript/introduction/adding-react-to-a-typescript-project"
                    className="text-cyan-300 underline"
                  >
                    Exercises 1—10
                  </Link>
                ),
                topics: [
                  'Adding React to a TypeScript Project',
                  'JSX Types',
                  'Components',
                ],
              },
              {
                index: 15,
                title: (
                  <Link
                    href="/ttutorials/react-with-typescript/hooks/properly-typing-usestate"
                    className="text-cyan-300 underline"
                  >
                    Exercises 11—21
                  </Link>
                ),
                topics: ['Hooks'],
              },
            ]}
          />
        </Section>
        <Section week="16-18" align="end">
          <Module
            slug="/workshops/advanced-react-with-typescript"
            type="workshop"
            title="Advanced React with TypeScript"
            image="https://res.cloudinary.com/total-typescript/image/upload/v1689110162/React_Workshop_2x_jrqlux.png"
            meta="55 exercises"
            weeks={[
              {
                index: 16,
                title: (
                  <Link
                    href="/workshops/advanced-react-with-typescript/advanced-props/type-checking-react-props-with-discriminated-unions"
                    className="text-cyan-300 underline"
                  >
                    Section 1 & 2
                  </Link>
                ),
                topics: ['Advanced Props', 'Using Generics with Components'],
              },
              {
                index: 17,
                title: (
                  <Link
                    href="/tutorials/zod"
                    className="text-cyan-300 underline"
                  >
                    Section 3 & 4
                  </Link>
                ),
                topics: ['Advanced Hooks', 'Types'],
              },
              {
                index: 18,
                title: (
                  <Link
                    href="/tutorials/zod"
                    className="text-cyan-300 underline"
                  >
                    Section 5 & 6
                  </Link>
                ),
                topics: ['Advanced Patterns', 'External Libraries'],
              },
            ]}
          />
        </Section>
      </main>
    </Layout>
  )
}

export default TypeScriptLearningPath

const Module: React.FC<{
  type?: 'tutorial' | 'workshop'
  slug: string
  image: string
  title: string
  meta: string
  weeks: {
    index: string | number
    title: React.ReactNode
    topics: string[]
  }[]
}> = ({image, title, meta, weeks, type = 'workshop', slug}) => {
  return (
    <div className="relative -mx-5 mt-8 border-y border-gray-700/50 bg-gradient-to-b from-gray-800 to-gray-900 p-5 shadow-2xl shadow-black/20 sm:border sm:p-8 md:-mx-12 md:rounded-lg lg:p-12">
      {type === 'tutorial' && (
        <div className="absolute -right-2 top-10 rounded-sm bg-amber-300 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-black shadow-lg after:absolute after:right-[7px] after:top-[22px] after:-z-10 after:h-7 after:w-7 after:rotate-45 after:bg-amber-400 after:content-[''] sm:-right-5">
          free tutorial
        </div>
      )}
      <div className="flex w-full flex-col items-center justify-between gap-16 md:flex-row">
        <Image
          src={image}
          width={250}
          height={250}
          alt={title}
          aria-hidden="true"
        />
        <div className="w-full text-center sm:text-left">
          <div>
            <h3 className="font-text text-4xl font-bold">{title}</h3>
            <span className="inline-flex pt-3 font-mono text-sm font-semibold uppercase tracking-wide text-cyan-300">
              {meta}
            </span>
          </div>
          <Link
            href={slug}
            passHref
            target="_blank"
            className="mt-5 inline-flex rounded bg-gray-700 px-5 py-2 font-medium transition hover:bg-gray-600"
          >
            View →
          </Link>
        </div>
      </div>
      <ul className="grid w-full grid-cols-1 gap-x-5 gap-y-8 pt-10 sm:grid-cols-2">
        {weeks.map((week) => {
          return (
            <li className="w-full">
              <span className="inline-block pb-1 font-mono font-semibold uppercase tracking-wide text-gray-300">
                Week {week.index}
              </span>
              <h4 className="pb-2 text-xl font-medium">{week.title}</h4>
              <ul className="list-disc pl-4">
                {week.topics.map((topic) => {
                  return (
                    <li className="py-0.5 pl-1 text-lg text-gray-200 marker:text-gray-500">
                      {topic}
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const Section: React.FC<
  React.PropsWithChildren<{week?: string; align?: 'start' | 'end'}>
> = ({children, align = 'end', week}) => {
  return (
    <section className="relative mt-56">
      {week && (
        <div
          className={cx(
            'absolute -top-40 flex flex-col font-heading text-9xl font-bold leading-[0.9] text-gray-700/50',
            {
              '-right-5 text-right': align === 'end',
              '-left-5 text-left': align === 'start',
            },
          )}
        >
          <span className="text-6xl">week</span>
          {week}
        </div>
      )}
      {children}
    </section>
  )
}

const Skip = () => {
  return (
    <div>
      More advanced? Skip to week 3.
      <button onClick={() => {}}>Scroll to week 3</button>
    </div>
  )
}

const CompleteVolume = () => {
  return (
    <div className="not-prose -mx-5 flex flex-col items-center justify-center gap-10 border-y border-gray-800 bg-card p-8 py-10 sm:rounded-lg sm:border md:-mx-10 md:flex-row md:p-5">
      <Image
        src="https://res.cloudinary.com/total-typescript/image/upload/v1676015688/core-volume_2x_wt7jnc.png"
        aria-hidden="true"
        alt=""
        width={240}
        height={240}
      />
      <div className="flex w-full flex-col items-center py-5 text-center md:items-start md:text-left">
        <div className="font-mono text-sm font-semibold uppercase text-cyan-300">
          Total TypeScript
        </div>
        <h3 className="font-text text-4xl font-bold">Complete Volume</h3>
        <ul className="flex w-full flex-col gap-1.5 pt-10 text-lg text-gray-200 sm:text-base md:w-auto md:pt-5">
          <li className='inline-flex items-center gap-2 before:text-cyan-300 before:content-["✓"]'>
            Pro Essentials
          </li>
          <li className='inline-flex items-center gap-2 before:text-cyan-300 before:content-["✓"]'>
            Type Transformations
          </li>
          <li className='inline-flex items-center gap-2 before:text-cyan-300 before:content-["✓"]'>
            TypeScript Generics
          </li>
          <li className='inline-flex items-center gap-2 before:text-cyan-300 before:content-["✓"]'>
            Advanced TypeScript Patterns
          </li>
          <li className='inline-flex items-center gap-2 before:text-cyan-300 before:content-["✓"]'>
            TypeScript Expert Interviews
          </li>
          <li className='inline-flex items-center gap-2 before:text-cyan-300 before:content-["✓"]'>
            Advanced React with TypeScript
          </li>
        </ul>
        <Link
          href="/#buy"
          className="mt-8 flex w-full rounded bg-gradient-to-t from-cyan-400 to-cyan-300 px-4 py-3 font-semibold text-black transition hover:brightness-110 md:mt-10 md:w-auto md:py-2"
        >
          Be a TypeScript Wizard →
        </Link>
      </div>
    </div>
  )
}
