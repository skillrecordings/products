import * as React from 'react'
import {FunctionComponent} from 'react'
import Layout from 'layouts'
import DiscussionPost from 'components/discussion-post'
import Link from 'next/link'

import {
  Category,
  Discussion,
  DiscussionsProps,
  getDiscussions,
  Login,
} from 'lib/get-discussions'
import {LoadedScript} from 'utils/types'
import DocsPost from 'components/docs-post'

type DocsType = {
  i: string
  dir: string
  section: string
  title: string
  command: string
} & LoadedScript

type SectionType = {
  name: string
  docs: DocsType[]
}[]
type DocsProps = {
  sections: SectionType
}
const Docs: FunctionComponent<React.PropsWithChildren<DocsProps>> = ({
  sections,
}) => {
  return (
    <Layout className="docs w-full">
      <main className="max-w-screen-lg mx-auto w-full flex">
        <div className="hidden sm:flex flex-col w-64 mr-12 my-8 ">
          {sections.map(({name, docs}) => {
            return (
              <div key={name} className="mb-4">
                <h4 className="text-lg font-bold">{name}</h4>
                {docs.map((doc) => {
                  return (
                    <Link
                      key={doc.command}
                      href={`/docs/${doc.command}`}
                      className="block px-2 py-0.5 text-md"
                    >
                      {doc.title}
                    </Link>
                  )
                })}
              </div>
            )
          })}
          {/* {Object.entries(sections).map(discussions.map((discussion) => (
            <Link
              key={discussion.discussion}
              href={`/docs/${discussion.command}`}
            >
              <a className="md:text-xs text-xs leading-tight text-white hover:underline flex flex-row px-2">
                {discussion.section} - {discussion.title}
              </a>
            </Link>
          ))} */}
        </div>
        <div className="flex flex-col flex-grow max-w-2xl">
          {sections.map(({docs}) => {
            return (
              docs
                // .sort((a, b) => (a.i > b.i ? 1 : -1))
                .map((doc) => {
                  return <DocsPost discussion={doc} key={doc.command} />
                })
            )
          })}
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticProps(
  context: any,
): Promise<{props: DocsProps}> {
  let discussions = (await getDiscussions(
    Category.Docs,
    Login.johnlindquist,
  )) as DocsType[]

  discussions = discussions.filter((d) => d.dir === 'docs')

  let sections = discussions
    .reduce((acc: any, current: any) => {
      let index = parseInt(current.sectionIndex, 10)

      if (typeof acc[index] === 'undefined') {
        acc[index] = {
          name: current.section,
          docs: [current],
        }
      } else {
        acc[index]?.docs?.push(current)
        acc[index]?.docs?.sort((a: any, b: any) => (a.i > b.i ? 1 : -1))
      }

      return acc
    }, [])
    .filter(Boolean)

  return {
    props: {
      sections,
    },
  }
}

export default Docs
