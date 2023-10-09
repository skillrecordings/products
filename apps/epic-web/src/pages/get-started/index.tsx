import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import Layout from 'components/app/layout'
import {Page, getPage} from 'lib/pages'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'

export const getStaticProps = async () => {
  const page = await getPage('get-started')
  const bodyMdx = page.body && (await serializeMDX(page.body))
  return {
    props: {
      page,
      body: bodyMdx,
    },
  }
}

const GetStartedPage: React.FC<{
  page: Page
  body: MDXRemoteSerializeResult
}> = ({page, body}) => {
  return (
    <Layout meta={{title: 'Get Started'}}>
      <header className="mx-auto flex w-full max-w-screen-md items-center justify-center py-24">
        <h1 className="text-center text-3xl font-bold sm:text-4xl lg:text-5xl">
          Get Started
        </h1>
      </header>
      <main className="prose mx-auto w-full max-w-screen-md pb-16 dark:prose-invert">
        {page.body ? <MDX contents={body} /> : null}
      </main>
    </Layout>
  )
}

export default GetStartedPage
