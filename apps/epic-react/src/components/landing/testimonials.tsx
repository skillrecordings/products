import Image from 'next/image'

const data = [
  {
    name: 'Christian Moen',
    avatar: require('../../../public/testimonials-images/christian-moen.jpg'),
    quote: (
      <>
        I'm using React every day at work, and{' '}
        <strong>I've picked up things I didn't know already!</strong> Great
        purchase!
      </>
    ),
  },
  {
    name: 'Luis Güette',
    avatar: require('../../../public/testimonials-images/luis-guette.png'),
    quote: (
      <>
        It is totally different of what you have seen before. I started
        yesterday, <strong>and it’s amazing!</strong>
      </>
    ),
  },
  {
    name: 'Aaron McAdam',
    avatar: require('../../../public/testimonials-images/aaron-mcadam.jpg'),
    quote: (
      <>
        The workshop format really works for knowledge retention.{' '}
        <strong>
          I learned a lot and I've been doing React for about 5 years!
        </strong>
      </>
    ),
  },
  {
    name: 'imyjimmy',
    avatar: require('../../../public/testimonials-images/imyjimmy.jpg'),
    quote: (
      <>
        Since taking Kent's Epic React course, I've introduced exactly{' '}
        <strong>zero bugs</strong> to prod 👍
      </>
    ),
  },
  {
    name: 'Tiger Abrodi',
    avatar: require('../../../public/testimonials-images/tiger-abrodi.jpg'),
    quote: (
      <>
        Yep, just like you mentioned and promised in your podcast, most of the
        time was spent on the keyboard! ❤️{' '}
        <strong>
          Epic React is just hands-down the best React resource out there.
        </strong>{' '}
        🎉
      </>
    ),
  },
  {
    name: 'Dan Goodwin',
    avatar: require('../../../public/testimonials-images/dan-goodwin.jpg'),
    quote: (
      <>
        This course has been <strong>fantastic</strong> so far. I love the{' '}
        <strong>hands-on format</strong> and the way the lessons really try to
        explain what React's abstractions are doing under the hood instead of
        just showing you the syntax is a huge plus for me.
      </>
    ),
  },
  {
    name: 'Mihai',
    avatar: require('../../../public/testimonials-images/mihai.jpg'),
    quote: (
      <>
        It's awesome!! Very detailed but clear.{' '}
        <strong>
          No matter your React experience you'll have a lot to learn from it.
        </strong>{' '}
        They made a pretty powerful framework for exercising/learning so it's
        not just copy-the-instructor type of tutorials.
      </>
    ),
  },
  {
    name: 'Ian Svoboda',
    avatar: require('../../../public/testimonials-images/ian-svoboda.jpg'),
    quote: (
      <>
        Been enjoying the Epic React course. Specifically I think this is quite
        possibly{' '}
        <strong>the most polished UX for a code-along course I’ve used</strong>{' '}
        in awhile. Thanks Kent the effort you put into this shows.
      </>
    ),
  },
  {
    name: 'Shivayan Bora',
    avatar: require('../../../public/testimonials-images/shivayan-bora.jpg'),
    quote: (
      <>
        Can't thank Kent enough for the Epic React course. I have been learning
        so much and the best part is,{' '}
        <strong>
          I'm able to apply my learnings directly to a critical project I am
          working on over at the office.
        </strong>
      </>
    ),
  },
  {
    name: 'Richard Bagshaw',
    avatar: require('../../../public/testimonials-images/richard-bagshaw.jpg'),
    quote: (
      <>
        Epic React from Kent C. Dodds takes a different approach. Instead of
        just being fed video after video the path here is: "This is the goal,
        here are some tips, have a go".{' '}
        <strong>This is great for memory, I have to actually think,</strong> and
        then I can learn the details in a follow up video.
      </>
    ),
  },
]

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="not-prose relative mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 pb-10 pt-16 md:grid-cols-2"
    >
      <div
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden="true"
      />
      {data.map(({name, avatar, quote}) => {
        return (
          <blockquote key={name} className="px-5 py-3 sm:px-5 sm:py-5">
            <p className="text-balance text-sm leading-normal sm:text-base">
              {quote}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Image
                src={avatar}
                alt={name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm">{name}</span>
            </div>
          </blockquote>
        )
      })}
    </section>
  )
}

export default Testimonials
