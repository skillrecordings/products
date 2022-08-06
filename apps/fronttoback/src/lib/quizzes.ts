import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'

export async function getAllQuizzes() {
  return await sanityClient.fetch(groq`*[_type == "quiz"] | order(date asc){
    _updatedAt,
    title,
    'slug': slug.current
}`)
}

export async function getQuiz(slug: string) {
  return await sanityClient.fetch(
    groq`*[_type == "quiz" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    questions[]->{
        questionId, 
        "question": body, 
        ckTagId, 
        answer, 
        type, 
        'correct': choices[correct == true].value,
        choices[] {
          'answer': value,
          label,
          correct,
          'image': image.asset->url
        },
    }
    }`,
    {
      slug,
    },
  )
}
