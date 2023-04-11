import Layout from 'layouts'

export default function Confirm() {
  return (
    <Layout
      withFooter={false}
      meta={{title: 'Subscription confirmed'}}
      className="flex items-center justify-center"
    >
      <div className="max-w-screen-sm text-center sm:pb-32 pb-16">
        <span
          role="img"
          aria-label="incoming envelope"
          className="sm:text-7xl text-6xl block pb-5"
        >
          💌
        </span>
        <h1 className="sm:text-4xl text-3xl font-bold pb-2 sm:max-w-md">
          Script Kit Newletter Subscription Confirmed!
        </h1>
        <div className="pt-4 text-lg">
          <p>Thanks for signing up and confirming.</p>{' '}
          <p>Expect some newsletters in your inbox soon! 👀</p>
        </div>
      </div>
    </Layout>
  )
}
