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
    <div className="flex w-full flex-col items-center justify-center gap-10 py-48 text-center">
      <h1 className="text-5xl font-bold">{book.title}</h1>
      <Button asChild>
        <Link href="">Buy the print edition</Link>
      </Button>
      <Button asChild>
        <Link href="">Continue from where you left off</Link>
      </Button>
    </div>
  )
}

export default BookRoute
