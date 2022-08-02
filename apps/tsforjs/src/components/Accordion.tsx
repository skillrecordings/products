import React, {useState} from 'react'
import Image from 'next/image'

export default function Accordion() {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  const handleClick = () => {
    setIsAccordionOpen(!isAccordionOpen)
  }
  return (
    <>
      <div className="px-4 ">
        <div className="relative block max-w-5xl p-6 mx-auto -mt-16 text-lg bg-stone-900 rounded shadow-2xl">
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
                    <>
                      {module.content.map((content) => (
                        <li className="ml-16">{content}</li>
                      ))}
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  )
}

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
