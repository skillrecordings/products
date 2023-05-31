import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
// import {getEmailHtml} from '@skillrecordings/skill-lesson/utils/get-email-html'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form
        action={async (data) => {
          'use server'
          const serialized = await serializeMDX(data.get('markdown') as string)

          // console.log(getEmailHtml(serialized))
        }}
      >
        <textarea name="markdown" className="w-full h-full text-black" />
        <button>send</button>
      </form>
    </main>
  )
}
