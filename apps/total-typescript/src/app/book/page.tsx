import {Button} from '@skillrecordings/ui/primitives/button'
import Link from 'next/link'
import {getBook} from '@/lib/book'
import {notFound} from 'next/navigation'

const BookRoute = async () => {
  const book = await getBook('total-typescript')

  if (!book) {
    notFound()
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-10 py-48">
      <h1 className="text-center text-5xl font-bold">{book.title}</h1>
      <h2 className="text-center">Become the TypeScript Wizard</h2>
      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="">Buy the print edition</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href={`/book/${book.chapters[0].slug.current}`}>
            Continue from where you left off
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <strong>Chapters</strong>
        <ul className="flex list-decimal flex-col gap-2 text-left">
          {book.chapters.map((chapter) => {
            return (
              <li key={chapter.slug.current}>
                <span className="text-lg font-semibold">{chapter.title}</span>
                <ul className="list-inside list-disc">
                  {chapter.resources?.map((resource) => {
                    return (
                      <li key={resource.slug.current}>
                        <Link
                          href={`/book/${chapter.slug.current}/${resource.slug.current}`}
                          className="font-medium hover:underline"
                        >
                          {resource.title}
                        </Link>
                        {resource?.solution && (
                          <>
                            {' '}
                            |{' '}
                            <Link
                              href={`/book/${chapter.slug.current}/${resource.slug.current}/solution`}
                              className=" hover:underline"
                            >
                              Solution
                            </Link>
                          </>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default BookRoute
