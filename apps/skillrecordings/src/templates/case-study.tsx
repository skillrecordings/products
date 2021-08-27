import * as React from 'react'
import Layout from 'components/app/layout'
import {CaseStudyTemplateProps, ClientProps} from '@types'
import Image from 'next/image'
import Link from 'next/link'
import slugify from 'slugify'
import ExternalLinkIcon from 'components/icons/external-link'

const CaseStudyTemplate: React.FC<CaseStudyTemplateProps> = ({
  children,
  meta,
}) => {
  return (
    <Layout meta={meta}>
      <article>{children}</article>
    </Layout>
  )
}

export default CaseStudyTemplate

type SectionProps = {
  className?: string
  classNameDefault?: string
  title?: string
  titleClassName?: string
  titleClassNameDefault?: string
  containerClassName?: string
  containerClassNameDefault?: string
  image?: string
  aside?: React.ReactElement
}

const Section: React.FC<SectionProps> = ({
  title,
  className = 'text-black',
  classNameDefault = 'prose prose-dark lg:prose-2xl sm:prose-xl prose-lg max-w-screen-md mx-auto',
  containerClassName = 'bg-white',
  containerClassNameDefault = 'sm:py-32 py-16 min-h-screen flex items-center justify-center px-5',
  titleClassName = 'max-w-screen-lg',
  titleClassNameDefault = 'text-center lg:text-6xl sm:text-5xl text-4xl font-extrabold text-white sm:pb-24 pb-16',
  children,
  aside,
}) => {
  return (
    <section className={`${containerClassName} ${containerClassNameDefault}`}>
      <div className="flex lg:flex-row flex-col-reverse">
        <div>
          {title && (
            <h2
              id={slugify(title, {lower: true})}
              className={`${titleClassName} ${titleClassNameDefault}`}
            >
              {title}
            </h2>
          )}
          <div className={`${className} ${classNameDefault}`}>{children}</div>
        </div>
        {aside && (
          <aside className="space-y-12 lg:pl-16 lg:max-w-sm lg:pb-0 sm:pb-16 pb-8 flex-shrink-0 flex flex-col sm:items-start items-center">
            {aside}
          </aside>
        )}
      </div>
    </section>
  )
}

const Header: React.FC<any> = ({meta, image, className}) => {
  return (
    <header className={className}>
      <span className="font-medium uppercase tracking-wider bg-gradient-to-r from-indigo-900 to-indigo-800 opacity-75 text-indigo-50 bg-opacity-80 px-3 py-1 rounded-full sm:text-sm text-xs">
        Case Study
      </span>
      <h1 className="lg:text-7xl sm:text-6xl text-4xl font-extrabold leading-tight tracking-tight py-8">
        {meta.title}
      </h1>
      {image && (
        <div className="transform sm:translate-y-32 translate-y-8 sm:mx-0 -mx-5">
          <Image
            src={image.url}
            alt={image.alt}
            width={1920 / 1.5}
            height={820 / 1.5}
            quality={100}
          />
        </div>
      )}
    </header>
  )
}

const Client: React.FC<ClientProps> = ({
  image,
  name,
  links,
  label,
  children,
}) => {
  return (
    <div className="relative z-10 border border-blueGray-800 rounded-md bg-gradient-to-t bg-purple-300 bg-opacity-10 p-8 flex flex-col text-white md:items-center items-center md:text-left text-center max-w-screen-md">
      <div className="flex flex-col items-center text-center">
        <div className="-mt-16 sm:w-32 sm:h-32 w-24 h-24 border-2 rounded-full border-indigo-600">
          <Image
            className="rounded-full bg-blueGray-900"
            src={image.url}
            alt={name}
            width={140}
            height={140}
          />
        </div>
        <div className="pt-2">
          <div className="font-medium text-xl leading-tight">{name}</div>
          {label && <div className="text-indigo-300">{label}</div>}
        </div>
      </div>
      {children}
      {links && (
        <div className="pt-6">
          {links.map((link, i) => (
            <span key={i}>
              <a className="" href={link.url}>
                {link.label}
              </a>
              {i + 1 !== links.length && ' ・ '}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const CaseLink: React.FC<any> = ({
  url,
  label,
  className = 'sm:mb-8 mb-4 sm:mt-0 mt-8 inline-flex sm:text-base text-sm items-center text-white px-5 py-3 font-medium bg-gradient-to-tr from-purple-500 to-blue-500 rounded-md group',
}) => {
  return (
    <Link href={url}>
      <a className={className}>
        <ExternalLinkIcon className="w-5 text-purple-200 group-hover:text-white transition-all ease-in-out duration-200" />
        <span className="pl-2">Visit {label}</span>
      </a>
    </Link>
  )
}

type Contributor = {
  name: string
  image: string
}

const ContributorProfileCard: React.FC<{
  contributors: Contributor[]
  label: string
  rotate: string
}> = ({contributors, label, children, rotate = 'sm:-rotate-3 -rotate-2'}) => {
  return (
    <div className="relative sm:py-12 py-8">
      <div
        className={`transform ${rotate} bg-gradient-to-bl from-purple-600 to-indigo-600 sm:p-8 p-6 rounded-lg`}
      >
        <div className="-mt-6 font-medium">{children}</div>
        <div
          className={`flex sm:items-center ${
            contributors.length > 1 ? 'sm:flex-row flex-col' : ''
          }`}
        >
          <div className="flex items-center">
            {contributors &&
              contributors.map((contributor: Contributor, i) => {
                return (
                  <div
                    key={contributor.name}
                    className={`
                    sm:w-auto w-16 flex rounded-full border-4 border-indigo-600
                    ${contributors.length > 0 && i !== 0 ? '-ml-5 ' : ''}`}
                    style={{zIndex: i}}
                  >
                    <Image
                      src={contributor.image}
                      alt={contributor.name}
                      width={80}
                      height={80}
                      className="rounded-full "
                    />
                  </div>
                )
              })}
          </div>
          <div
            className={`${
              contributors.length > 1
                ? 'sm:pl-4 pl-0 sm:pt-0 pt-1'
                : 'sm:pl-4 pl-2'
            } flex flex-col`}
          >
            {contributors && (
              <div className="font-bold leading-tight">
                {contributors.map((contributor: Contributor, i) => (
                  <span key={contributor.name}>
                    {contributor.name}
                    {contributors.length > 0 &&
                      i + 1 !== contributors.length &&
                      ', '}
                  </span>
                ))}
              </div>
            )}
            <div className="text-sm">{label}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {Section, Header, Client, CaseLink, ContributorProfileCard}
