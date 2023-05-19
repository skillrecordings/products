import * as React from 'react'
import {Suspense} from 'react'
import {sanityWriteClient} from '../../utils/sanity-server'

const ConceptList = async () => {
  const concepts = await sanityWriteClient.fetch(`*[_type == 'skosConcept']`)

  return (
    <>
      <ul>
        {concepts.map((concept: {_id: string; prefLabel: string}) => (
          <li key={concept._id}>{concept.prefLabel}</li>
        ))}
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
