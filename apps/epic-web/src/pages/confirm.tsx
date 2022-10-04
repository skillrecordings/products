import Layout from 'components/app/layout'

const ConfirmSubscriptionPage = () => {
  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex-grow flex items-center justify-center flex-col px-5 py-24">
        <div className="max-w-xl text-center font-light flex flex-col items-center justify-center">
          <img
            src="/email-confirm.svg"
            alt="an email client with a confirmation email"
          />
          <h1 className="font-bold sm:text-4xl text-3xl py-8 font-text max-w-lg mx-auto w-full">
            Please check your inbox for an email that just got sent.
          </h1>
          <p className="sm:text-lg leading-relaxed mx-auto pb-8">
            You'll need to click the confirmation link to receive any further
            emails. If you don't see the email after a few minutes, you might
            check your spam folder or other filters and add{' '}
            <strong>hello@kentcdodds.com</strong> to your contacts.
          </p>
          <p className="sm:text-lg">
            Thanks, <br />
            <Signature />
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmSubscriptionPage

export const Signature = () => {
  return <>Kent</>
}
