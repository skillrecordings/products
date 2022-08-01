import type {NextPage} from 'next'
import React, {useState} from 'react'
import Image from 'next/image'

const Home: NextPage = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  const handleClick = () => {
    setIsAccordionOpen(!isAccordionOpen)
  }
  return (
    <>
      <div className="relative w-full">
        <div className="bg-black">
          <div className="flex h-screen justify-center items-center">
            <div className="text-center">
              <h1 className="pb-10 text-5xl md:text-6xl xl:text-7xl 2xl:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
                Type errors are ✨annoying✨
              </h1>
              <div className="text-white font-bold pt-10 px-20 sm:text-xl md:text-2xl xl:text-4xl 2xl:text-6xl">
                <p>
                  When you’re used to the carefree life of declaring variables
                  without worrying about what they’ll eventually become or the
                  functions they’ll interact with, adding types just seems
                  like...
                </p>
                <p className="pt-6 pb-20">
                  a bunch of extra work for little reward.
                </p>
                <a href="#intro">
                  <Image
                    width={40}
                    height={20}
                    src="https://res.cloudinary.com/tsforjs/image/upload/v1658263809/website/chevrondown_nnqrfs.png"
                    alt="down button"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="justify-center items-center" id="intro">
            <div className="text-center">
              <div className="pb-10 text-5xl md:text-6xl xl:text-7xl 2xl:text-9xl font-bold">
                <p>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
                    Typescript
                  </span>
                  <span className="text-teal-400 font-normal italic">
                    {' '}
                    for{' '}
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
                    Javascript
                  </span>
                </p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
                  Developers
                </p>
              </div>
              <p className="inline-block px-5 py-1 text-xs tracking-wider rounded-full sm:text-sm bg-gradient-to-r from-purple-300 to-pink-300">
                NEW COURSE
              </p>
            </div>
          </div>
          <div>
            <h3 className="pt-12 text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500 pb-20">
              Course Modules
            </h3>
            <div className="px-4 pb-80">
              <div className="relative block max-w-4xl p-6 mx-auto -mt-16 text-lg bg-stone-900 rounded shadow-2xl">
                <dl className="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-2 gap-4 text-white ">
                  {modules.map((module) => (
                    <div className="relative">
                      <dt>
                        <p className="ml-9">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500 pb-20 font-bold mr-3">
                            {module.number}.
                          </span>
                          {module.title}
                          <span onClick={handleClick} className="ml-4">
                            {module.content && (
                              <Image
                                width={10}
                                height={10}
                                src={
                                  isAccordionOpen
                                    ? 'https://res.cloudinary.com/tsforjs/image/upload/v1658263809/website/angelup_nrz6jc.svg'
                                    : 'https://res.cloudinary.com/tsforjs/image/upload/v1658263809/website/angeldown_px1j64.svg'
                                }
                                alt="chevron down arrow"
                              />
                            )}
                          </span>
                        </p>
                      </dt>
                      <dd>
                        {module.content && isAccordionOpen && (
                          <li className=""> {module.content} </li>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

export const modules = [
  {
    number: 1,
    title: 'Why TypeScript',
  },
  {
    number: 2,
    title: 'Configuring Your Environment',
  },
  {
    number: 3,
    title: 'Intro to Types',
    content: [
      'Type Inference',
      'Basic Types',
      'Object Types',
      'Enums',
      'Function Types',
    ],
  },
  {
    number: 4,
    title: 'Type Aliases, Unions, and Intersections',
    content: ['Type Aliases', 'Interfaces', 'Unions', 'Intersections'],
  },
  {
    number: 5,
    title: 'Advanced Types',
    content: [
      'Conditional Types',
      'Template Literal Types',
      'Type Operators',
      'Generics',
      'Call Signatures',
      'Type-Driven Development',
    ],
  },
  {
    number: 6,
    title: 'Error Handling',
  },
  {
    number: 7,
    title: 'Real-World Application Development',
    content: [
      'Configuration',
      'Building from Scratch',
      'Converting to TypeScript from JavaScript',
    ],
  },
]
