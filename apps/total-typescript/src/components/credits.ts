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
    name: 'Matt Pocock',
    role: 'Instructor & Creator',
    description:
      'Matt designed, created and recorded the learning material for Total TypeScript. He’s tested and refined the material through live workshops and has created a collection of professional, exercise-driven, in-depth, self-paced TypeScript workshops to help you build your understanding and achieve TypeScript wizardry.',
    twitter: 'mattpocockuk',
    image: require('../../public/matt-pocock.jpg'),
  },
  {
    name: 'Joel Hooks',
    role: 'Executive Producer & Tech Lead',
    description:
      'Joel directed and guided the development and production of Total TypeScript. He also served as the technical architect, leading the development and infrastructure work.',
    twitter: 'jhooks',
    image: require('../../public/credits/joel-hooks.jpg'),
  },
  {
    name: 'Taylor Bell',
    role: 'Producer',
    description:
      'Taylor provided instructional design support and led creating Total TypeScript’s complementary written content. He also provided additional writing, workshop facilitation, planning, and marketing support.',
    twitter: 'taylorbell',
    image: require('../../public/credits/taylor-bell.jpeg'),
  },
  {
    name: 'Michelle Holik',
    role: 'Illustrator',
    description:
      'Michelle handcrafted the stunning and spellbinding illustrations for Total TypeScript to bring Matt’s wizardry narrative to life.',
    twitter: 'michelleholik',
    image: require('../../public/credits/michelle-holik.jpeg'),
  },
  {
    name: 'Vojta Holik',
    role: 'Product Designer & Developer',
    description:
      'Vojta did the UI/UX design and development for Total TypeScript.',
    twitter: 'vjthlk',
    image: require('../../public/credits/vojta-holik.jpg'),
  },
  {
    name: 'Josh Branchaud',
    role: 'Developer',
    description: 'Josh did back-end development work.',
    twitter: 'jbrancha',
    image: require('../../public/credits/josh-branchaud.jpeg'),
  },
  {
    name: 'Megan Reckner',
    role: 'Project Manager',
    description:
      'Megan provided project management and facilitated the team’s production, planning, development and delivery efforts.',
    image: require('../../public/credits/megan-reckner.png'),
  },
  {
    name: 'Nicoll Guarnizo',
    role: 'Associate Producer',
    description:
      'Nicoll created complementary written content for Total TypeScript. She also did content migration and QA reviews to identify fixes needed ahead of launch.',
    twitter: 'guarnizonicoll',
    image: require('../../public/credits/nicoll-guarnizo.jpeg'),
  },
  {
    name: 'Creeland Provinsal',
    role: 'Associate Producer',
    description:
      'Cree created complementary written content for Total TypeScript and did content migration.',
    twitter: 'CProvinsal',
    image: require('../../public/credits/cree-provinsal.png'),
  },
  {
    name: 'Haze Provinsal',
    role: 'Video Editor',
    description:
      'Haze did the video editing for all the interviews featured in Total TypeScript.',
    twitter: 'HazeProvinsal',
    image: require('../../public/credits/haze-provinsal.jpg'),
  },
  {
    name: 'Lucas Steinmacher',
    role: 'Content Reviewer ',
    description:
      'Lucas did QA testing of Total TypeScript’s learner experience to check for fixes needed ahead of the launch.',
    image: require('../../public/credits/lucas-steinmacher.jpeg'),
  },
]
export const instructor = first(team)
export const description =
  'Bringing Total TypeScript to you is a collaboration between Matt Pocock and the team behind badass.dev. Matt created the content, while the rest of the team provided planning, design, development, and delivery support.'
