import * as React from 'react'
import Layout from 'components/app/layout'
import Link from 'next/link'
import Image from 'next/image'
import cx from 'classnames'

export default function Home() {
  const caseStudies = [
    {
      title: 'Launching Epic React',
      slug: 'epic-react',
      image: require('../../public/epic-react/thumbnail@2x.png'),
      description:
        'Learn how we helped develop and launch Epic React, a series of code-along interactive workshops taught by Kent C. Dodds.',
      styles: {
        button: cx('bg-[#FAC461] text-black'),
        section: cx('bg-[#0F1B35] text-white'),
      },
      url: 'https://epicreact.dev',
    },
    {
      title: 'Launching Technical Interviews',
      slug: 'technical-interviews',
      description:
        'Learn how we helped develop and launch Technical Interviews, a one-stop shop to the technical interview process taught by Emma Bostian.',
      image: require('../../public/technical-interviews/thumbnail@2x.png'),
      styles: {
        button: cx('bg-[#FF5C46] text-white'),
        section: cx('bg-[#EFEFEF] text-[#FF5C46]'),
      },
      url: 'https://technicalinterviews.dev',
    },
  ]
  return (
    <>
      <Layout meta={{title: 'Skill Recordings'}}>
        <main className="flex flex-col">
          {caseStudies.map(({title, image, slug, styles, url, description}) => {
            return (
              <article
                key={slug}
                className={`grid sm:grid-cols-2 grid-cols-1 items-center justify-center ${styles.section}`}
              >
                <div className="flex items-center justify-center">
                  <Image src={image} alt={title} placeholder="blur" />
                </div>
                <div className="w-full flex flex-col relative z-10 lg:p-16 sm:p-10 p-8">
                  <div className="flex flex-col">
                    <h3 className="font-display uppercase sm:text-6xl text-5xl font-bold">
                      <Link href={`/${slug}`}>
                        <a>{title}</a>
                      </Link>
                    </h3>
                    {description && (
                      <p className="sm:max-w-[40ch] pt-4">{description}</p>
                    )}
                    <div className="pt-12 flex items-center space-x-2">
                      <Link href={`/${slug}`} key={title}>
                        <a
                          className={`px-5 py-4 font-medium text-sm ${styles.button}`}
                        >
                          View Case Study
                        </a>
                      </Link>
                      <a
                        href={url}
                        className="text-sm font-medium px-5 py-4"
                        role="noopener noreferrer"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit ↗︎
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </main>
      </Layout>
    </>
  )
}
