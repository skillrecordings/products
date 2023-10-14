import first from 'lodash/first'

type Human = {
  name: string
  role?: string
  image: string
  xHandle?: string
  description?: string
}

export const team: Human[] = [
  {
    name: 'Kent C. Dodds',
    role: 'Instructor and Creator',
    description:
      'Kent designed, created and recorded the learning material for Epic Web. He’s rigorously tested the content in a series of live workshops and revised it based on feedback from learners, This resulted in a collection of professional, exercise-driven, in-depth, self-paced workshops that offers you a deep-dive into full-stack development, leveraging modern technologies to achieve first-class user experiences with an unprecedented level of collaborative maintainability and simplicity.',
    xHandle: 'kentcdodds',
    image: require('../../public/credits/kent-c-dodds.png'),
  },
  {
    name: 'Joel Hooks',
    role: 'Executive Producer & Tech Lead',
    description:
      'Joel provided direction and guidance for the development and production of Epic Web throughout the process. He also served as the technical architect and lead developer for the course infrastructure.',
    xHandle: 'jhooks',
    image: require('../../public/credits/joel-hooks.png'),
  },
  {
    name: 'Taylor Bell',
    role: 'Producer',
    description:
      'Taylor provided instructional design, writing, planning, workshop facilitation, project coordination, and marketing support.',
    xHandle: 'taylorbell',
    image: require('../../public/credits/taylor-bell.png'),
  },
  {
    name: 'Vojta Holik',
    role: 'Product Designer & Developer, Art Director ',
    description:
      'Vojta is responsible for the UI/UX design and development for Epic Web, and provided art direction for the illustrations.',
    xHandle: 'vjthlk',
    image: require('../../public/credits/vojta-holik.png'),
  },
  {
    name: 'Nicoll Guarnizo',
    role: 'Associate Producer',
    description:
      'Nicoll lead the content migration into the course infrastructure and did QA reviews to identify fixes needed ahead of launch.',
    xHandle: 'guarnizonicoll',
    image: require('../../public/credits/nicoll-guarnizo.png'),
  },
  {
    name: 'Maxime Bourgeois',
    role: 'Illustrator',
    description:
      'Maxime created all the delightful illustrations used throughout Epic Web',
    xHandle: 'mMaximalGFX',
    image: require('../../public/credits/maxime-bourgeois.png'),
  },
  {
    name: 'Haze Provinsal',
    role: 'Content Production',
    description:
      'Haze did all video editing for each of the 453 videos to ensure a smooth viewing experience.',
    xHandle: 'HazeProvinsal',
    image: require('../../public/credits/haze-provinsal.png'),
  },
]

export const instructor = first(team)
export const description =
  'Bringing Epic Web to you is a collaboration between Kent C. Dodds and the team behind badass.dev. Kent created, designed and recorded all the content, while the rest of the team provided planning, design, development, and delivery support.'
