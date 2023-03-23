import type {NextPage} from 'next'
import Layout from 'components/layout'
import {trpc} from '../../trpc/trpc.client'

const LessonsIndex: NextPage = () => {
  const {data: products = []} = trpc.resources.getAllProducts.useQuery()
  console.log({products})

  return (
    <Layout>
      <h1 className="text-4xl text-primary-500 font-bold flex items-center justify-center flex-grow">
        Lessons page
      </h1>
    </Layout>
  )
}

export default LessonsIndex
