import Layout from '@/components/app/layout'
import BossLetter from '@/components/boss-letter.mdx'

const BossLetterPage = () => {
  return (
    <Layout
      meta={{
        title: 'Boss Letter',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1725878973/dear-boss_2x.jpg',
        },
      }}
    >
      <main className="prose prose-lg mx-auto w-full max-w-2xl px-5 py-16">
        <BossLetter />
      </main>
    </Layout>
  )
}

export default BossLetterPage
