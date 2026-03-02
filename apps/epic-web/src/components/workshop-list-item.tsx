import Image from 'next/image'
import Link from 'next/link'

type WorkshopListItemProps = {
  title: string
  slug: string
  image?: {url: string} | null
  body?: string | null
  moduleType?: string
}

const moduleTypePaths: Record<string, string> = {
  workshop: 'workshops',
  tutorial: 'tutorials',
  bonus: 'bonuses',
}

/**
 * Extracts ## headings from markdown body text
 * and returns them as an array of section titles.
 */
function extractSections(body: string): string[] {
  return body
    .split('\n')
    .filter((line) => /^##\s+/.test(line))
    .map((line) => line.replace(/^##\s+/, '').trim())
}

export function WorkshopListItem({
  title,
  slug,
  image,
  body,
  moduleType = 'workshop',
}: WorkshopListItemProps) {
  const sections = body ? extractSections(body) : []
  const path = moduleTypePaths[moduleType] || `${moduleType}s`

  return (
    <li className="not-prose flex flex-col items-center gap-8 pb-16 lg:flex-row lg:items-start">
      {image?.url && (
        <Link
          href={`/${path}/${slug}`}
          target="_blank"
          className="flex-shrink-0"
        >
          <Image src={image.url} width={300} height={300} alt={title} />
        </Link>
      )}
      <div className="flex w-full flex-col items-center sm:items-start">
        <h4 className="text-center text-xl font-bold lg:text-left lg:text-2xl">
          <Link
            href={`/${path}/${slug}`}
            target="_blank"
            className="hover:underline"
          >
            {title}
          </Link>
        </h4>
        {sections.length > 0 && (
          <>
            <p className="pt-2 text-center font-mono text-sm uppercase text-blue-900 dark:text-blue-200 lg:text-left">
              {sections.length} Sections
            </p>
            <ul className="w-full px-8 pt-8 sm:px-0">
              {sections.map((section) => (
                <li
                  key={section}
                  className='py-1 pl-7 before:-ml-7 before:pr-3 before:text-emerald-500 before:content-["✓"] dark:before:text-emerald-300'
                >
                  {section}
                </li>
              ))}
            </ul>
          </>
        )}
        <Link
          href={`/${path}/${slug}`}
          target="_blank"
          className="mt-3 inline-flex gap-1 py-2 text-base opacity-75 transition hover:opacity-100"
        >
          Read more <span aria-hidden>↗︎</span>
        </Link>
      </div>
    </li>
  )
}
