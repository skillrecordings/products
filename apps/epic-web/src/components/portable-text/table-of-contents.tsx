import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid'
import speakingurl from 'speakingurl'
import Link from 'next/link'
import {track} from 'utils/analytics'
import {Article} from 'lib/articles'

// Based on https://kittygiraudel.com/2022/05/19/table-of-contents-with-sanity-portable-text/

const TableOfContents: React.FC<{article: Article}> = ({article}) => {
  const filter = (ast: any, match: any) =>
    ast.reduce((acc: any, node: any) => {
      if (match(node)) acc.push(node)
      if (node.children) acc.push(...filter(node.children, match))
      return acc
    }, [])

  const getChildrenText = (props: any) =>
    props.children
      .map((node: any) => (typeof node === 'string' ? node : node.text || ''))
      .join('')

  const findHeadings = (ast: any) =>
    filter(ast, (node: any) => /h\d/.test(node.style)).map((node: any) => {
      const text = getChildrenText(node)
      const slug = speakingurl(text)

      return {...node, text, slug}
    })

  const get = (object: any, path: any) =>
    path.reduce((prev: any, curr: any) => prev[curr], object)
  const getObjectPath = (path: any) =>
    path.length === 0
      ? path
      : ['subheadings'].concat(path.join('.subheadings.').split('.'))

  const parseOutline = (ast: any) => {
    const outline = {subheadings: []}
    const headings = findHeadings(ast)
    const path: any = []
    let lastLevel = 0

    headings.forEach((heading: any) => {
      const level = Number(heading.style.slice(1))
      heading.subheadings = []

      if (level < lastLevel) for (let i = lastLevel; i >= level; i--) path.pop()
      else if (level === lastLevel) path.pop()

      const prop = get(outline, getObjectPath(path))
      prop.subheadings.push(heading)
      path.push(prop.subheadings.length - 1)
      lastLevel = level
    })

    return outline.subheadings
  }

  const outline = parseOutline(article.body)

  const ToC = (props: any) => {
    return (
      <ol>
        {props.outline.map((heading: any) => {
          const {subheadings} = heading
          return (
            <li key={heading._key} className="text-lg sm:text-xl">
              <Link
                href={'#' + heading.slug}
                className="inline-flex py-1 font-medium hover:underline sm:py-2"
              >
                {getChildrenText(heading)}
              </Link>
              {subheadings.length > 0 && (
                <ol className="py-2">
                  {subheadings.map((subheading: any) => {
                    return (
                      <li key={subheading._key}>
                        <Link
                          href={'#' + subheading.slug}
                          className="inline-flex border-l border-gray-700 py-1 pl-6 font-normal opacity-90 hover:underline sm:py-2"
                        >
                          {getChildrenText(subheading)}
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              )}
            </li>
          )
        })}
      </ol>
    )
  }

  if (outline.length === 0) return null

  return (
    <div className="bottom-0 left-0 mt-10 flex w-full items-center justify-center">
      <details
        onClick={() => {
          track(`clicked on article's table of contents`, {
            article: article.slug,
          })
        }}
        aria-label="On this page"
        className="no-marker group mx-auto w-full max-w-screen-lg text-lg font-medium marker:text-transparent sm:text-xl"
      >
        <summary className="flex items-center gap-5 hover:cursor-pointer">
          <span
            aria-hidden="true"
            className="flex h-16 items-center justify-center px-5 opacity-60 transition group-hover:opacity-100"
          >
            <ChevronDownIcon className="h-4 w-4 group-open:hidden" />
            <ChevronUpIcon className="hidden h-4 w-4 group-open:block" />
          </span>
          <span className="py-3 text-base uppercase text-gray-500 transition group-hover:text-gray-200 dark:text-gray-400 sm:py-5">
            On this page
          </span>
        </summary>
        <div className="pb-4">
          <nav aria-label="Table of contents">
            <ToC outline={outline} />
          </nav>
        </div>
      </details>
    </div>
  )
}

export default TableOfContents
