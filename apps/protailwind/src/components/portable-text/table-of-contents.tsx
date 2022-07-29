import {PortableTextProps} from '@portabletext/react'
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid'
import speakingurl from 'speakingurl'
import Link from 'next/link'

// Based on https://kittygiraudel.com/2022/05/19/table-of-contents-with-sanity-portable-text/

const TableOfContents = ({value}: PortableTextProps) => {
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

  const outline = parseOutline(value)

  const ToC = (props: any) => {
    return (
      <ol>
        {props.outline.map((heading: any) => {
          const {subheadings} = heading
          return (
            <li key={heading._key} className="text-lg">
              <Link href={'#' + heading.slug}>
                <a className="hover:underline inline-flex sm:py-2 py-1 font-medium">
                  {getChildrenText(heading)}
                </a>
              </Link>
              {subheadings.length > 0 && (
                <ol className="py-2">
                  {subheadings.map((subheading: any) => {
                    return (
                      <li key={subheading._key}>
                        <Link href={'#' + subheading.slug}>
                          <a className="pl-6 inline-flex border-l border-slate-700 hover:underline sm:py-2 py-1 font-normal">
                            {getChildrenText(subheading)}
                          </a>
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
    <details
      aria-label="On this page"
      className="group marker:text-transparent no-marker font-medium sm:text-lg border-b border-slate-800 max-w-screen-md w-full mx-auto"
    >
      <summary className="hover:cursor-pointer hover:underline decoration-indigo-300 sm:py-5 py-3 flex items-center justify-between">
        <span className="text-indigo-300">On this page</span>
        <span
          aria-hidden="true"
          className="group-hover:bg-slate-700 bg-slate-800 p-2 rounded-full flex items-center justify-center transition"
        >
          <ChevronDownIcon className="group-open:hidden w-4 h-4" />
          <ChevronUpIcon className="group-open:block hidden w-4 h-4" />
        </span>
      </summary>
      <div className="pb-4">
        <nav aria-label="Table of contents">
          <ToC outline={outline} />
        </nav>
      </div>
    </details>
  )
}

export default TableOfContents
