import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

export const getAllInterviews = async () =>
  await sanityClient.fetch(groq`*[_type == "interview"] | order(_createdAt asc) {
  _id,
  _type,
  title,
  description,
  image,
  slug,
  isDouble
}`)
