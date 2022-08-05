import {LinkedInIcon, TwitterIcon} from '@skillrecordings/react'
import Image from 'next/image'

const AboutInstructor = () => {
  return (
    <div>
      <div className="flex items-center gap-5">
        <div className="rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
          <Image
            alt="Chance Strickland"
            src={require('../../public/images/chance-strickland.jpeg')}
            width={140}
            height={140}
            quality={100}
          />
        </div>
        <strong className="sm:text-3xl text-2xl">
          <p>
            Hi! I'm Chance, and I will be your <strong>Front to Back</strong>{' '}
            instructor.
          </p>
        </strong>
      </div>
      <div className="prose sm:prose-xl prose-lg prose-a:text-brand-purple prose-p:text-white max-w-md hover:prose-a:text-[#D2D2FF] prose-a:underline prose-a:underline-offset-2 prose-strong:text-white">
        <div className="space-y-6 w-full">
          <p>
            I am a software engineer building{' '}
            <a
              href="https://remix.run/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Remix
            </a>{' '}
            and the maintainer of{' '}
            <a
              href="https://reach.tech"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reach UI
            </a>
            . I've also taught hundreds of developers how to build better
            full-stack React apps with{' '}
            <a
              href="https://reacttraining.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Training
            </a>
            .
          </p>
          <p></p>
        </div>
        <div className="space-x-3 flex items-center  not-prose">
          <a
            href="https://twitter.com/chancethedev"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-300 hover:text-white transition"
          >
            <TwitterIcon className="w-5 h-5" />
            <span className="sr-only">Chance on Twitter</span>
          </a>
          <a
            href="https://www.linkedin.com/in/chaance/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-300 hover:text-white transition"
          >
            <LinkedInIcon className="w-5 h-5" />
            <span className="sr-only">Chance on LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default AboutInstructor
