import first from 'lodash/first'

type Human = {
  name: string
  role?: string
  image: string
  twitter?: string
  description?: string
}

export const team: Human[] = [
  {
    name: 'Marcy Sutton',
    role: 'Instructor and Creator',
    description:
      'Marcy designed and created all the learning material for Testing Accessibility based on her years of expertise and experience as a senior engineer, award-winning accessibility expert and educator. Having tested and refined it through a series of live workshops, she’s created a holistic and practical guide to incorporate accessibility throughout design and development process.',
    twitter: 'marcysutton',
    image: require('../../../public/credits/marcy-sutton.png'),
  },
  {
    name: 'Joel Hooks',
    role: 'Executive Producer & Tech Lead',
    description:
      'Joel provided direction and guidance for the development and production of Testing Accessibility throughout the process. He also served as the technical architect and lead developer for the course infrastructure.',
    twitter: 'jhooks',
    image: require('../../../public/credits/joel-hooks.jpg'),
  },
  {
    name: 'Taylor Bell',
    role: 'Producer',
    description:
      'Taylor collaborated closely with Marcy on designing the curriculum and transforming the live workshop material into a self-paced learning experience. He provided instructional design, writing, planning, workshop facilitation, project coordination, and marketing support.',
    twitter: 'taylorbell',
    image: require('../../../public/credits/taylor-bell.jpeg'),
  },
  {
    name: 'Michelle Holik',
    role: 'Illustrator',
    description:
      'Michelle created all the delightful illustrations, helping translate the concepts taught in Testing Accessibility into a hiking/camping visual narrative.',
    twitter: 'michelleholik',
    image: require('../../../public/credits/michelle-holik.jpeg'),
  },
  {
    name: 'Nicoll Guarnizo',
    role: 'Associate Producer',
    description:
      'Nicoll helped migrate Testing Accessibility’s content into the course infrastructure.',
    twitter: 'guarnizonicoll',
    image: require('../../../public/credits/nicoll-guarnizo.jpeg'),
  },
  {
    name: 'Vojta Holik',
    role: 'Product Designer & Developer, Art Director ',
    description:
      'Vojta is responsible for the UI/UX design and development for Testing Accessibility. He also did back-end development work to set up the content infrastructure and provided art direction for the illustrations.',
    twitter: 'vjthlk',
    image: require('../../../public/credits/vojta-holik.jpg'),
  },
  {
    name: 'Lauro Silva',
    role: 'Instructional Designer',
    description:
      'Lauro helped with planning the workshop material’s scope and structure and outlining topics, learner outcomes, and assessment examples.',
    twitter: 'laurosilvacom',
    image: require('../../../public/credits/lauro-silva.jpg'),
  },
]

export const contentReviewTeam: Human[] = [
  {
    name: 'Alana Hubbard',
    twitter: 'AlanaHubb',
    image: require('../../../public/credits/alana-hubbard.jpeg'),
  },
  {
    name: 'Megan Reckner',
    image: require('../../../public/credits/megan-reckner.png'),
  },
  {
    name: 'Lucas Minter',
    twitter: 'lucasminter2',
    image: require('../../../public/credits/lucas-minter.jpg'),
  },
  {
    name: 'Cree Provinsal',
    twitter: 'CProvinsal',
    image: require('../../../public/credits/cree-provinsal.png'),
  },
]

export const instructor = first(team)
export const description =
  'Bringing Testing Accessibility to you is a collaboration between Marcy Sutton and the team behind egghead.io. Marcy created the content, while the rest of the team provided planning, design, development, and delivery support.'
