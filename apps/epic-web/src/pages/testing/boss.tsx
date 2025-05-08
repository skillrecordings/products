import Layout from 'components/app/layout'
import BossLetter from './boss-letter.mdx'

const BossLetterPage = () => {
  return (
    <Layout
      meta={{
        title: 'Boss Letter',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1697567963/boss.gif',
        },
      }}
    >
      <main className="prose prose-lg mx-auto w-full max-w-2xl px-5 py-16 dark:prose-invert">
        <BossLetter />
      </main>
    </Layout>
  )
}

export default BossLetterPage
