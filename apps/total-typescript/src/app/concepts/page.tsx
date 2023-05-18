import {sanityWriteClient} from '../../utils/sanity-server'

export default async function () {
  const concepts = await sanityWriteClient.fetch(`*[_type == 'skosConcept']`)
  return (
    <div>
      <h1>concepts</h1>
      <ul>
        {concepts.map((concept: {prefLabel: string}) => (
          <li>{concept.prefLabel}</li>
        ))}
      </ul>
    </div>
  )
}
