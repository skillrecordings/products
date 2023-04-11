import Layout from 'layouts'

export default function Confirm() {
  return (
    <Layout
      withFooter={false}
      meta={{title: 'Confirm your subscription'}}
      className="flex items-center justify-center"
    >
      <div className="max-w-2xl text-center sm:pb-32 pb-16">
        <span
          role="img"
          aria-label="incoming envelope"
          className="sm:text-7xl text-6xl block pb-5"
        >
          📨
        </span>
        <p className="sm:text-xl text-lg">Thanks! There's one last step.</p>
        <h1 className="sm:text-4xl text-3xl font-semibold py-7">
          Please confirm your subscription in the email that just got sent.
        </h1>
        <p className="sm:text-xl text-lg">
          You'll need to click the confirmation link to receive any further
          emails. 👀
        </p>
      </div>
    </Layout>
  )
}
