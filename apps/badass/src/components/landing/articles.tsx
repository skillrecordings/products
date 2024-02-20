import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import {type Article} from 'lib/articles'
import ContentSection from 'components/content-section'
import Card from 'components/card'
import {ButtonSecondary} from 'components/buttons'

type ArticlesProps = {
  articles: Article[]
  className?: string
}

const Articles: React.FC<ArticlesProps> = ({articles, className = ''}) => {
  const latestArticle = articles.sort(
    (a, b) =>
      new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime(),
  )[0]
  const restArticles = articles
    .filter((article) => article.slug !== latestArticle.slug)
    .splice(0, 4)
  return (
    <ContentSection
      title="Badass Articles"
      subtitle="Our Key Lessons Learned Along the Way"
      subtitleClassName="md:max-w-[450px] lg:max-w-[500px] xl:max-w-none"
      className={className}
      renderAdditionalComponent={() => (
        <>
          <ButtonSecondary href="/articles" size="small" className="lg:hidden">
            View All Articles
          </ButtonSecondary>
          <ButtonSecondary
            href="/articles"
            size="middle"
            className="hidden lg:inline-flex"
          >
            View All Articles
          </ButtonSecondary>
        </>
      )}
    >
      <div className="mt-6 md:mt-10 lg:mt-20 gap-y-2 md:gap-y-0 md:gap-x-4 lg:gap-x-16 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2">
          {latestArticle && (
            <Card
              key={latestArticle._id}
              imageUrl={latestArticle.articleHeaderImage}
              title={latestArticle.title}
              description={latestArticle.description}
              href={`/${latestArticle.slug}`}
              type="article"
              ctaText="View"
              authorName={latestArticle.author}
              authorAvatarUrl={latestArticle.authorAvatar}
              featuredCardColor={latestArticle.card_color}
            />
          )}
        </div>
        <div className="w-full md:w-1/2">
          <ul>
            {restArticles.map((article) => {
              return (
                <li
                  key={article._id}
                  className="px-2 py-6 md:first:pt-0 border-b border-[#5a5a5a]"
                >
                  <div className="group flex">
                    <div className="grow">
                      <h3>
                        <Balancer>
                          <Link
                            className="text-lg lg:text-2xl leading-[1.16] lg:leading-[1.333] font-bold w-full hover:text-badass-green-500 transition"
                            href={`/${article.slug}`}
                          >
                            {article.title}
                          </Link>
                        </Balancer>
                      </h3>
                    </div>
                    <ButtonSecondary
                      href={`/${article.slug}`}
                      size="middle"
                      className="shrink-0 ml-12 hidden lg:inline-flex"
                    >
                      View
                    </ButtonSecondary>
                  </div>
                  <div className="flex justify-between mt-4">
                    <div className="flex space-x-2 lg:space-x-4 items-center">
                      <div className="rounded-full overflow-hidden">
                        <Image
                          src={article.authorAvatar}
                          alt={article.author}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="text-white opacity-80 uppercase font-mono tracking-[0.16px]">
                        {article.author}
                      </div>
                    </div>
                    <ButtonSecondary
                      href={`/${article.slug}`}
                      size="small"
                      className="shrink-0 ml-12 lg:hidden"
                    >
                      View
                    </ButtonSecondary>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </ContentSection>
  )
}

export default Articles
