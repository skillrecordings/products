import {Skeleton} from '@skillrecordings/ui/primitives/skeleton'

const LoadingResource = () => {
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col gap-5">
      <Skeleton className="aspect-video h-full w-full bg-gray-200" />
      <div className="mx-auto w-full max-w-4xl">
        <Skeleton className="h-5 w-full bg-gray-200" />
        <Skeleton className="h-5 w-full bg-gray-200" />
        <Skeleton className="h-5 w-full bg-gray-200" />
        <Skeleton className="h-5 w-full bg-gray-200" />
      </div>
    </div>
  )
}

export default LoadingResource
