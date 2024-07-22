import {SpiralIllustration} from 'components/course-builder/spiral-illustration'
import Layout from 'components/layout'
import Link from 'next/link'
import {RandomShape} from 'components/course-builder/svg-shapes'
import {cn} from '@skillrecordings/ui/utils/cn'
import {ButtonPrimary} from 'components/buttons'
import Icon from 'components/icons'
import {CallToActionForm} from 'components/call-to-action-form'
import {genericCallToActionContent} from 'components/landing-content'

const CourseBuilderPage = () => {
  return (
    <Layout
      meta={{
        title: 'Course Builder by Badass.dev',
        ogImage: {
          url: 'https://res.cloudinary.com/badass-courses/image/upload/v1721643966/card-course-builder-on-badass_2x_b6jpzf.jpg',
        },
      }}
      className="overflow-hidden"
    >
      <header className="container">
        <div className="flex items-center md:flex-row flex-col gap-16 w-full justify-center">
          <div className="flex-shrink-0">
            <SpiralIllustration className="md:w-[400px] w-full rotate-90" />
          </div>
          <h1 className="font-heading max-w-2xl leading-tight flex flex-col gap-2 md:text-5xl text-4xl md:text-left text-center">
            <span className="block font-script md:text-4xl text-3xl text-badass-yellow-300">
              Introducing
            </span>{' '}
            <span className="text-balance">
              The Full-Stack Course Platform for Developers
            </span>
          </h1>
        </div>
      </header>
      <main className="container py-20">
        <div className="max-w-3xl md:text-xl sm:text-lg [&_a]:text-badass-green-500 hover:[&_a]:underline [&_a]:font-semibold text-base [&_p]:leading-relaxed mx-auto w-full flex flex-col gap-10">
          <p>
            Building a course is a complex process. It requires research,
            design, production, and delivery to be successful. It's not enough
            to rush something out and hope for the best. In fact, creating and
            selling a high-quality course that meets your expectations of
            "success" while also meeting the expectations of your students is a
            difficult task.
          </p>
          <h2 className="font-heading md:text-4xl text-3xl text-balance">
            It requires many iterations of{' '}
            <Link href="/the-process">The Process</Link> to get right.
          </h2>
          <ContentTypes />
          <p>
            All of these are iterations of{' '}
            <Link href="/the-process">The Process</Link>. They are all ways to
            build an audience, test your ideas, and build a business around your
            expertise.
          </p>
          <p>
            Course Builder is a technical implementation of a full-stack course
            framework. It's a way to build a course that represents the
            experience we've had building courses for the last 10 years at{' '}
            <Link href="https://egghead.io" rel="noopener" target="_blank">
              egghead.io
            </Link>{' '}
            and{' '}
            <Link href="https://badass.dev" rel="noopener" target="_blank">
              badass.dev
            </Link>
            .
          </p>
          <p>
            Course Builder is a framework for building courses. It's not a
            course platform. It's not a course marketplace. It's all of the
            pieces that you need to{' '}
            <strong>launch your own course platform and marketplace.</strong>
          </p>
        </div>
        <div className="max-w-3xl mx-auto gap-5 sm:text-lg text-sm w-full md:flex-row flex-col mt-16 rounded-2xl bg-badass-gray-900 border border-badass-gray-800 flex items-center justify-between sm:p-3 p-5">
          <span className="pl-3 uppercase ">Learn More</span>
          <div className="flex items-center sm:flex-row flex-col gap-3">
            <Link
              href="https://github.com/badass-courses/course-builder/"
              target="_blank"
              rel="noopener"
              className="rounded-xl h-14 inline-flex gap-2 font-semibold items-center bg-badass-yellow-500 transition w-full justify-center hover:bg-badass-yellow-300 text-badass-gray-900 min-w-max px-8 text-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  fill="#111012"
                  d="M10 1.872a8.334 8.334 0 0 1 2.636 16.24c-.417.073-.573-.177-.573-.396 0-.198.01-.854.01-1.552 2.094.385 2.636-.51 2.802-.98a3.03 3.03 0 0 1 .854-1.176c.292-.157.709-.542.01-.552a1.667 1.667 0 0 0-1.28.854 1.783 1.783 0 0 1-2.428.687 1.753 1.753 0 0 0-.53-1.114c1.853-.209 3.79-.927 3.79-4.115a3.243 3.243 0 0 0-.853-2.24c.254-.72.225-1.51-.084-2.208 0 0-.698-.219-2.291.854a7.856 7.856 0 0 0-4.167 0C6.302 5.091 5.604 5.32 5.604 5.32a2.994 2.994 0 0 0-.083 2.209 3.224 3.224 0 0 0-.854 2.24c0 3.197 1.948 3.905 3.802 4.114a1.974 1.974 0 0 0-.563 1.541c0 1.115.01 2.01.01 2.292 0 .219-.155.48-.572.396A8.338 8.338 0 0 1 10 1.872Z"
                />
              </svg>
              GitHub
            </Link>
            <Link
              href="https://coursebuilder.dev"
              target="_blank"
              rel="noopener"
              className="rounded-xl h-14 inline-flex gap-2 font-semibold items-center bg-transparent hover:bg-white/5 transition w-full justify-center text-white border border-white min-w-max px-8 text-lg"
            >
              CourseBuilder.dev <Icon name="arrow-top-right" className="w-5" />
            </Link>
          </div>
        </div>
      </main>
      <CallToActionForm
        content={genericCallToActionContent}
        className="bg-badass-gray-900 border border-badass-gray-800 rounded-2xl"
      />
    </Layout>
  )
}

export default CourseBuilderPage

const ContentTypes = ({className}: {className?: string}) => {
  return (
    <ul className={cn('grid grid-cols-2 gap-x-5 gap-y-3', className)}>
      {[
        {
          label: 'The Landing Page',
          icon: (
            <rect width="18" height="18" x="3" y="3" fill="#5069FF" rx="3" />
          ),
        },
        {
          label: 'A Newsletter',
          icon: (
            <rect
              width="18"
              height="18"
              x="-1"
              y="11.9"
              fill="#FDB854"
              rx="3"
              transform="rotate(-45 -1 11.9)"
            />
          ),
        },
        {
          label: 'The Blog',
          icon: (
            <path
              fill="#EB5228"
              d="M9.634 3.5c1.154-2 4.041-2 5.196 0l8.227 14.25c1.155 2-.289 4.5-2.598 4.5H4.004c-2.309 0-3.752-2.5-2.598-4.5L9.634 3.5Z"
            />
          ),
        },
        {
          label: 'A Book',
          icon: (
            <path
              fill="#5069FF"
              d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10Z"
            />
          ),
        },

        {
          label: 'Tip Videos',
          icon: (
            <path
              fill="#FDB854"
              d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10Z"
            />
          ),
        },
        {
          label: 'Live Workshops',
          icon: <rect width="18" height="18" fill="#2BC370" rx="3" />,
        },
        {
          label: 'Free Tutorials',
          icon: (
            <path
              fill="#EB5228"
              d="M10 20H2.361A2.363 2.363 0 0 1 0 17.638V2.362A2.363 2.363 0 0 1 2.362 0h7.571c4.891 0 9.147 3.498 9.931 8.325C20.879 14.59 16.071 20 9.999 20Z"
            />
          ),
        },

        {
          label: 'Self-Paced Courses',
          icon: (
            <path
              fill="#EB5228"
              d="M9.402 1.5c1.155-2 4.041-2 5.196 0l8.227 14.25c1.155 2-.288 4.5-2.598 4.5H3.773c-2.31 0-3.753-2.5-2.598-4.5L9.402 1.5Z"
            />
          ),
        },
        {
          label: 'A Podcast',
          icon: <rect width="18" height="18" fill="#2BC370" rx="3" />,
        },
      ].map((item) => (
        <li
          key={item.label}
          className="inline-flex items-center gap-3 font-semibold"
        >
          <svg
            className="text-badass-yellow-300"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            {item.icon}
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  )
}
