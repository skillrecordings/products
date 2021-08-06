import * as React from 'react'
import ConvertkitSubscribeForm from 'components/forms/convertkit'
import Link from 'next/link'
import Layout from 'layouts'

export default function Home() {
  return (
    <Layout>
      <div className="space-y-16">
        {content.map((section) => {
          return (
            <section className="pt-16" key={section.label}>
              <h2 className="uppercase font-semibold tracking-wide text-sm pb-4 dark:text-gray-300 text-gray-600">
                {section.label}
              </h2>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                {section?.items?.map((item: Item) => {
                  if (item.link) {
                    return (
                      <Link href={item.link} key={item.label}>
                        <a className="rounded-lg border-2 dark:hover:bg-gray-900 hover:bg-gray-100 dark:border-gray-900 border-gray-100 dark:bg-black bg-white text-3xl font-extrabold tracking-tight py-24 flex items-center justify-center flex-col transition-colors duration-100 ease-in-out min-h-[300px]">
                          {item.label}
                        </a>
                      </Link>
                    )
                  }
                  if (item.items) {
                    return (
                      <div
                        key={item.label}
                        className="rounded-lg border-2 dark:border-gray-900 border-gray-100 dark:bg-black bg-white text-2xl font-extrabold tracking-tight py-16 flex items-center justify-center flex-col transition-colors duration-100 ease-in-out min-h-[300px]"
                      >
                        <div className="text-3xl">{item?.label}</div>
                        {item.items.map((item: any) => (
                          <Link href={item.link} key={item.label}>
                            <a className="dark:hover:text-rose-300 hover:text-rose-500 font-semibold">
                              {item.label}
                            </a>
                          </Link>
                        ))}
                      </div>
                    )
                  }
                  if (item.component) {
                    return (
                      <div
                        key={item.label}
                        className="sm:p-8 p-4 border-2 dark:border-gray-900 border-gray-100 dark:bg-black bg-white rounded-lg transition-colors duration-100 ease-in-out min-h-[300px]"
                      >
                        {React.cloneElement(item.component, {
                          children: item.label,
                        })}
                      </div>
                    )
                  }
                })}
              </div>
            </section>
          )
        })}
      </div>
    </Layout>
  )
}

type Item = {
  label: string
  link?: string
  items?: Item[]
  component?: React.ReactElement
}

const content: Item[] = [
  {
    label: 'templates',
    items: [
      {
        label: 'Article',
        link: '/article',
      },
      {
        label: 'Video',
        link: '/video',
      },
    ],
  },
  {
    label: 'pages',
    items: [
      {
        label: 'Newsletter',
        items: [
          {
            label: 'Confirm',
            link: '/confirm',
          },
          {
            label: 'Confirmed',
            link: '/confirmed',
          },
          {
            label: 'Excited',
            link: '/excited',
          },
          {
            label: 'Unsubscribed',
            link: '/unsubscribed',
          },
        ],
      },
      {
        label: 'Quiz',
        link: '/answer?question=essay',
      },
      {
        label: 'Login',
        link: '/login',
      },
      {
        label: 'Thanks',
        link: '/thanks?email=example@email.com',
      },
      {
        label: 'Buy',
        link: '/buy',
      },
      {
        label: 'Invoice',
        link: '/invoice',
      },
      {
        label: 'Learn',
        link: '/learn',
      },
    ],
  },
  {
    label: 'components',
    items: [
      {
        label: 'Subscribe Form',
        component: (
          <ConvertkitSubscribeForm
            onSubmit={() => {
              window.alert('Configure me!')
            }}
          />
        ),
      },
    ],
  },
]
