import React from 'react'
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
import { Fence } from '@/components/Fence'

const Repl: React.FC<any> = ({ example, children }) => {
  return (
    <div className="not-prose">
      {example === 'ModuleCollection' && (
        <>
          <div className="rounded-xl bg-slate-100 p-10 dark:bg-slate-950">
            <Collection.Root module={tutorial}>
              <Collection.Metadata />
              <Collection.Sections>
                <Collection.Section>
                  <Collection.Lessons>
                    <Collection.Lesson />
                  </Collection.Lessons>
                </Collection.Section>
              </Collection.Sections>
              <Collection.Lessons>
                <Collection.Lesson />
              </Collection.Lessons>
            </Collection.Root>
          </div>
          <div>
            {/* <div>index.tsx</div>
      <div className='text-xs bg-slate-900'>
        <Fence language="tsx">
          {`
<Collection.Root module={tutorial}>
  <Collection.Metadata />
  <Collection.Sections>
    <Collection.Section>
      <Collection.Lessons>
        <Collection.Lesson />
      </Collection.Lessons>
    </Collection.Section>
  </Collection.Sections>
  <Collection.Lessons>
    <Collection.Lesson />
  </Collection.Lessons>
</Collection.Root>
          `}
          </Fence>
      </div> */}
          </div>
        </>
      )}
    </div>
  )
}

const tutorial = {
  github: {
    repo: 'react-typescript-tutorial',
    _type: 'github',
    title: 'React TypeScript Tutorial ',
  },
  description:
    "Get productive building applications with React and TypeScript with our interactive guide on React's types - from component props to useRef.",
  moduleType: 'tutorial',
  _id: '80c4e5f4-278d-4c33-ae90-da334a9cc6f5',
  title: 'React with TypeScript',
  image:
    'https://cdn.sanity.io/images/z9io1e0u/production/05ef9a8023fe078f08f8304e71206b0d3c24faa1-1000x1001.png',
  testimonials: [],
  id: '80c4e5f4-278d-4c33-ae90-da334a9cc6f5',
  _type: 'module',
  body: 'TypeScript\'s features and developer experience make a great combination with React, but it can be confusing to get started.\n\nWhat’s the best way to type component props? What are these weird `useRef` errors?\n\nThat\'s where this React with TypeScript tutorial comes in!\n\nStarting from the very beginning of bringing TS support to a React project, you\'ll soon find yourself properly typing hooks and mastering components. You’ll learn everything you need to know to get productive with React and TypeScript.\n\nTutorial topics include:\n\n* Reading React\'s type definitions to debug errors and ensure correct usage\n* Defining props for custom and `React.FC` function components.\n* Putting TypeScript\'s inference to work for you\n* Supporting component children\n* Typing and overriding event handlers\n* Utilizing `ComponentProps` to extract properties from imported components or HTML DOM elements\n* Understanding the APIs and typing for `useState`, `useCallback`, `useEffect`, and other React Hooks. By the end of this workshop, you\'ll be confident when using React with TypeScript in your own projects!\n\n<Testimonial author={{name: "Francisko de Moraes Rezende", image: "https://cdn.sanity.io/images/z9io1e0u/production/8e2b0b48599527885121568e19c761edd1c3e2ee-460x460.jpg"}}>Went through it and I think it\'s great! I wish this tutorial existed when I started my first gig 11 months ago. It teaches all the things I use on a daily basis and some that I didn\'t know; I was using the verbose way of getting HTML props in types until I went through the tutorial. This is my new go-to recommendation for people starting to work with TS+React. Thanks for creating this and making it free, Matt.</Testimonial>\n\n## Instructions\n\nThis React with TypeScript tutorial is split into several exercises. Each features a problem that encourages you to take an active, exploratory approach to finding a solution.\n\nYou\'ll need to:\n\n* Watch and read the problem introduction.\n* Check out the TypeScript or React documentation or dive into type definitions to look for help\n* Try a solution and check your work. There may be more than one way to solve the challenge! Whether you succeed or get stuck, watch and read the solution and check out the included code.\n\n## Prerequisites\n\nYou\'ll need a working knowledge of React, as well as foundational TypeScript knowledge. Working through the <a href="https://www.totaltypescript.com/tutorials/beginners-typescript" target="_blank" rel="noopener">Beginner\'s TypeScript Tutorial</a> is recommended.\n\n## Running the Exercises\n\nExercises can be worked on using the inline Stackblitz editor, or by <a href="https://gitpod.io/#https://github.com/total-typescript/react-typescript-tutorial" target="_blank" rel="noopener">opening the tutorial repo in Gitpod</a>. Online editors do not support the full feature set of a local VS Code installation (e.g. quickly jumping to type definitions).\n\nTo work locally, clone the <a href="https://github.com/total-typescript/react-typescript-tutorial" target="_blank" rel="noopener">React with TypeScript Tutorial repo</a>, and use a package manager to install dependencies. From there, check out the README for further instructions.',
  sections: [
    {
      _type: 'section',
      _updatedAt: '2023-05-02T15:31:50Z',
      title: 'Introduction',
      description: null,
      slug: 'introduction',
      lessons: [
        {
          solution: null,
          _id: '08c86517-8589-42bf-b495-d6ebebad6012',
          _type: 'explainer',
          _updatedAt: '2023-06-07T10:48:46Z',
          title: 'Adding React to a TypeScript Project',
          description:
            'There are a few steps to follow in order to add React to a TypeScript project.',
          slug: 'adding-react-to-a-typescript-project',
        },
        {
          title: 'TypeScript in React Frameworks',
          description:
            "Most frontend frameworks include optional TypeScript support, meaning you won't have to manually set it up.",
          slug: 'typescript-in-react-frameworks',
          solution: null,
          _id: 'fb2e3d6b-586a-4947-b596-8caef741aa14',
          _type: 'explainer',
          _updatedAt: '2023-06-08T09:17:36Z',
        },
        {
          _id: 'e0ebb8ce-a840-4508-8bb6-851011b1a129',
          _type: 'exercise',
          _updatedAt: '2023-06-08T10:12:20Z',
          title: 'Navigating JSX Types',
          description:
            'VS Code has a variety of features for working around your codebase when writing JSX.',
          slug: 'navigating-jsx-types',
          solution: {
            description: null,
            slug: 'navigating-jsx-types',
            _key: 'd0c4a2c7edc6',
            _type: 'solution',
            _updatedAt: '2023-06-08T10:12:20Z',
            title: 'Three Helpful Tools for Writing JSX',
          },
        },
      ],
      resources: [],
      _id: 'a22e3908-d22b-4319-846c-b35e0b92971e',
    },
    {
      title: 'Components',
      description: null,
      slug: 'components',
      lessons: [
        {
          title: 'Ensure Props are Present and Defined',
          description:
            "It's important to understand how to type props since you'll work with them every day in React.",
          slug: 'ensure-props-are-present-and-defined',
          solution: {
            _updatedAt: '2023-06-08T10:12:20Z',
            title: 'Four Approaches to Typing Props',
            description: null,
            slug: 'ensure-props-are-present-and-defined',
            _key: '37e9837e2f6d',
            _type: 'solution',
          },
          _id: 'e01f0543-6c4f-4474-bcee-1969ef9bd0e3',
          _type: 'exercise',
          _updatedAt: '2023-06-08T10:12:20Z',
        },
        {
          _updatedAt: '2023-06-08T10:12:20Z',
          title: 'Typing a Component as a Function',
          description:
            "React's Function Component React.FC has its own considerations for enabling proper type checking.",
          slug: 'typing-a-component-as-a-function',
          solution: {
            _type: 'solution',
            _updatedAt: '2023-06-08T10:12:20Z',
            title: 'Specifying Props for React.FC ',
            description: null,
            slug: 'typing-a-component-as-a-function',
            _key: '7631397a0b40',
          },
          _id: 'b80b4601-2410-43ab-befd-e6fcd2f7c2f3',
          _type: 'exercise',
        },
        {
          slug: 'solving-the-any-problem-with-children',
          solution: {
            slug: 'solving-the-any-problem-with-children',
            _key: '632729ee5341',
            _type: 'solution',
            _updatedAt: '2023-06-07T11:29:31Z',
            title: "Typing React's Children",
            description: null,
          },
          _id: '7d859add-63ce-4cef-a3cd-3af45d8a7f1d',
          _type: 'exercise',
          _updatedAt: '2023-06-07T11:29:31Z',
          title: 'Solving the any Problem with Children',
          description:
            "Many teams type React's children as any, but there is a better option.",
        },
        {
          slug: 'typing-event-handlers',
          solution: {
            slug: 'typing-event-handlers',
            _key: 'da32c608898c',
            _type: 'solution',
            _updatedAt: '2023-06-08T10:12:20Z',
            title: 'Choose the Correct Event Handler Type',
            description: null,
          },
          _id: 'fc0b6420-1752-499c-a5fe-2410d5c9c745',
          _type: 'exercise',
          _updatedAt: '2023-06-08T10:12:20Z',
          title: 'Typing Event Handlers',
          description:
            "Instead of guessing a handler's type, you should be specific.",
        },
        {
          _type: 'exercise',
          _updatedAt: '2023-06-07T11:29:31Z',
          title: 'Using HTML Props in React Components',
          description:
            'When building React components, there are a couple of options for proper typing based on the underlying HTML element.',
          slug: 'using-html-props-in-react-components',
          solution: {
            _key: 'c7c0f0ceffe8',
            _type: 'solution',
            _updatedAt: '2023-06-07T11:29:31Z',
            title: 'Add HTML Props to React Components',
            description: null,
            slug: 'using-html-props-in-react-components',
          },
          _id: '38990bf7-1b45-4ca8-b8e8-43888549debd',
        },
        {
          _updatedAt: '2023-06-21T15:54:20Z',
          title: 'Overriding and Removing Component Props ',
          description:
            "Components can have a lot of built-in props for things like event handlers that you don't always want, but there are a few techniques for overriding them.",
          slug: 'overriding-and-removing-component-props',
          solution: {
            description: null,
            slug: 'overriding-and-removing-component-props',
            _key: 'de2f90ca2104',
            _type: 'solution',
            _updatedAt: '2023-06-21T15:54:20Z',
            title: 'Techniques for Overriding Native Props',
          },
          _id: '87e6b064-97f1-49b5-96b1-63dea6e1481c',
          _type: 'exercise',
        },
        {
          _updatedAt: '2023-06-07T11:29:31Z',
          title: 'Extracting Props from Custom Components',
          description: null,
          slug: 'extracting-props-from-custom-components',
          solution: {
            slug: 'extracting-props-from-custom-components',
            _key: '35a5caaeaeca',
            _type: 'solution',
            _updatedAt: '2023-06-07T11:29:31Z',
            title: 'Use a Type Helper to Extract Component Props',
            description: null,
          },
          _id: '5f1376ae-8465-46c4-8c07-38efdcea44bc',
          _type: 'exercise',
        },
      ],
      resources: [],
      _id: '7549e573-a57a-42a6-a9d4-1090be265c08',
      _type: 'section',
      _updatedAt: '2023-05-02T15:38:01Z',
    },
    {
      _id: '24877839-d96e-4c56-bde6-71f81934051c',
      _type: 'section',
      _updatedAt: '2023-05-02T22:52:20Z',
      title: 'Hooks',
      description: null,
      slug: 'hooks',
      lessons: [
        {
          title: 'Properly Typing useState',
          description:
            "It's common for the useState hook to be called with an empty array, which TypeScript has issues inferring. Follow this approach for proper typing.",
          slug: 'properly-typing-usestate',
          solution: {
            _key: '4e2e70af7286',
            _type: 'solution',
            _updatedAt: '2023-06-07T11:29:31Z',
            title: "Fix useState's never[] Error",
            description: null,
            slug: 'properly-typing-usestate',
          },
          _id: '25b0ab74-393b-4a2a-bf6c-75e95cdebe8f',
          _type: 'exercise',
          _updatedAt: '2023-06-07T11:29:31Z',
        },
        {
          _id: '585ccbbd-38bf-4ae8-89b6-20c1e8654d4e',
          _type: 'exercise',
          _updatedAt: '2023-06-07T11:29:31Z',
          title: 'Typing useState with undefined',
          description:
            'The useState hook uses function overloads to handle cases where you may or may not want to pass an intial value.',
          slug: 'typing-usestate-with-undefined',
          solution: {
            _key: 'cb3bb666c1bf',
            _type: 'solution',
            _updatedAt: '2023-06-07T11:29:31Z',
            title: 'Specifying types for useState',
            description: null,
            slug: 'typing-usestate-with-undefined',
          },
        },
        {
          description:
            "There's a strange property of the useState API that TypeScript treats in a specific way.",
          slug: 'calling-usestate-with-excess-properties',
          solution: {
            _key: '0da980578e35',
            _type: 'solution',
            _updatedAt: '2023-06-08T10:12:20Z',
            title: 'Going from Function Comparisons to Object Comparisons',
            description: null,
            slug: 'calling-usestate-with-excess-properties',
          },
          _id: 'c3441d36-2221-4378-b623-285c534b9f52',
          _type: 'exercise',
          _updatedAt: '2023-06-08T10:12:20Z',
          title: 'Calling useState with Excess Properties',
        },
        {
          _id: 'acba73e2-e253-49c2-8aa7-5c1301c95712',
          _type: 'exercise',
          _updatedAt: '2023-06-08T10:12:20Z',
          title: 'Solving Errors with useEffect',
          description:
            "The useEffect Hook isn't generic, so you need to follow its API to use it properly.",
          slug: 'solving-errors-with-useeffect',
          solution: {
            description: null,
            slug: 'solving-errors-with-useeffect',
            _key: '90fbbfeff5c6',
            _type: 'solution',
            _updatedAt: '2023-06-08T10:12:20Z',
            title: 'Properly use the useEffect API',
          },
        },
        {
          _type: 'exercise',
          _updatedAt: '2023-06-07T11:29:31Z',
          title: 'Typing the useCallback Hook',
          description:
            "By examining a function's type definitions, you can properly type React's useCallBack Hook",
          slug: 'typing-the-usecallback-hook',
          solution: {
            slug: 'typing-the-usecallback-hook',
            _key: '9e9ee097e3d6',
            _type: 'solution',
            _updatedAt: '2023-06-07T11:29:31Z',
            title: 'Have TypeScript Infer the Callback Function Type',
            description: null,
          },
          _id: '643c8b36-cda0-40b8-8955-fefed87379cd',
        },
        {
          _updatedAt: '2023-06-08T10:12:20Z',
          title: 'Typing the useMemo Hook',
          description:
            'Not all hooks use the same type signature. Dive in to fix errors and specify the return type of a memoized value.',
          slug: 'typing-the-usememo-hook',
          solution: {
            slug: 'typing-the-usememo-hook',
            _key: '8a1301a558f4',
            _type: 'solution',
            _updatedAt: '2023-06-08T10:12:20Z',
            title: "Specify or Infer useMemo's Return Type",
            description: null,
          },
          _id: 'c194ff25-6ac0-440c-b1c8-286e8801dfbc',
          _type: 'exercise',
        },
        {
          slug: 'basic-useref-typing',
          solution: {
            _key: 'd841117ca4a9',
            _type: 'solution',
            _updatedAt: '2023-06-08T10:12:20Z',
            title: 'Typing the useRef Hook',
            description: null,
            slug: 'basic-useref-typing',
          },
          _id: 'e0436acd-8098-40db-ae30-b1b87aa19a31',
          _type: 'exercise',
          _updatedAt: '2023-06-08T10:12:20Z',
          title: 'Basic useRef Typing',
          description:
            "There are three type definitions for useRef. Let's start by looking at the most basic.",
        },
        {
          title: 'Refs in React',
          description:
            'There are a few different ways to use refs in React, along with some rules to follow.',
          slug: 'refs-in-react',
          solution: null,
          _id: '324e53d3-6264-44c4-a6b6-12cc6e74e69f',
          _type: 'explainer',
          _updatedAt: '2023-06-07T10:48:46Z',
        },
        {
          description: null,
          slug: 'useref-with-html-elements',
          solution: {
            title: 'Specify the Initial Value with useRef',
            description: null,
            slug: 'useref-with-html-elements',
            _key: 'aa980e305256',
            _type: 'solution',
            _updatedAt: '2023-06-08T10:12:20Z',
          },
          _id: 'ccbfd30f-82b8-421c-957c-674c02ac599d',
          _type: 'exercise',
          _updatedAt: '2023-06-08T10:12:20Z',
          title: 'useRef with HTML Elements',
        },
        {
          slug: 'making-a-read-only-ref-mutable',
          solution: {
            _type: 'solution',
            _updatedAt: '2023-06-07T11:29:31Z',
            title: 'Targeting a useRef Overload',
            description: null,
            slug: 'making-a-read-only-ref-mutable',
            _key: '62ac5a60fb59',
          },
          _id: '63473bed-f8ef-4c37-aead-2bbe8ffb3c50',
          _type: 'exercise',
          _updatedAt: '2023-06-07T11:29:31Z',
          title: 'Making a Read-Only Ref Mutable',
          description: null,
        },
        {
          description:
            "Leveraging one of TypeScript's built-in features allows you to specifically type the state and actions for a reducer function in React.",
          slug: 'typing-state-and-actions-for-usereducer',
          solution: {
            _key: '3c30078edad1',
            _type: 'solution',
            _updatedAt: '2023-06-08T10:12:20Z',
            title: 'Add types for the useReducer Hook',
            description: null,
            slug: 'typing-state-and-actions-for-usereducer',
          },
          _id: 'a4964276-52ef-412e-ae18-ac3498244e48',
          _type: 'exercise',
          _updatedAt: '2023-06-08T10:12:20Z',
          title: 'Typing State and Actions for  useReducer',
        },
      ],
      resources: [],
    },
  ],
  state: 'published',
  _updatedAt: '2023-07-07T00:22:44Z',
  cta: {
    body: [
      {
        _key: 'ff1fa58d72c0',
        image: {
          public_id:
            'react-with-typescript-live-workshop-cta-vertical_2x_azscvv',
          metadata: [],
          created_by: {
            id: 'a26995c19a5bbbeba9f4215b5dd2b1',
            type: 'user',
          },
          _version: 1,
          bytes: 52527,
          width: 388,
          _type: 'cloudinary.asset',
          version: 1684331280,
          access_mode: 'public',
          uploaded_by: {
            type: 'user',
            id: 'a26995c19a5bbbeba9f4215b5dd2b1',
          },
          duration: null,
          resource_type: 'image',
          secure_url:
            'https://res.cloudinary.com/total-typescript/image/upload/v1684331280/react-with-typescript-live-workshop-cta-vertical_2x_azscvv.png',
          created_at: '2023-05-17T13:48:00Z',
          _key: 'nF69NHU3SLX_qqxSGHnmv',
          url: 'http://res.cloudinary.com/total-typescript/image/upload/v1684331280/react-with-typescript-live-workshop-cta-vertical_2x_azscvv.png',
          tags: [],
          height: 848,
          access_control: [],
          format: 'png',
          type: 'upload',
        },
        _type: 'bodyImage',
        alt: 'LIVE WORKSHOP: React with TypeScript, June 9th, 2023',
        href: 'https://ti.to/total-typescript/react-with-typescript-06-16-23',
      },
      {
        style: 'normal',
        _key: '97d850863251',
        markDefs: [
          {
            href: 'https://ti.to/total-typescript/react-with-typescript-06-16-23',
            _key: '35d9791d134b',
            blank: true,
            _type: 'link',
          },
        ],
        children: [
          {
            text: 'Seats are limited. ',
            _key: '30474d45dff1',
            _type: 'span',
            marks: [],
          },
          {
            _type: 'span',
            marks: ['35d9791d134b'],
            text: 'Grab your ticket today',
            _key: 'a71580ca037a',
          },
          {
            _type: 'span',
            marks: [],
            text: '.',
            _key: '5c99c148a5fb',
          },
        ],
        _type: 'block',
      },
    ],
    expiresAt: '2023-06-08',
  },
  slug: {
    current: 'react-with-typescript',
    _type: 'slug',
  },
  ogImage:
    'https://res.cloudinary.com/total-typescript/image/upload/v1683126745/react-with-typescript-tutorial/card_2x_zmrrsv.png',
}

export { Repl }
