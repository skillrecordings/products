import * as React from 'react'
import {Suspense} from 'react'
import {sanityWriteClient} from '../../utils/sanity-server'
import Link from 'next/link'

const ConceptList = async () => {
  const concepts = await sanityWriteClient.fetch(`*[_type == 'concept']`)

  return (
    <>
      <ul>
        {concepts.map(
          (concept: {_id: string; title: string; slug: {current: string}}) => (
            <li key={concept._id}>
              <Link href={`/concepts/${concept.slug.current}`}>
                {concept.title}
              </Link>
            </li>
          ),
        )}
      </ul>
    </>
  )
}

export default async function ConceptListPage() {
  return (
    <div>
      <h1>concepts</h1>
      <Suspense fallback={<p>Loading feed...</p>}>
        {/* @ts-expect-error Server Component */}
        <ConceptList />
      </Suspense>
    </div>
  )
}
