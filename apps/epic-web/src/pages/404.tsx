import {Button} from '@skillrecordings/ui'
import Layout from 'components/app/layout'
import Link from 'next/link'

export default function Custom404() {
  return (
    <Layout meta={{title: 'Not Found'}}>
      <main className="flex w-full flex-grow flex-col items-center justify-center gap-5 text-center">
        <h1 className="text-3xl font-bold">404</h1>
        <h2 className="sm:text-lg">Page Not Found</h2>
        <Button variant="secondary" asChild>
          <Link href="/contact">Contact us</Link>
        </Button>
      </main>
    </Layout>
  )
}
