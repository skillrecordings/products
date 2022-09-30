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
    <div className="max-w-2xl prose-p:max-w-none font-mono mx-auto bg-[#1C1427] sm:border-2 border-y-2 border-[#E11D48] border-opacity-20 text-sm leading-relaxed first-of-type:prose-p:mt-0 last-of-type:prose-p:mb-0 sm:rounded-md">
      {header && (
        <div className="px-5 py-3 border-b border-gray-800/50">{header}</div>
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
              className="relative before:absolute before:left-0 before:w-0.5 before:h-full before:bg-cyan-300/80 -ml-2 list-none"
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
    <div className="not-prose flex flex-col items-center sm:pb-16 pb-5 px-5">
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
          'md:text-5xl text-4xl font-bold mx-auto text-center py-12 font-heading',
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
    <section className={cx('relative overflow-hidden w-full', className)}>
      {slot}
      <div className={cx('z-10 relative')}>{children}</div>
      {backgroundImage && (
        <DecorativeImage
          src={backgroundImage}
          layout="fill"
          className="z-0 pointer-events-none lg:object-contain object-cover select-none"
        />
      )}
    </section>
  )
}

const ErrorFromHell: React.FC<any> = ({children}) => {
  return (
    <div className="mt-16 border-2 border-[#E11D48] border-opacity-20 bg-[#1C1427] font-mono max-w-3xl leading-relaxed mx-auto text-sm py-10 px-12 rounded-md text-left relative">
      <div className="relative z-10">{children}</div>
      <div className="absolute left-[-85px] top-[-178px] pointer-events-none select-none">
        <DecorativeImage
          src="/assets/landing/flame-corner-left@2x.png"
          width={970 / 2}
          height={868 / 2}
        />
      </div>
      <div className="absolute right-[-45px] bottom-[-30px] pointer-events-none select-none">
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
