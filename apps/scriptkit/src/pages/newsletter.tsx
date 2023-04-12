import {Favicon} from 'components/logo'
import SubscribeToConvertkitForm from 'components/subscribe-to-convertkit-form'
import Layout from 'layouts'

export default function Confirm() {
  return (
    <Layout
      withFooter={false}
      meta={{title: 'Subscribe to ScriptKit'}}
      className="flex items-center justify-center min-h-screen"
    >
      <main className="flex flex-col items-center justify-center max-w-screen-sm pb-24">
        <Favicon />
        <h1 className="font-medium text-4xl text-center pb-10 pt-8">
          Join the Script Kit community and stay up-to-date on the latest
          updates!
        </h1>
        <div className="max-w-screen-sm w-full text-center sm:pb-32 pb-16">
          <SubscribeToConvertkitForm />
        </div>
        <small className="text-sm text-gray-300">
          No spam. We respect your privacy. Unsubscribe at any time.
        </small>
      </main>
    </Layout>
  )
}
