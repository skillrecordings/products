import Image from 'next/image'

const data = [
  {
    img: '/modules-images/React_Fundamentals.png',
    title: 'React Fundamentals',
    duration: '10 sections, 56 lessons',
  },
  {
    img: '/modules-images/React_Hooks.png',
    title: 'React Hooks',
    duration: '6 sections, 29 lessons',
  },
  {
    img: '/modules-images/Advenced_React_Hooks.png',
    title: 'Advanced React APIs',
    duration: '9 sections, 36 lessons',
  },
  {
    img: '/modules-images/React_Suspense.png',
    title: 'React Suspense',
    duration: '6 sections, 29 lessons',
  },
  {
    img: '/modules-images/Advanced_React_Patterns.png',
    title: 'Advanced React Patterns',
    duration: '8 sections, 30 lessons',
  },
  {
    img: '/modules-images/React_Performance.png',
    title: 'React Perfomance',
    duration: '8 sections, 33 lessons',
  },
  {
    img: '/modules-images/React_Server_Components.png',
    title: 'React Server Components',
    duration: '5 sections, 27 lessons',
  },
  // {
  //   img: '/modules-images/06-testing-react-apps.webp',
  //   title: 'Testing React Apps',
  //   duration: '2h 1m',
  // },
  // {
  //   img: '/modules-images/08-build-an-epic-react-app.webp',
  //   title: 'Build an Epic React App',
  //   duration: '7h 7m',
  // },
]

const ModulesList = () => {
  return (
    <div className="not-prose mx-auto w-full max-w-3xl">
      {data.map((module) => {
        return (
          <div key={module.title} className="flex items-center">
            <div className="-ml-3 h-20 w-20 p-3">
              <Image
                src={module.img}
                alt={module.title}
                width={160}
                height={160}
                className="!m-0"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span>{module.title}</span>
              <span className="text-er-gray-500">({module.duration})</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const ModulesListWithDescriptions = ({
  modules,
}: {
  modules: Workshop[]
}) => {
  return (
    <ul className="not-prose mx-auto my-16 flex w-full max-w-4xl flex-col gap-10">
      {modules.map((module, index) => {
        return (
          <li className="flex flex-col items-center gap-10 sm:items-start md:flex-row">
            <Image
              src={module.image}
              alt={module.title}
              width={200}
              height={200}
            />
            <div>
              <h3 className="mb-3 text-balance text-center text-3xl font-semibold leading-tight sm:text-left">
                {module.title}
              </h3>
              <h4 className="mb-5 text-balance text-center text-lg font-medium leading-normal text-react sm:text-left lg:text-xl">
                {data[index].duration} {module.tagline && '• '}
                {module.tagline}
              </h4>
              <div className="mb-5 text-balance text-center text-lg font-medium leading-normal sm:text-left lg:text-lg lg:leading-[1.77]">
                {module.description}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default ModulesList
