import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Layout from '@/components/app/layout'
import Divider from '@/components/divider'
import team from '@/content/team'

const CreditsPage = () => {
  return (
    <Layout
      meta={{
        title: 'Epic React Production Credits',
        ogImage: {
          url: `${process.env.NEXT_PUBLIC_URL}/og-images/credits@2x.png`,
          alt: 'og image',
        },
      }}
      className="relative"
    >
      <div className="mx-auto max-w-screen-lg px-8 py-24 sm:pb-32 sm:pt-16">
        <div className="mx-auto max-w-lg">
          <Image
            src="/assets/space-eggo@2x.png"
            alt="space eggo"
            width={1612}
            height={1328}
          />
        </div>
        <h1 className="mt-6 text-center text-[44px] font-bold leading-tight">
          Humans Behind Epic React
        </h1>
        <Divider className="mb-16 mt-10" />
        <div className="prose mx-auto my-16 lg:prose-xl">
          <p>
            EpicReact.dev is the best place for web developers of all experience
            levels to learn React from the basics through to advanced concepts
            and building a real-world application.
          </p>

          <p>
            Kent C. Dodds and egghead have collaborated to make Epic React a
            truly high-quality and delightful learning experience for you. Kent
            created, designed and recorded all the content, while egghead team
            members and collaborators provided planning, design and development
            support. Epic React is also built using egghead infrastructure as
            the CMS.
          </p>

          <p>Meet the humans who have helped make Epic React possible.</p>
        </div>
        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 sm:gap-8">
          {team.map((person) => (
            <div
              className="flex flex-col items-center overflow-hidden rounded-lg"
              key={person.name}
            >
              <div className="w-48 overflow-hidden rounded-lg sm:w-64">
                <Image
                  src={`${process.env.NEXT_PUBLIC_URL}/assets/team${person.avatar}`}
                  alt={person.name}
                  width={256}
                  height={256}
                  className="w-full bg-gray-100"
                />
              </div>
              <div className="mt-4 p-0 text-center sm:mt-0 sm:p-8">
                <h1 className="text-2xl font-bold">{person.name}</h1>
                <h2 className="my-3 text-sm uppercase tracking-wider text-react">
                  {person.title}
                </h2>
                <p className="text-lg leading-relaxed text-er-gray-700">
                  {person.description}
                </p>
                {person.link && (
                  <Link
                    href={person.link.url}
                    className="mt-4 inline-flex cursor-pointer items-center rounded-md bg-er-gray-200 px-3 py-2"
                    target="_blank"
                  >
                    {person.link.label === 'Twitter' ? (
                      //    prettier-ignore
                      <svg className="mr-1 text-react" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="currentColor"><path fill="none" d="M0 0h24v24H0z"></path><path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"></path></g></svg>
                    ) : (
                      //  prettier-ignore
                      <svg className="mr-1 text-react" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M19.989 11.572a7.96 7.96 0 0 0-1.573-4.351 9.749 9.749 0 0 1-.92.87 13.157 13.157 0 0 1-3.313 2.01c.167.35.32.689.455 1.009v.003a9.186 9.186 0 0 1 .11.27c1.514-.17 3.11-.108 4.657.101.206.028.4.058.584.088zm-9.385-7.45a46.164 46.164 0 0 1 2.692 4.27c1.223-.482 2.234-1.09 3.048-1.767a7.88 7.88 0 0 0 .796-.755A7.968 7.968 0 0 0 12 4a8.05 8.05 0 0 0-1.396.121zM4.253 9.997a29.21 29.21 0 0 0 2.04-.123 31.53 31.53 0 0 0 4.862-.822 54.365 54.365 0 0 0-2.7-4.227 8.018 8.018 0 0 0-4.202 5.172zm1.53 7.038c.388-.567.898-1.205 1.575-1.899 1.454-1.49 3.17-2.65 5.156-3.29l.062-.018c-.165-.364-.32-.689-.476-.995-1.836.535-3.77.869-5.697 1.042-.94.085-1.783.122-2.403.128a7.967 7.967 0 0 0 1.784 5.032zm9.222 2.38a35.947 35.947 0 0 0-1.632-5.709c-2.002.727-3.597 1.79-4.83 3.058a9.77 9.77 0 0 0-1.317 1.655A7.964 7.964 0 0 0 12 20a7.977 7.977 0 0 0 3.005-.583zm1.873-1.075a7.998 7.998 0 0 0 2.987-4.87c-.34-.085-.771-.17-1.245-.236a12.023 12.023 0 0 0-3.18-.033 39.368 39.368 0 0 1 1.438 5.14zM12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></g></svg>
                    )}
                    {person.link.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <a href="https://egghead.io" target="_blank">
            <Image
              src="/assets/egghead-logo.svg"
              alt="eggheadio logo"
              width={200}
              height={50}
            />
          </a>
        </div>
      </div>
    </Layout>
  )
}

export default CreditsPage
