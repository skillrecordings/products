import React from 'react'
import Image from 'next/legacy/image'
import cx from 'classnames'
import Balancer from 'react-wrap-balancer'

export const MDXComponents = {
  TypeError: (props: TypeErrorProps) => <TypeError {...props} />,
  Topics: (props: TopicsProps) => <Topics {...props} />,
  Image: (props: any) => <DecorativeImage {...props} />,
  Section: (props: any) => <Section {...props} />,
  SectionHeading: (props: any) => <SectionHeading {...props} />,
  ErrorFromHell: (props: any) => <ErrorFromHell {...props} />,
  Testimonial: (props: any) => <Testimonial {...props} />,
  Module: (props: any) => <Module {...props} />,
}

type TypeErrorProps = {
  children: React.ReactNode
  header?: React.ReactNode
}

const TypeError: React.FC<TypeErrorProps> = ({children, header}) => {
  return (
    <div className="mx-auto max-w-2xl border-y-2 border-[#E11D48] border-opacity-20 bg-[#1C1427] font-mono text-sm leading-relaxed prose-p:max-w-none first-of-type:prose-p:mt-0 last-of-type:prose-p:mb-0 sm:rounded-md sm:border-2">
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
      {dividerTop && (
        <DecorativeImage
          src={dividerTop}
          width={1440 / 2}
          height={217 / 2}
          className="pointer-events-none select-none"
        />
      )}
      <h2
        className={cx(
          'mx-auto py-12 text-center font-heading text-4xl font-bold md:text-5xl',
          className,
        )}
      >
        <Balancer>{children}</Balancer>
      </h2>
      {dividerBottom && (
        <DecorativeImage
          src={dividerBottom}
          width={1440 / 2}
          height={217 / 2}
          className="pointer-events-none select-none"
        />
      )}
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
    <section className={cx('relative w-full overflow-hidden', className)}>
      {slot}
      <div className={cx('relative z-10')}>{children}</div>
      {backgroundImage && (
        <DecorativeImage
          src={backgroundImage}
          layout="fill"
          className="pointer-events-none z-0 select-none object-cover lg:object-contain"
        />
      )}
    </section>
  )
}

const ErrorFromHell: React.FC<any> = ({children}) => {
  return (
    <div className="relative mx-auto mt-16 max-w-3xl rounded-md border-2 border-[#E11D48] border-opacity-20 bg-[#1C1427] py-10 px-12 text-left font-mono text-sm leading-relaxed">
      <div className="relative z-10">{children}</div>
      <div className="pointer-events-none absolute left-[-85px] top-[-178px] select-none">
        <DecorativeImage
          src="/assets/landing/flame-corner-left@2x.png"
          width={970 / 2}
          height={868 / 2}
        />
      </div>
      <div className="pointer-events-none absolute right-[-45px] bottom-[-30px] select-none">
        <DecorativeImage
          src="/assets/landing/flame-corner-right@2x.png"
          width={482 / 2}
          height={868 / 2}
        />
      </div>
    </div>
  )
}

const DecorativeImage: React.FC<any> = (props) => {
  return <Image alt="" aria-hidden="true" quality={100} priority {...props} />
}

const Testimonial: React.FC<
  React.PropsWithChildren<{author: {name: string; image?: string}}>
> = ({children, author}) => {
  return (
    <div className="not-prose">
      <blockquote className="relative flex h-full flex-col justify-between rounded-md border border-gray-800 p-5 sm:p-8">
        <div className="font-normal before:absolute before:right-8 before:bottom-9 before:flex before:items-center before:justify-center before:font-heading before:text-3xl before:font-extrabold before:leading-none before:text-cyan-300 before:content-['”']">
          {children}
        </div>
        {author?.name && (
          <div className="mt-5 flex items-center gap-3">
            {author.image && (
              <Image
                src={author.image}
                width={50}
                height={50}
                alt={author.name}
                className="rounded-full"
              />
            )}
            <span className="">{author.name}</span>
          </div>
        )}
      </blockquote>
    </div>
  )
}

const Module: React.FC<React.PropsWithChildren<any>> = ({
  title,
  sub,
  image,
  children,
}) => {
  return (
    <div className="not-prose">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 md:flex-row">
        <div className="flex flex-shrink-0 items-center justify-center md:items-start">
          <Image src={image} alt={title} width={280} height={280} />
        </div>
        <div className="px-5">
          <h3 className="text-center font-text text-3xl font-bold sm:text-4xl md:text-left">
            {title}
          </h3>
          <h4 className="pt-2 text-center text-xl font-medium text-cyan-200 sm:text-2xl md:pt-5 md:text-left">
            <Balancer>{sub}</Balancer>
          </h4>
          <div className="flex flex-col space-y-3 pt-8 text-gray-200 md:pt-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
