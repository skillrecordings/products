'use client'

/**
 * ShikiCode component that renders syntax-highlighted code using dangerouslySetInnerHTML.
 * This bypasses MDX parsing issues with inline style attributes in MDX v3/next-mdx-remote v6.
 *
 * The shiki-twoslash-plugin outputs `<ShikiCode html="..." />` elements instead of raw HTML,
 * which avoids the `Could not parse 'style' attribute on 'span'` error.
 */
export function ShikiCode({html}: {html: string}) {
  return <div dangerouslySetInnerHTML={{__html: html}} />
}

export default ShikiCode
