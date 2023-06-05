import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import Image from 'next/image'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from '@skillrecordings/skill-lesson/ui/card'

const ResourceTeaser: React.FC<{resource: Module}> = ({resource}) => {
  return (
    <Link
      href={{
        pathname: '/tutorials/[slug]',
        query: {slug: resource.slug as string},
      }}
      className="w-full max-w-[310px] flex-shrink-0 transition hover:-translate-y-2"
    >
      <Card className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-2xl shadow-gray-400/20">
        <CardHeader className="flex aspect-video w-full items-center justify-center border-b border-gray-100">
          {resource.image && (
            <Image
              src={resource.image}
              alt={resource.title}
              width={260}
              height={260}
            />
          )}
        </CardHeader>
        <div className="flex h-full flex-col justify-between px-6 py-5 sm:px-8">
          <CardTitle className="font-heading text-xl font-extrabold lg:text-2xl">
            {resource.title}
          </CardTitle>
          <div className="pt-4 text-sm text-gray-500">
            {resource?.sections &&
              resource?.sections?.reduce(
                (acc: number, section) =>
                  section?.lessons?.length
                    ? section?.lessons?.length + acc
                    : acc,
                0,
              )}{' '}
            exercises
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ResourceTeaser
