import Layout from 'components/app/layout'
import MegabundleBossLetter from 'components/megabundle-boss-letter.mdx'
import BossLetter from 'components/boss-letter.mdx'

export const getServerSideProps = () => {
  return {
    props: {
      megabundleEnds: '2024-12-20T07:59:59Z',
    },
  }
}

const BossLetterPage = ({megabundleEnds}: {megabundleEnds: string}) => {
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
        {new Date() < new Date(megabundleEnds) ? (
          <MegabundleBossLetter />
        ) : (
          <BossLetter />
        )}
      </main>
    </Layout>
  )
}

export default BossLetterPage
