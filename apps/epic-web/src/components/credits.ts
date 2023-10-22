import first from 'lodash/first'

type Human = {
  name: string
  role?: string
  image: string
  xHandle?: string
  website?: string
  description?: string
}

export const team: Human[] = [
  {
    name: 'Kent C. Dodds',
    role: 'Instructor and Creator',
    description:
      'Kent designed, created and recorded the learning material for Epic Web. He’s rigorously tested the content in a series of live workshops and revised it based on feedback from learners. This resulted in a collection of professional, exercise-driven, self-paced workshops that offer a deep-dive into full-stack development, leveraging modern technologies to achieve first-class user experiences with a high level of collaborative maintainability and simplicity.',
    xHandle: 'kentcdodds',
    website: 'https://kentcdodds.com',
    image: require('../../public/credits/kent-c-dodds.png'),
  },
  {
    name: 'Joel Hooks',
    role: 'Executive Producer & Tech Lead',
    description:
      'Joel provided direction and guidance for the development and production of Epic Web throughout the process. He also served as the technical architect, leading the development and infrastructure work.',
    xHandle: 'jhooks',
    website: 'https://joelhooks.com',
    image: require('../../public/credits/joel-hooks.jpg'),
  },
  {
    name: 'Taylor Bell',
    role: 'Producer',
    description:
      'Taylor provided instructional design, writing, planning, project coordination, and marketing support.',
    xHandle: 'taylorbell',
    website: 'https://transcriptautomation.ai',
    image: require('../../public/credits/taylor-bell.jpg'),
  },
  {
    name: 'Nicoll Guarnizo',
    role: 'Associate Producer',
    description:
      'Nicoll lead the content migration into the course infrastructure and did QA reviews to identify fixes needed ahead of launch. She also provided support in setting up workshop events.',
    xHandle: 'guarnizonicoll',
    image: require('../../public/credits/nicoll-guarnizo.jpg'),
  },
  {
    name: 'Vojta Holik',
    role: 'Product Designer & Developer',
    description:
      'Vojta is responsible for the UI/UX design and development for Epic Web. He also provided the art direction.',
    xHandle: 'vojta_holik',
    website: 'https://vojta.io',
    image: require('../../public/credits/vojta-holik.jpg'),
  },
  {
    name: 'Maxime Bourgeois',
    role: 'Illustrator',
    description:
      'Maxime created sleak space-themed illustrations for Epic Web.',
    xHandle: 'mMaximalGFX',
    website: 'https://bento.me/maximebourgeois',
    image: require('../../public/credits/maxime-bourgeois.jpg'),
  },
  {
    name: 'Haze Provinsal',
    role: 'Video Editor',
    description:
      'Haze did all the video editing for Epic Web to ensure a smooth viewing experience.',
    xHandle: 'HazeProvinsal',
    image: require('../../public/credits/haze-provinsal.png'),
  },
  {
    name: 'Josh Branchaud',
    role: 'Developer',
    description:
      'Josh did back-end development work on the platform Epic Web is built on.',
    xHandle: 'jbrancha',
    website: 'https://joshbranchaud.com',
    image: require('../../public/credits/josh-branchaud.jpeg'),
  },
]

export const instructor = first(team)
export const description =
  'Bringing Epic Web to you is a collaboration between Kent C. Dodds and the team behind badass.dev. Kent created, designed and recorded all the content, while the rest of the team provided planning, design, development, and delivery support.'
