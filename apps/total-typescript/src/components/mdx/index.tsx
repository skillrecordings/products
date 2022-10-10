import React from 'react'
import Image from 'next/image'
import cx from 'classnames'

export const MDXComponents = {
  TypeError: (props: TypeErrorProps) => <TypeError {...props} />,
  Topics: (props: TopicsProps) => <Topics {...props} />,
  Image: (props: any) => <DecorativeImage {...props} />,
  Section: (props: any) => <Section {...props} />,
  SectionHeading: (props: any) => <SectionHeading {...props} />,
  ErrorFromHell: (props: any) => <ErrorFromHell {...props} />,
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
        {children}
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
