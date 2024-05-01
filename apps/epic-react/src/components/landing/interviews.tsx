import Image from 'next/image'

const data = [
  {
    img: '/experts-images/01-tanner-linsley.webp',
    title: 'Creating Open Source Libraries with Tanner Linsley',
    duration: '39m',
  },
  {
    img: '/experts-images/02-josh-comeau.webp',
    title: 'Animations and Interactions with Josh Comeau',
    duration: '37m',
  },
  {
    img: '/experts-images/03-guillermo-rauch.webp',
    title: 'Next.js and Vercel with Guillermo Rauch',
    duration: '40m',
  },
  {
    img: '/experts-images/04-ben-ilegbodu.webp',
    title: 'Building React-based Design Systems with Ben Ilegbodu',
    duration: '34m',
  },
  {
    img: '/experts-images/05-tejas-kumar.webp',
    title: 'The React Ecosystem with Tejas Kumar',
    duration: '28m',
  },
  {
    img: '/experts-images/06-michael-chan.webp',
    title: 'Encapsulation and Styling with Michael Chan',
    duration: '39m',
  },
  {
    img: '/experts-images/07-paul-henschel.webp',
    title: '3D Animation in the Browser with Paul Henschel',
    duration: '39m',
  },
  {
    img: '/experts-images/08-jenn-creighton.webp',
    title: 'Best Practices for Maintainers with Jenn Creighton',
    duration: '29m',
  },
  {
    img: '/experts-images/09-samantha-bretous.webp',
    title: 'Breaking into Tech with Samantha Bretous',
    duration: '24m',
  },
  {
    img: '/experts-images/10-monica-powell.webp',
    title: 'Best Practices of Server-Side Rendering with Monica Powell',
    duration: '31m',
  },
  {
    img: '/experts-images/11-artem-zakharchenko.webp',
    title: 'Mock Service Worker (MSW) with Artem Zakharchenko',
    duration: '32m',
  },
  {
    img: '/experts-images/12-rachel-nabors.webp',
    title: 'React and React Native documentation with Rachel Nabors',
    duration: '42m',
  },
  {
    img: '/experts-images/13-brian-vaughn.webp',
    title: 'React Developer Tools with Brian Vaughn',
    duration: '49m',
  },
]

const Interviews = () => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:-mx-6 sm:grid-cols-2 sm:gap-4">
      {data.map((interview) => {
        return (
          <div
            key={interview.title}
            className="flex items-center space-x-4 rounded-lg border border-er-gray-200 p-3 duration-150 hover:scale-105 sm:p-5"
          >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full sm:h-24 sm:w-24">
              <Image
                src={interview.img}
                alt={interview.title}
                width={160}
                height={160}
                className="!m-0"
              />
            </div>
            <div>
              <h5 className="text-base font-semibold leading-6">
                {interview.title}
              </h5>
              <div className="text-sm text-er-gray-500">
                Bonus Interview ・ {interview.duration}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Interviews
