import {useRouter} from 'next/router'
import {trpc} from '@/trpc/trpc.client'
import Layout from '@/components/app/layout'

const Unsubscribed = () => {
  const router = useRouter()
  trpc.unsubscribe.unsubscribeFrom.useQuery({
    from: router.query.from as string,
    userId: router.query.userId as string,
  })
  return (
    <Layout meta={{title: 'Unsubscribed'}}>
      <div className="flex min-h-[calc(100vh-96px)] flex-col p-0">
        <div className="flex flex-grow flex-col items-center justify-center p-5 pb-16 text-center sm:pb-0">
          <div className="font-heading max-w-xl pt-4 text-3xl">
            You've been removed from the email list and won't receive any more
            emails about it.
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Unsubscribed
