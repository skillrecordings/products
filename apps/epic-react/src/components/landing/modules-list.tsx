import Image from 'next/image'

const data = [
  {
    img: '/modules-images/01-react-fundamentals.webp',
    title: 'React Fundamentals',
    duration: '1h 51m',
  },
  {
    img: '/modules-images/02-react-hooks.webp',
    title: 'React Hooks',
    duration: '2h 24m',
  },
  {
    img: '/modules-images/03-advanced-react-hooks.webp',
    title: 'Advanced React Hooks',
    duration: '1h 14m',
  },
  {
    img: '/modules-images/04-advanced-react-patterns.webp',
    title: 'Advanced React Patterns',
    duration: '1h 19m',
  },
  {
    img: '/modules-images/05-react-perfomance.webp',
    title: 'React Perfomance',
    duration: '2h 14m',
  },
  {
    img: '/modules-images/06-testing-react-apps.webp',
    title: 'Testing React Apps',
    duration: '2h 1m',
  },
  {
    img: '/modules-images/07-react-suspense.webp',
    title: 'React Suspense',
    duration: '1h 34m',
  },
  {
    img: '/modules-images/08-build-an-epic-react-app.webp',
    title: 'Build an Epic React App',
    duration: '7h 7m',
  },
]

const ModulesList = () => {
  return (
    <div>
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

export default ModulesList
