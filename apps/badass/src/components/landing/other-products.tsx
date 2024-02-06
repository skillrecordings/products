import * as React from 'react'
import Link from 'next/link'

import Icon from 'components/icons'
import ContentSection from 'components/content-section'

const otherProducts = [
  {
    title: 'egghead.io',
    url: 'https://egghead.io/',
  },
  {
    title: 'TotalTypeScript.com',
    url: 'https://www.totaltypescript.com/',
  },
  {
    title: 'TestingJavaScript.com',
    url: 'https://testingjavascript.com/',
  },
  {
    title: 'ProTailwind.com',
    url: 'https://www.protailwind.com/',
  },
]

const OtherProducts = () => {
  return (
    <ContentSection title="other product's we've shipped" className="mt-9">
      <ul className="grid md:grid-cols-2 gap-x-3 mt-2 md:mt-4 lg:mt-2">
        {otherProducts.map((item) => {
          return (
            <li key={item.title}>
              <Link
                href={item.url}
                className="flex justify-between items-center h-[57px] lg:h-[80px] border-b border-[#5a5a5a] hover:text-badass-green-500 duration-150 text-lg lg:text-2xl font-bold px-2"
              >
                {item.title}
                <Icon
                  aria-hidden="true"
                  name="arrow-top-right"
                  className="w-6 lg:w-8 h-6 lg:h-8 shrink-0"
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </ContentSection>
  )
}

export default OtherProducts
