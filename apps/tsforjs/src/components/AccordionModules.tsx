import React from 'react'
import {styled} from '@stitches/react'
import * as Accordion from '@radix-ui/react-accordion'
import {ChevronDownIcon} from '@modulz/radix-icons'
export const Collapse = Accordion.Root

export const AccordionChevron = styled(ChevronDownIcon, {
  transition: 'transform 300ms',
  '[data-state=open] &': {transform: 'rotate(180deg)'},
})

const AccordionModules = () => (
  <>
    <div className="px-4">
      <div className="relative block max-w-5xl p-6 mx-auto -mt-16 text-lg bg-stone-900 rounded shadow-2xl">
        <dl className="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-2 gap-4 text-white">
          {modules.map((module) => (
            <Collapse type="multiple" className=" ">
              <Accordion.Item value="item-1">
                <Accordion.Header>
                  <Accordion.Trigger>
                    <dd>
                      <p className="ml-9 text-left">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500 pb-20 font-bold mr-3 justify-items-start">
                          {module.number}.
                        </span>
                        {module.title}
                        <span>
                          {module.content && (
                            <AccordionChevron
                              aria-hidden
                              className="inline-block ml-4"
                            />
                          )}
                        </span>
                      </p>
                    </dd>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content>
                  <dd>
                    {module.content && (
                      <>
                        {module.content.map((content) => (
                          <li className="ml-16">{content}</li>
                        ))}
                      </>
                    )}
                  </dd>
                </Accordion.Content>
              </Accordion.Item>
            </Collapse>
          ))}
        </dl>
      </div>
    </div>
  </>
)

export default AccordionModules

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
