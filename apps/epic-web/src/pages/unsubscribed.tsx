import Layout from 'components/app/layout'

const Unsubscribed = () => {
  return (
    <Layout meta={{title: 'Unsubscribed'}}>
      <div className="p-0 min-h-[calc(100vh-96px)] flex flex-col">
        <div className="flex flex-col items-center justify-center flex-grow p-5 pb-16 text-center sm:pb-0">
          <div className="max-w-xl pt-4 text-3xl font-heading">
            You've been removed from the email list and won't receive any more
            emails about it.
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Unsubscribed
