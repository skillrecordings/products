import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import Image from 'next/legacy/image'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'

const features = [
  {
    title: 'Launch the prompt from anywhere as part of your flow',
    description:
      'Default shortcut to open KitApp is ~CMD+;~ but you can change it to whatever you like!',
    image: require('../../public/assets/infographics/launch.png'),
  },
  {
    title: 'Launch scripts with keyboard shortcuts',
    description:
      'Scripts can hold varieties of metadata in form of JS comments, including a keyboard shortcut to launch the script.',
    image: require('../../public/assets/infographics/shortcut.png'),
  },
  {
    title: 'Prompt for input',
    description: '',
    image: require('../../public/assets/infographics/input.png'),
  },
  {
    title: '︎Prompt for environment variables',
    description: '',
    image: require('../../public/assets/infographics/envs.png'),
  },
  {
    title: '︎Load npm libraries',
    description: '',
    image: require('../../public/assets/infographics/npm.png'),
  },
  {
    title: 'Share scripts directly from the prompt',
    description: '',
    image: require('../../public/assets/infographics/share.png'),
  },
  {
    title: '︎Scripts behave the same in your terminal',
    description: '',
    image: require('../../public/assets/infographics/cli.png'),
  },
  {
    title: '︎Interact with selected files',
    description: '',
    image: require('../../public/assets/infographics/selected.png'),
  },
]

const Infographics = () => {
  return (
    <section className="flex flex-col space-y-24">
      {features.map(({title, description, image}, i) => {
        return (
          <div
            key={title}
            className={`flex md:flex-row flex-col-reverse items-center md:space-x-14 ${classNames(
              {
                'md:flex-row-reverse': i % 2,
              },
            )}`}
          >
            <figure className="max-w-xl flex items-center justify-center">
              <Image placeholder="blur" quality={100} src={image} alt="" />
            </figure>
            <div className="md:text-left text-center md:pb-0 pb-4">
              <h4 className="md:text-3xl text-2xl leading-tighter font-semibold">
                {title}
              </h4>
              {!isEmpty(description) && (
                <ReactMarkdown className="prose pt-4 opacity-80">
                  {description}
                </ReactMarkdown>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default Infographics
