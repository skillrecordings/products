const Confirm = () => {
  return (
    <div className="p-0 min-h-[calc(100vh-96px)] flex flex-col">
      <div className="flex flex-col items-center justify-center flex-grow p-5 pb-16 text-center sm:pb-0">
        <p className="pt-8 pb-6 text-2xl font-condensed text-badass-pink-500">
          Just one last step...
        </p>
        <p className="max-w-lg text-3xl font-heading">
          Now check your email to{' '}
          <strong className="text-badass-yellow-300">
            confirm your subscription.
          </strong>
        </p>
        <p className="max-w-sm pt-8 mx-auto text-xs md:text-sm">
          If you don't see the email after a few minutes, you might check your
          spam folder or other filters and add{' '}
          <code>team@totaltypescript.com</code> to your contacts.
        </p>
      </div>
    </div>
  )
}

export default Confirm
