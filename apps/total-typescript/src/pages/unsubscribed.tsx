import {useRouter} from 'next/router'

const Unsubscribed = () => {
  const router = useRouter()
  const tagId = Number(router.query?.tag || router.query?.tagId)

  const message = (tagId: number) => {
    switch (tagId) {
      case 3320688: // unsubscribed: live workshop info
        return 'Total TypeScript Workshops'
      default:
        return 'Total TypeScript email list'
    }
  }
  return (
    <div className="flex min-h-[calc(100vh-96px)] flex-col p-0">
      <div className="flex flex-grow flex-col items-center justify-center p-5 pb-16 text-center sm:pb-0">
        <div className="max-w-xl pt-4 font-heading text-3xl">
          You've been removed from the {message(tagId)} and won't receive any
          more emails about it.
        </div>
      </div>
    </div>
  )
}

export default Unsubscribed
