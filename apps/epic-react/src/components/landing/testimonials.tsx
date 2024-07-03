import Image from 'next/image'

const data = [
  {
    img: '/testimonials-images/01-ruslan-shtyk.jpeg',
    quote:
      "I was just about to start preparing the app we're working on for general availability, which includes solving a lot of performance issues. This workshop delivers knowledge that is applicable to the real world issues right away.",
    title: 'Ruslan Shtyk about React Performance workshop',
  },
  {
    img: '/testimonials-images/02-mike-schutte.jpeg',
    quote:
      "This has been my favorite of the masterclass series. Especially compound components! I find I'm at a point in my career where I want to write better APIs for components both for others and for resilience.",
    title: 'Mike Schutte about Advanced React Patterns workshop',
  },
  {
    img: '/testimonials-images/03-lindsey-gillaspie.jpeg',
    quote:
      "I typically work on smaller apps, so since I don't get exposure to React performance tips and tricks, I found this extremely helpful. I appreciate how much effort you have put into the materials and schedule because this was the smoothest workshop I have EVER attended!",
    title: 'Lindsey Gillaspie',
  },
  {
    img: '/testimonials-images/04-jacob-m-g-evans.jpeg',
    quote:
      'This workshop/video/bonanza is nothing like what egghead has on their normal website, honestly this feels like a React Bootcamp/Coding School on a more digestable platform and delivery.',
    title: 'Jacob M-G Evans',
  },
  {
    img: '/testimonials-images/05-andrew-li.jpeg',
    quote:
      'I bought the workshop bundle because I felt my knowledge of React was very lacking. At the time, I had worked with React for half a year and always had a lot of unanswered questions. I feel way more confident in my React abilities now. The workshops cover almost everything you need to know in React. Nowadays whenever I find myself unfamiliar with a concept in React, I just refer back to the notes and exercises. The other day, I was looking at some production level React code that I have never seen before and I did not feel overwhelmed at all.',
    title: 'Andrew Li',
  },
  {
    img: '/testimonials-images/06-steven-hofheins.jpeg',
    quote:
      "I'm always looking to level up my skills and I wanted to get a stronger knowledge of React. Before Epic React, I was good at React. After, I feel like a superhero and have super powers with React. I've been able to solve some harder problems with simpler solutions. I'm working on an internal tool for the company I work for and I've been able to create some incredible advanced functionality with the added knowledge from Kent's course.",
    title: 'Steven Hofheins',
  },
]

const Testimonials = () => {
  return (
    <div className="grid grid-cols-1 gap-4 py-5 md:grid-cols-2 md:py-10 lg:-mx-24">
      {data.map((testimonial) => {
        return (
          <article
            key={testimonial.title}
            className="group relative flex h-full cursor-default flex-col justify-between rounded-lg border border-er-gray-200 bg-background px-5 pb-5 pt-4 md:px-8 md:pb-8"
          >
            <section>
              <p className="text-base leading-normal sm:text-lg">
                {testimonial.quote}”
              </p>
            </section>
            <footer className="font-mono text-sm leading-normal text-er-gray-600">
              <div className="flex items-center">
                <div className="mr-3 w-[44px] shrink-0 flex-grow overflow-hidden rounded-full grayscale duration-150 group-hover:grayscale-0">
                  <Image
                    src={testimonial.img}
                    alt={testimonial.title}
                    width={100}
                    height={100}
                    className="!m-0"
                  />
                </div>
                <div className="w-full">
                  <span>{testimonial.title}</span>
                </div>
              </div>
            </footer>
            <div className="absolute left-4 top-4 font-serif text-5xl leading-none text-er-gray-300">
              “
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default Testimonials
