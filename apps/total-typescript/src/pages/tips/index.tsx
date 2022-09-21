import React from 'react'
import Layout from 'components/app/layout'
import {GetServerSideProps} from 'next'
import {getAllTips, Tip} from 'lib/tips'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const tips = await getAllTips()

  return {
    props: {tips},
  }
}

type TipsIndex = {
  tips: Tip[]
}

const TipsIndex: React.FC<TipsIndex> = ({tips}) => {
  return tips ? (
    <Layout>
      <header className="py-48 text-center">
        <h1 className="text-4xl">TypeScript Tips</h1>
      </header>
      <main>
        {tips.map((tip) => {
          return (
            <div>
              <h2 className="text-xl">
                <Link
                  href={{
                    pathname: '/tips/[tip]',
                    query: {
                      tip: tip.slug.current,
                    },
                  }}
                >
                  <a>{tip.title}</a>
                </Link>
              </h2>
            </div>
          )
        })}
      </main>
    </Layout>
  ) : null
}

export default TipsIndex
