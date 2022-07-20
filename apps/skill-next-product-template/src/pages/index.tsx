import Layout from 'components/layout'
import type {NextPage} from 'next'

const Home: NextPage = () => {
  return (
    <Layout>
      <h1 className="text-4xl text-primary-500 font-bold flex items-center justify-center flex-grow">
        Hi! 👋
      </h1>
    </Layout>
  )
}

export default Home
