import React from 'react'
import {H1, H2, H3, H4} from './headings'
import {workshops} from 'components/content/workshops'
import {Link} from './link'
import cx from 'classnames'
import Image from 'next/image'

const MDXComponents = {
  h1: (props: any) => <H1 {...props} />,
  h2: (props: any) => <H2 {...props} />,
  h3: (props: any) => <H3 {...props} />,
  h4: (props: any) => <H4 {...props} />,
  a: (props: any) => <Link {...props} />,
  Section: (props: any) => <Section {...props} />,
  blockquote: (props: any) => <Blockquote {...props} />,
  Divider: (props: any) => <Divider {...props} />,
  ListOfQuestions: (props: any) => <ListOfQuestions {...props} />,
  PlansGrid: (props: any) => <PlansGrid {...props} />,
  Testimonial: (props: any) => <Testimonial {...props} />,
  Steps: (props: any) => <Steps {...props} />,
  Step: (props: any) => <Step {...props} />,
  WorkshopsList: (props: any) => <WorkshopsList {...props} />,
}

export default MDXComponents

type SectionProps = {
  children: React.ReactNode
  image?: string
  className?: string
}

const Section: React.FC<SectionProps> = ({children, image, className}) => {
  return (
    <section
      className={cx(className, {
        'sm:pb-56 pb-24 sm:pt-48 pt-24 relative': image,
      })}
    >
      {image && (
        <div className="flex items-center justify-center w-full absolute sm:-top-40 -top-32 md:px-0 px-16">
          <Image
            src={image}
            width={1024 / 2.75}
            height={1024 / 2.75}
            alt=""
            aria-hidden
          />
        </div>
      )}
      <div>{children}</div>
    </section>
  )
}

type BlockquoteProps = {
  children: React.ReactNode
}

const Blockquote: React.FC<BlockquoteProps> = ({children}) => {
  return <blockquote className="not-prose">{children}</blockquote>
}

type TestimonialProps = {
  children: React.ReactNode
  author: string
  className?: string
  iconClassName?: string
}

const Testimonial: React.FC<TestimonialProps> = ({
  children,
  author,
  className,
  iconClassName,
}) => {
  return (
    <div className="not-prose">
      <blockquote
        className={cx(
          className,
          `sm:p-8 p-6 sm:rounded-md relative font-heading text-xl leading-relaxed font-medium max-w-screen-md mx-auto`,
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            'absolute w-10 h-10 sm:-left-5 sm:-top-2 left-2 -top-6 rounded-full flex items-center justify-center text-white',
            iconClassName,
          )}
        >
          <Image
            src={require('../../../public/assets/icons/quote.png')}
            width={24}
            height={24}
            alt=""
          />
        </span>
        {children}
        <div className="italic pt-4 text-lg">— {author}</div>
      </blockquote>
    </div>
  )
}

type DividerProps = 'trees' | 'route'

const Divider: React.FC<{type: DividerProps}> = ({type}) => {
  const getImageForType = (type: DividerProps) => {
    switch (type) {
      case 'trees':
        return require('../../../public/assets/divider-trees@2x.png')
      case 'route':
        return require('../../../public/assets/divider-route@2x.png')
      default:
        return require('../../../public/assets/divider-trees@2x.png')
    }
  }
  return (
    <div className="flex items-center justify-center w-full sm:pt-16 pt-10">
      <Image
        width={100}
        height={66}
        alt=""
        aria-hidden="true"
        src={getImageForType(type)}
        priority
        quality={100}
      />
    </div>
  )
}

type ListProps = {
  children: React.ReactNode
}

const ListOfQuestions: React.FC<ListProps> = ({children}) => {
  const childrenArr = React.Children.toArray(children)
  return (
    <ul className="relative list-none sm:px-7 px-4">
      {childrenArr.map((item, i) => {
        return (
          <li key={i} className="sm:static relative">
            <span aria-hidden="true" className="absolute left-0 mt-3">
              <Image
                src={require('../../../public/assets/icons/questionmark.png')}
                width={22}
                height={22}
                alt=""
              />
            </span>
            {item}
          </li>
        )
      })}
    </ul>
  )
}

type PlansGridProps = {
  columns: {
    title: string
    children: string[]
  }[]
}

const PlansGrid: React.FC<PlansGridProps> = ({columns}) => {
  return (
    <div className="not-prose py-10 sm:px-0 px-5">
      <ul className="grid md:grid-cols-2 grid-cols-1 gap-16 w-full max-w-screen-md mx-auto">
        {columns.map(({title, children}, i) => {
          return (
            <li key={title} className="space-y-5">
              <strong className="text-2xl font-heading">{title}</strong>
              <div className="space-y-5">
                {children.map((item) => (
                  <div key={item} className="relative pl-8 leading-normal">
                    <span aria-hidden="true" className="absolute left-0 mt-1">
                      <Image
                        src={require('../../../public/assets/icons/checkmark.png')}
                        width={22}
                        height={22}
                        alt=""
                      />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

type StepsProps = {
  data: {
    title: string
    children: string
  }[]
}

const Steps: React.FC<StepsProps> = ({data}) => {
  return (
    <div className="not-prose max-w-screen-sm mx-auto px-5">
      <ul className="space-y-12">
        {data.map(({title, children}, i) => {
          return (
            <li key={title} className="flex space-x-6">
              <div
                className="text-3xl font-heading font-bold text-sand-300 pt-1"
                aria-hidden="true"
              >
                {i + 1}
              </div>
              <div>
                <strong className="text-2xl font-heading inline-block pt-1.5">
                  {title}
                </strong>
                <div className="pt-2 text-sand-100">{children}</div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

type StepProps = {
  title: string
}

const Step: React.FC<StepProps> = ({title}) => {
  return <li>{title}</li>
}

type WorkshopsListProps = {}

const WorkshopsList: React.FC<WorkshopsListProps> = () => {
  return (
    <div className="not-prose pt-10">
      <ul className="text-lg max-w-screen-lg w-full mx-auto space-y-24 px-5">
        {workshops.map(({title, description, topics, image}) => {
          return (
            <li className="flex md:flex-row flex-col">
              <div className="flex items-start justify-center flex-shrink-0 -mt-10">
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={330}
                  height={330}
                  quality={100}
                />
              </div>
              <div>
                <h3 className="font-bold font-heading text-3xl">{title}</h3>
                <p className="pt-4">{description}</p>
                {topics && (
                  <ul className="pt-6 space-y-4 font-medium">
                    <strong>Topics include:</strong>
                    {topics.map((topic) => (
                      <li className="flex gap-2">
                        <span
                          aria-hidden="true"
                          className="pt-0.5 flex-shrink-0"
                        >
                          <Image
                            src={require('../../../public/assets/icons/checkmark.png')}
                            width={22}
                            height={22}
                            alt=""
                          />
                        </span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
