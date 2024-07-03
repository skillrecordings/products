import React from 'react'
import Image from 'next/image'
import type {Testimonial} from '@/lib/workshops'
import ReactMarkdown from 'react-markdown'

type TestimonialsProps = {
  testimonials: Testimonial[]
}

const Testimonials: React.FC<TestimonialsProps> = ({testimonials}) => {
  return (
    <div className="mt-10 border-t border-gray-800 pt-5">
      <h3 className="pb-4 text-2xl font-semibold">Reviews</h3>
      <div className="flex flex-col gap-3">
        {testimonials.map((testimonial) => (
          <Testimonial key={testimonial._id} testimonial={testimonial} />
        ))}
      </div>
    </div>
  )
}

export default Testimonials

const Testimonial: React.FC<{testimonial: Testimonial}> = ({testimonial}) => {
  const {author, body} = testimonial
  return (
    <div className="relative inline-flex flex-col rounded bg-gray-800 p-5">
      <div
        aria-hidden
        className="absolute bottom-0 right-5 font-serif text-5xl font-bold leading-none text-gray-500"
      >
        ”
      </div>
      <blockquote className="prose my-0 italic prose-p:last-of-type:my-0 prose-p:last-of-type:py-0 prose-a:text-cyan-300">
        <ReactMarkdown>{body}</ReactMarkdown>
      </blockquote>
      <div className="mt-5 inline-flex items-center gap-2">
        {author.image ? (
          <Image
            src={author.image}
            alt={author.name || ''}
            width={40}
            height={40}
            className="my-0 overflow-hidden rounded-full"
          />
        ) : (
          '— '
        )}
        {author.name && <span>{author.name}</span>}
      </div>
    </div>
  )
}
