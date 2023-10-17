import Layout from 'components/app/layout'
import BossLetter from 'components/boss-letter.mdx'

const BossLetterPage = () => {
  return (
    <Layout meta={{title: 'Boss Letter'}}>
      <main className="prose prose-lg mx-auto w-full max-w-2xl py-16 dark:prose-invert">
        <BossLetter />
      </main>
    </Layout>
  )
}

export default BossLetterPage
