import Link from 'next/link'

const BlockedOverlay = () => (
  <div className="flex aspect-video w-full flex-col items-center justify-center space-y-6 border border-transparent bg-er-gray-100 p-4 md:rounded-md md:border-er-gray-200">
    <h3 className="text-center text-xl leading-tight md:text-2xl">
      You must be logged in to view videos.
    </h3>
    <div className="flex items-center">
      <Link href="/buy" className="btn-primary">
        Buy Epic React
      </Link>
      <span className="mx-4">or</span>
      <Link
        className="inline-flex items-center rounded-md border border-transparent bg-er-gray-200 px-3 py-2 text-sm font-semibold leading-6 text-text transition duration-150 ease-in-out hover:bg-er-gray-300 md:px-4 md:py-3 md:text-base"
        href="/login"
      >
        Log In
      </Link>
    </div>
  </div>
)

export default BlockedOverlay
