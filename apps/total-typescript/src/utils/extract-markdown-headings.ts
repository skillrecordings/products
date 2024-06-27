import slugify from '@sindresorhus/slugify'

export type MarkdownHeading = {
  level: number
  text: string
  slug: string
  items: MarkdownHeading[]
}

export const extractMarkdownHeadings = (
  markdown: string,
  chapterTitle: string,
): MarkdownHeading[] => {
  const headingRegex = /(^#{1,6}) (.+)/gm
  let match
  const stack: MarkdownHeading[] = [{level: 0, text: '', slug: '', items: []}] // Initialize stack with a dummy heading
  const slugMap: Map<string, number> = new Map() // Map to store each slug and its current index

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    let slug = slugify(text, {
      decamelize: false,
      customReplacements: [
        ['&', ''],
        ['.', ''],
        ['/', ''],
      ],
    })

    // If the slug already exists in the map, append the current index to it
    if (slugMap.has(slug)) {
      const currentIndex = slugMap.get(slug)!
      slugMap.set(slug, currentIndex + 1)
      if (slug === 'exercises') {
        slug = `${slug}-${currentIndex}-for-${slugify(chapterTitle)}`
      } else {
        slug = `${slug}-${currentIndex}`
      }
    } else {
      slugMap.set(slug, 1)
    }

    const heading: MarkdownHeading = {level, text, slug, items: []}

    while (level <= stack[stack.length - 1].level) {
      stack.pop()
    }

    stack[stack.length - 1].items.push(heading)
    stack.push(heading)
  }

  return stack[0].items
}

export function flattenMarkdownHeadings(toc: MarkdownHeading[]) {
  return toc.flatMap((h) => [h.slug, ...h.items.flatMap((item) => item.slug)])
}
