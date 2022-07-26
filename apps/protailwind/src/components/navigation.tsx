import React, {FunctionComponent} from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Navigation: FunctionComponent = () => {
  return (
    <nav className="py-5">
      <div className="mx-auto px-5 max-w-screen-lg flex justify-between items-center">
        <div>
          <Link href="/">
            <a className="block w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10">
              <Image
                src="/favicon.ico"
                width={40}
                height={40}
                alt="Protailwind"
              />
            </a>
          </Link>
        </div>
        <div className="flex items-center space-x-5">
          <Link href="/articles">
            <a>Articles</a>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
