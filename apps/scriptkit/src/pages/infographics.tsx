import Infographics from 'components/infographics'
import Layout from 'layouts'

const InfographicsPage = () => {
  return (
    <Layout>
      <main className="max-w-screen-lg mx-auto space-y-10 flex-grow sm:py-32 py-16 w-full px-5">
        <Infographics />
      </main>
    </Layout>
  )
}

export default InfographicsPage
