import * as React from 'react'
import {type PortableTextProps} from '@portabletext/react'
import speakingurl from 'speakingurl'
import Link from 'next/link'

// Based on https://kittygiraudel.com/2022/05/19/table-of-contents-with-sanity-portable-text/

export const TableOfContents = ({value}: PortableTextProps) => {
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
            <li key={heading._key} data-heading="">
              <Link href={'#' + heading.slug}>{getChildrenText(heading)}</Link>
              {subheadings.length > 0 && (
                <ol data-subheading="">
                  {subheadings.map((subheading: any) => {
                    return (
                      <li key={subheading._key}>
                        <Link href={'#' + subheading.slug}>
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
    <details data-table-of-contents="" aria-label="On this page">
      <summary>
        <span data-marker="" aria-hidden="true" />
        <span data-title="">On this page</span>
      </summary>
      <div data-content="">
        <nav aria-label="Table of contents">
          <ToC outline={outline} />
        </nav>
      </div>
    </details>
  )
}
