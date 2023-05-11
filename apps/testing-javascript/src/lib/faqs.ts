import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

export const getAllFaqs = async () =>
  await sanityClient.fetch(groq`*[_type == "faq"] | order(_createdAt asc) {
  _id,
  _type,
  question,
  answer
}`)
