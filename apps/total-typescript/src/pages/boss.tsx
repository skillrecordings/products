import Layout from '@/components/app/layout'
import BossLetter from '@/components/boss.mdx'
export default function Boss() {
  return (
    <Layout
      meta={{
        title: 'A letter to your boss',
      }}
    >
      <main className="p-5 py-20 lg:py-28">
        <article className="prose mx-auto max-w-2xl rounded-md shadow-black/40 sm:prose-lg sm:bg-gray-800/50 sm:p-10 sm:shadow-2xl">
          <BossLetter />
        </article>
      </main>
    </Layout>
  )
}
