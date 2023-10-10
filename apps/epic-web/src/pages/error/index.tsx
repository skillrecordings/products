import Layout from 'components/app/layout'

const ErrorPage = () => {
  return (
    <Layout meta={{title: 'Error'}}>
      <main className="mx-auto flex w-full max-w-screen-md flex-grow items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Verification Error</h1>
      </main>
    </Layout>
  )
}

export default ErrorPage
