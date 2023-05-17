import * as React from 'react'
import Link from 'next/link'
import cx from 'classnames'
import Image from 'next/image'
import type {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'

import Icon from 'components/icons'

const AccessYourCourse: React.FunctionComponent<{
  product: SanityProduct
  className?: string
}> = ({product, className}) => {
  return (
    <section className={cx(className)}>
      <div className="container max-w-6xl mb-20">
        <div className="flex flex-col items-center">
          <div className="w-40">
            <Image
              src={product.image.url}
              alt={product.name}
              width={368}
              height={368}
            />
          </div>
          <div className="space-y-6 text-lg self-start">
            <h2 className="text-3xl md:text-4xl font-tt-regular text-center">
              Access your{' '}
              <span className="font-tt-demibold">{product.name}</span> course.
            </h2>
            <p>
              If you want to chat with other people taking this course, or have
              content questions, please head on over to the{' '}
              <a
                href="https://kcd.im/discord"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-2  border-tjs-yellow hover:bg-tjs-yellow duration-200"
              >
                KCD discord server
              </a>
              .{' '}
              <a
                href="https://discord.com/api/oauth2/authorize?client_id=738096608440483870&redirect_uri=https%3A%2F%2Ftestingjavascript.com%2F.netlify%2Ffunctions%2Fdiscord&response_type=code&scope=identify%20email%20guilds%20guilds.join"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-2  border-tjs-yellow hover:bg-tjs-yellow duration-200"
              >
                Click here if you have not yet connected your TestingJS account
                to Discord
              </a>
              .
            </p>
            <p>
              Also, don't miss{' '}
              <a
                href="https://testing-library.com/discord"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-2  border-tjs-yellow hover:bg-tjs-yellow duration-200"
              >
                the Testing Library discord server
              </a>{' '}
              if you'd like help with implementing Testing Library in your own
              project.
            </p>
            <p>
              If you are having technical issues, please email
              <a
                href="mailto:help@testingjavascript.com"
                className="border-b-2  border-tjs-yellow hover:bg-tjs-yellow duration-200"
              >
                help@testingjavascript.com
              </a>
              .
            </p>
          </div>
          <Link
            href="/"
            className="mt-12 space-x-4 inline-flex items-center bg-gray-100 text-black px-6 py-2 rounded-md hover:bg-gray-200 duration-100 min-h-[50px] border-gray-200 border"
          >
            <Icon name="play" className="w-[10px] h-[10px]" />
            <span>2020 Course Update</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AccessYourCourse
