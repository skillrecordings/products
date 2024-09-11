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
