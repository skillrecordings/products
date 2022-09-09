import type {NextPage} from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Share Cards Generator</title>
        <meta
          name="description"
          content="Social share cards for typescriptcourse.com"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Link
          passHref
          href="/api/card?title=Effectively Using Learner Feedback with Marie Poulin&image=https://res.cloudinary.com/dg3gyk0gu/image/fetch/h_600/f_auto/https://cdn.sanity.io/images/pnuo5qcl/production/0cbab28b53570c40b56ee9e29183a9640523e022-1500x1500.png"
        >
          <a download="card@2x">Download Example</a>
        </Link>
      </main>
    </div>
  )
}

export default Home
