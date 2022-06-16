import Layout from 'components/app/layout'
import drop from 'lodash/drop'
import first from 'lodash/first'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import {TwitterIcon} from './welcome'

const Credits = () => {
  return (
    <Layout
      meta={{
        title: 'Humans behind Testing Accessibility',
        description,
        ogImage: {url: 'https://testingaccessibility.com/credits/card@2x.png'},
      }}
      className="bg-sand-50 text-green-800 bg-noise"
    >
      <header className="px-5">
        <div className="max-w-screen-lg sm:grid lg:grid-cols-3 mx-auto w-full pb-16 lg:pt-24 pt-16 justify-center gap-5">
          <h1 className="font-heading lg:text-6xl sm:text-5xl text-4xl font-bold col-span-2 sm:text-left text-center">
            Humans behind Testing Accessibility
          </h1>
          <div className="text-sand-700 text-lg font-display leading-relaxed sm:max-w-screen-md sm:pt-0 pt-8">
            <p>
              Bringing Testing Accessibility to you is a collaboration between
              Marcy Sutton and the team behind{' '}
              <a
                className="underline"
                href="https://egghead.io"
                rel="noopener noreferrer"
                target="_blank"
              >
                egghead.io
              </a>
              . Marcy created the content, while the rest of the team provided
              planning, design, development, and delivery support.
            </p>
            <p className="pt-4">
              Meet the people who have made Testing Accessibility possible.
            </p>
          </div>
        </div>
      </header>
      <main className="max-w-screen-lg mx-auto px-5 pb-24">
        {instructor && (
          <article className="flex md:flex-row flex-col items-center gap-10 sm:pb-16 pb-0">
            <div className="-rotate-6 flex items-center justify-center flex-shrink-0 rounded-full overflow-hidden">
              <Image
                src={instructor.image}
                alt={instructor.name}
                width={250}
                height={250}
                placeholder="blur"
                quality={100}
              />
            </div>
            <div>
              <h1 className="font-heading lg:text-5xl sm:text-4xl text-3xl font-bold">
                {instructor.name}
              </h1>
              <h2 className="font-medium text-xl pt-2 text-sand-600">
                {instructor.role}
              </h2>
              <ReactMarkdown className="prose sm:prose-lg font-display pt-4">
                {instructor.description}
              </ReactMarkdown>
              <a
                href={`https://twitter.com/${instructor.twitter}`}
                rel="noopener noreferrer"
                target="_blank"
                className="hover:underline inline-flex font-display font-medium items-center space-x-1 mt-2 text-green-600"
              >
                <TwitterIcon />
                <span>Twitter</span>
              </a>
            </div>
          </article>
        )}
        <div className="grid sm:grid-cols-2 gap-16 max-w-screen-md w-full pt-16 mx-auto">
          {drop(humans).map((human) => {
            const {name, role, description, image, twitter} = human
            return (
              <article key={name} className="flex flex-col">
                <div className="-rotate-3">
                  <Image
                    className="rounded-full"
                    src={image}
                    alt={name}
                    width={150}
                    height={150}
                    placeholder="blur"
                    quality={100}
                  />
                </div>
                <div>
                  <h1 className="font-heading text-3xl font-bold pt-4">
                    {name}
                  </h1>
                  <h2 className="text-sand-600 font-medium">{role}</h2>
                  <ReactMarkdown className="prose font-display pt-4">
                    {description}
                  </ReactMarkdown>
                  <a
                    href={`https://twitter.com/${twitter}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="hover:underline inline-flex font-display font-medium items-center space-x-1 mt-2 text-green-600"
                  >
                    <TwitterIcon />
                    <span>
                      <span className="sr-only">{name} on </span>
                      Twitter
                    </span>
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </Layout>
  )
}

export default Credits

const humans = [
  {
    name: 'Marcy Sutton',
    role: 'Instructor and Creator',
    description:
      'Marcy designed and created all the learning material for Testing Accessibility based on her years of expertise and experience as a senior engineer, award-winning accessibility expert and educator. Having tested and refined it through a series of live workshops, she’s created a holistic and practical guide to incorporate accessibility throughout design and development process.',
    twitter: 'marcysutton',
    image: require('../../public/credits/marcy-sutton.png'),
  },
  {
    name: 'Joel Hooks',
    role: 'Executive Producer & Tech Lead',
    description:
      'Joel provided direction and guidance for the development and production of Testing Accessibility throughout the process. He also served as the technical architect and lead developer for the course infrastructure.',
    twitter: 'jhooks',
    image: require('../../public/credits/joel-hooks.jpg'),
  },
  {
    name: 'Taylor Bell',
    role: 'Producer',
    description:
      'Taylor collaborated closely with Marcy on designing the curriculum and transforming the live workshop material into a self-paced learning experience. He provided instructional design, writing, planning, workshop facilitation, project coordination, and marketing support.',
    twitter: 'taylorbell',
    image: require('../../public/credits/taylor-bell.jpeg'),
  },
  {
    name: 'Michelle Holik',
    role: 'Illustrator',
    description:
      'Michelle created all the delightful illustrations, helping translate the concepts taught in Testing Accessibility into a hiking/camping visual narrative.',
    twitter: 'michelleholik',
    image: require('../../public/credits/michelle-holik.jpeg'),
  },
  {
    name: 'Nicoll Guarnizo',
    role: 'Associate Producer',
    description:
      'Nicoll helped migrate Testing Accessibility’s content into the course infrastructure.',
    twitter: 'guarnizonicoll',
    image: require('../../public/credits/nicoll-guarnizo.jpeg'),
  },
  {
    name: 'Vojta Holik',
    role: 'Product Designer & Developer, Art Director ',
    description:
      'Vojta is responsible for the UI/UX design and development for Testing Accessibility. He also did back-end development work to set up the content infrastructure and provided art direction for the illustrations.',
    twitter: 'vjthlk',
    image: require('../../public/credits/vojta-holik.jpg'),
  },
  {
    name: 'Lauro Silva',
    role: 'Instructional Designer',
    description:
      'Lauro helped with planning the workshop material’s scope and structure and outlining topics, learner outcomes, and assessment examples.',
    twitter: 'laurosilvacom',
    image: require('../../public/credits/lauro-silva.jpeg'),
  },
]

const instructor = first(humans)
const description =
  'Bringing Testing Accessibility to you is a collaboration between Marcy Sutton and the team behind egghead.io. Marcy created the content, while the rest of the team provided planning, design, development, and delivery support.'
