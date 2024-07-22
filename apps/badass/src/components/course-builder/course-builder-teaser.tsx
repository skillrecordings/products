import Link from 'next/link'
import {CourseBuilderLogo} from './course-builder-logo'
import {SpiralIllustration} from './spiral-illustration'
import {Button} from '@skillrecordings/ui'
import {ButtonPrimary, ButtonSecondary} from 'components/buttons'
import Icon from 'components/icons'

export const CourseBuilderTeaser: React.FC = () => {
  return (
    <section className="container mt-16">
      <div className="rounded-2xl bg-badass-gray-900 border border-badass-gray-800 flex w-full h-full md:flex-row flex-col md:p-16 sm:p-10 p-8 gap-5">
        <div className="flex flex-col items-start justify-center max-w-3xl">
          <Link href="/course-builder" className="mb-10">
            <CourseBuilderLogo className="sm:w-48 w-32" />
          </Link>
          <h2 className="font-heading md:text-5xl sm:text-4xl text-3xl text-balance mb-8">
            The Full-Stack Course Platform for Developers
          </h2>
          <p className="sm:text-xl text-lg leading-relaxed text-badass-gray-300 text-balance">
            A technical implementation of a full-stack course framework. It's a
            way to build a course that represents the experience we've had
            building courses for the last 10 years at egghead.io and badass.dev
          </p>
          <div className="flex mt-10 sm:flex-row flex-col sm:items-center sm:justify-start justify-center w-full gap-3">
            <ButtonPrimary
              href="/course-builder"
              className="h-14 bg-badass-yellow-500 hover:bg-badass-yellow-300 text-badass-gray-900 min-w-max px-10 text-lg"
            >
              Learn More
            </ButtonPrimary>
            <ButtonSecondary
              href="https://coursebuilder.dev"
              className="h-14 min-w-max px-10 text-lg inline-flex items-center gap-2"
            >
              Visit CourseBuilder.dev{' '}
              <Icon name="arrow-top-right" className="w-5" />
            </ButtonSecondary>
          </div>
        </div>
        <SpiralIllustration className="w-full md:block hidden" />
      </div>
    </section>
  )
}
