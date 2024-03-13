import {Skeleton} from '@skillrecordings/ui/primitives/skeleton'

const LoadingResource = () => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-5 py-5">
      <Skeleton className="h-16 w-full bg-gray-200" />
      <Skeleton className="h-5 w-full bg-gray-200" />
      <Skeleton className="h-5 w-full bg-gray-200" />
      <Skeleton className="h-5 w-full bg-gray-200" />
      <Skeleton className="h-5 w-full bg-gray-200" />
    </div>
  )
}

export default LoadingResource
