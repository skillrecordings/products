import Layout from 'components/layout'
import type {NextPage} from 'next'

const Home: NextPage = () => {
  return (
    <Layout nav>
      <h1 className="flex items-center justify-center flex-grow text-4xl font-bold text-primary-500">
        Escuela Frontend! 👋
      </h1>
    </Layout>
  )
}

export default Home
