import React from 'react'
import TableOfContents from 'components/portable-text/table-of-contents'
import PortableTextComponents from 'components/portable-text'
import Layout from 'components/layout'
import Share from 'components/share'
import isEmpty from 'lodash/isEmpty'
import Image from 'next/image'
import Link from 'next/link'
import {PortableText, toPlainText} from '@portabletext/react'
import {useConvertkit} from '@skillrecordings/convertkit'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import SubscribeForm from 'components/subscribe-form'
import {getOgImage} from 'utils/get-og-image'
import {isBrowser} from 'utils/is-browser'
import {type Article} from 'lib/articles'
import {format} from 'date-fns'

type ArticleTemplateProps = {
  article: Article
  hasSubscribed: boolean
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({article}) => {
  const {title, metaTitle, description, body, date, related} = article
  const shortDescription =
    description || toPlainText(body).substring(0, 150) + '...'
  const ogImage = getOgImage(title)
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout
      className="overflow-hidden"
      nav
      meta={{
        titleAppendSiteName: false,
        title: metaTitle || title,
        description: shortDescription,
        type: 'article',
        date,
        article: {
          publishedTime: date,
        },
        url: `${process.env.NEXT_PUBLIC_URL}/${article.slug}`,
        ogImage,
      }}
    >
      <ArticleMeta article={article} shortDescription={shortDescription} />
      <Header {...article} />
      <main>
        <div className="bg-slate-800/40 border-t border-slate-800/50 lg:px-0 px-5 shadow-lg">
          <TableOfContents value={body} />
        </div>
        <div className="max-w-screen-md mx-auto w-full sm:pt-10 lg:px-0 px-5 sm:pb-24 pb-10">
          <article className="pt-8 prose-a:decoration-indigo-500 hover:prose-a:decoration-indigo-300 prose-a:transition prose prose-lg prose-h2:py-8 md:prose-xl lg:prose-h2:text-5xl lg:prose-h3:text-4xl prose-headings:font-bold md:prose-code:text-sm lg:prose-code:text-[80%] md:prose-code:text-[80%] prose-code:text-[70%] max-w-none">
            <PortableText value={body} components={PortableTextComponents} />
          </article>
          <Signature />
        </div>
        {!loadingSubscriber && (
          <>{subscriber ? <Share title={title} /> : <SubscribeForm />}</>
        )}
        <RelatedResources article={article} />
      </main>
    </Layout>
  )
}

export default ArticleTemplate

const RelatedResources: React.FC<{
  article: Article
}> = ({article}) => {
  const resources = article.related

  return !isEmpty(resources) ? (
    <section className="px-5 w-full mx-auto sm:pt-14 sm:pb-32 pb-16">
      <div className="flex sm:flex-row flex-col items-start justify-between max-w-screen-md mx-auto w-full">
        <div className="sm:text-lg uppercase font-medium text-slate-400 flex-shrink-0 sm:pr-32 pt-2 sm:pb-0 pb-4">
          Continue Reading
        </div>
        <div className="flex-grow">
          {resources.map(({title, subtitle, slug}) => {
            return (
              <div key={title}>
                <Link href={`/${slug}`}>
                  <a className="lg:text-3xl text-2xl transition font-semibold hover:underline">
                    {title}
                  </a>
                </Link>
                {subtitle && (
                  <p className="lg:text-xl text-lg text-slate-400 pt-2">
                    {subtitle}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  ) : null
}

const Header: React.FC<Article> = ({
  title,
  subtitle,
  date,
  estimatedReadingTime,
}) => {
  return (
    <header className="flex flex-col items-center relative px-5 pt-24 pb-8 overflow-hidden text-white bg-slate-800/40">
      <div className="flex flex-col items-center max-w-screen-lg mx-auto w-full relative z-10">
        <Link passHref href="/articles">
          <a className="sm:text-lg text-base group text-white relative hover:text-white font-normal px-4 py-2 hover:bg-opacity-10 bg-opacity-0 bg-white rounded-lg transition opacity-80 hover:opacity-80 focus-visible:ring-white focus-visible:opacity-100">
            <span className="pr-1" role="presentation" aria-hidden="true">
              ←
            </span>{' '}
            All Articles
          </a>
        </Link>
        <div className="pt-10 pb-24 flex flex-col items-center justify-center text-center">
          <h1 className="font-heading font-bold mx-auto leading-none text-4xl sm:text-5xl lg:text-6xl py-4">
            {title}
          </h1>
          {subtitle && (
            <h2 className="pt-2 sm:text-2xl text-xl leading-tight text-indigo-400 brightness-125 max-w-xl mx-auto">
              {subtitle}
            </h2>
          )}
        </div>
        <div className="flex flex-wrap items-center sm:justify-between justify-center w-full gap-10 max-w-screen-md leading-none text-lg">
          <Author />
          <div className="flex gap-16 sm:text-left">
            <div>
              <div className="text-sm tracking-wide uppercase font-semibold text-slate-400 pb-1.5">
                Time to read
              </div>
              <div>
                <span className="text-slate-400">~</span>
                {estimatedReadingTime}m
              </div>
            </div>
            <time dateTime={date}>
              <div className="text-sm tracking-wide uppercase font-semibold text-slate-400 pb-1.5">
                published
              </div>
              <div>{format(new Date(date), 'dd MMMM, y')}</div>
            </time>
          </div>
        </div>
      </div>
    </header>
  )
}

const Author = () => {
  return (
    <div className="flex items-center md:justify-start justify-center md:col-span-3 col-span-3">
      <Image
        src={require('../../public/assets/simon-vrachliotis.png')}
        alt="Simon Vrachliotis"
        width={64}
        height={64}
        placeholder="blur"
        priority
        loading="eager"
      />
      <a
        href="https://twitter.com/simonswiss"
        className="pl-2 leading-none hover:underline decoration-indigo-500 underline-offset-1"
        target="_blank"
        rel="noopener noreferrer"
      >
        Simon Vrachliotis
      </a>
    </div>
  )
}

const Signature = () => {
  return (
    <svg
      aria-hidden="true"
      className="w-28 mt-8 text-slate-300"
      viewBox="0 0 102 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.85697 28.611C2.10333 28.8813 2.40115 28.9867 2.657 28.9668L8.29568 28.655C8.55153 28.635 8.69895 28.4626 8.48458 28.1898C8.33666 27.9439 7.9329 27.718 7.64507 27.7405C6.2329 27.7865 4.05319 27.8924 2.74196 27.9948C2.39016 28.0223 2.07285 28.0793 1.84898 28.0968C1.59313 28.1168 1.6476 28.4021 1.85697 28.611ZM26.2399 28.0898C23.3956 27.9259 20.098 27.3147 19.3944 25.3104C19.229 24.8407 19.1301 24.3979 19.0926 23.9182C18.8703 21.0719 20.9016 18.2426 23.9888 15.7491C25.7143 14.3594 28.9844 12.5595 31.7028 12.3471C32.7901 12.2622 33.7696 12.4431 34.5501 12.9613C35.1682 13.46 35.4521 14.2101 35.522 15.1055C35.6269 16.4487 35.2082 18.0903 34.59 19.6508C34.3352 20.5073 35.1442 20.1546 35.6054 19.0567C36.2261 17.5281 36.6623 16.1104 36.5674 14.8952C36.4924 13.9357 36.1052 13.0972 35.2432 12.3601C33.9849 11.4931 32.4493 11.1948 30.8503 11.3197C28.1639 11.5296 25.2796 12.9132 22.9739 14.7022C20.157 16.9493 17.708 20.1974 17.9728 23.5874C18.0227 24.227 18.1711 24.8911 18.4475 25.5453C19.4888 28.1667 23.3006 28.7699 26.4353 28.9433C28.6989 29.0882 31.7376 29.2692 33.717 30.3051C29.9152 31.8891 26.3723 33.9034 24.232 36.1621C23.2196 37.2064 22.6279 38.2823 22.6414 39.2787C22.7913 41.1976 24.6912 41.6283 26.4821 41.4884C26.9938 41.4485 27.4686 41.347 27.9113 41.2481C32.4566 40.1208 37.2283 36.9487 36.931 33.1429C36.8461 32.0556 36.4269 31.2196 35.7643 30.5634L38.5136 29.5121L42.3624 28.1174C42.5813 28.036 42.6107 28.0015 42.4383 27.8541C42.133 27.6527 41.0826 27.7991 38.1609 28.703C37.0615 29.0463 35.9646 29.4216 34.8728 29.8608C32.4352 28.3137 28.4396 28.2397 26.2399 28.0898ZM35.7352 33.0755C35.8232 36.6723 31.1789 39.4162 27.652 40.3996C27.0223 40.5775 26.4517 40.6864 25.94 40.7264C24.5967 40.8313 23.6663 40.4535 23.6013 39.622C23.5489 38.9504 24.0226 38.0125 25.2144 36.7932C27.0009 34.9483 30.0026 33.0085 34.7364 30.9977C35.293 31.5334 35.6678 32.212 35.7352 33.0755ZM42.0358 30.3953C42.6959 31.0194 43.5744 31.1438 44.3714 31.0494C46.5706 30.7811 49.2836 28.0272 49.8038 26.8604C50.1326 26.1268 49.7978 25.9599 49.6798 26.0979C48.7954 27.1322 45.6052 29.9556 43.6224 30.1105C43.2706 30.1379 42.9433 30.067 42.6724 29.8951C42.1602 29.5168 42.5176 25.853 42.7534 25.5771C42.7729 25.4147 42.561 25.1739 42.1993 25.0734C41.808 25.0074 41.4907 25.0644 41.4712 25.2268C41.1619 25.798 41.0474 26.8044 41.1249 27.7958C41.2073 28.8512 41.5161 29.9211 42.0358 30.3953ZM42.1278 22.9232C42.4281 23.0606 42.8119 23.0306 42.8979 22.8952C42.9813 22.7278 43.1822 22.0042 43.2337 21.8393C43.3146 21.6399 43.2971 21.4161 43.2871 21.2881C43.3386 21.1232 43.0628 20.8874 42.6395 20.8239C42.3097 20.721 41.9629 20.8124 41.9779 21.0043L41.9514 21.489C41.9 21.6539 41.7261 22.311 41.6696 22.412C41.5197 22.5524 41.734 22.8252 42.1278 22.9232ZM49.8994 29.234C50.0254 29.6103 50.9068 30.1849 51.1452 29.9411C52.3075 28.7563 53.0706 26.9913 54.6192 25.8085C55.0045 27.0333 55.2538 27.7539 55.6286 28.4325C55.8479 28.7693 56.4806 29.0417 56.7264 28.8937C57.5449 28.2506 58.2945 27.5485 59.6412 26.2528C59.7597 26.5332 59.947 26.8725 60.1959 27.1748C60.5137 27.5361 60.8635 27.8949 61.3682 28.1772C62.1068 28.57 62.8893 28.7019 63.5609 28.6494C65.3838 28.507 67.3402 26.7776 67.7525 25.8766C68.0813 25.143 67.6455 24.9197 67.5621 25.0871C67.1743 25.8896 63.8108 27.729 62.7874 27.8089C62.3396 27.8439 61.9434 27.714 61.5741 27.5176C60.892 27.0239 60.6421 25.885 60.2724 25.2704C60.021 24.9361 59.3884 24.6638 59.177 24.8411L56.2722 27.61C55.8969 26.5131 55.8125 25.844 55.3957 25.04C55.1124 24.7082 54.5437 24.4309 54.2979 24.5788C52.9752 25.3578 51.9877 26.722 50.9633 28.0247C50.8489 26.9718 50.9319 26.3862 50.8349 25.5572C50.8984 25.1339 49.788 24.5128 49.7346 25.0639C49.6691 25.8735 49.6456 26.8084 49.7256 27.8318C49.7605 28.2796 49.83 28.7568 49.8994 29.234ZM76.607 24.5414C77.3546 24.2256 77.546 23.7923 76.621 23.8968C76.3332 23.9192 75.0959 24.1446 73.5928 24.262C72.8572 24.3195 72.0232 24.3525 71.2162 24.319C70.6915 23.7808 69.9554 23.42 69.0819 23.3595C68.4398 23.3775 68.2434 23.7468 68.1505 24.2045C68.0865 24.2095 68.057 24.244 67.9931 24.249C67.2775 24.5623 66.5659 26.1623 66.8947 27.4881C67.1246 28.3711 68.0015 29.3 69.1898 29.2715C70.6685 29.2526 71.9172 28.3506 72.0802 26.7291C72.1386 26.2418 72.0692 25.7646 71.9088 25.3589C73.8671 25.3024 75.9234 24.8522 76.607 24.5414ZM68.6877 24.9026L68.7466 24.8336C69.2169 25.0865 69.8395 25.2309 70.585 25.3014C71.1867 26.4127 70.6255 28.2906 69.2233 28.4645C68.6182 28.544 68.2389 28.2196 68.0065 27.3047C67.7767 26.4217 68.2969 25.2549 68.6877 24.9026ZM76.5895 27.5673C76.6614 28.0765 77.8033 28.2769 77.7388 27.8637L77.7133 27.1256C78.216 25.7349 80.5267 24.0099 82.8733 23.5692C82.8393 23.958 82.8348 24.3123 82.8623 24.6641C82.9073 25.2397 83.0457 25.7759 83.403 26.2307C84.0436 27.0172 85.097 27.321 86.0244 27.2486C88.2631 27.0737 90.2095 25.2163 90.8996 24.1649C91.3318 23.5198 91.149 22.8262 91.026 22.9002C90.0426 23.4918 87.4576 26.2357 85.4748 26.3906C85.059 26.4231 84.6997 26.3546 84.3599 26.1237C83.8967 25.5486 84.1536 24.3058 84.1111 23.7621C84.0736 23.2824 83.453 22.7517 82.8403 22.7352C81.0344 22.6832 78.8217 24.0144 77.7968 24.8989L77.7758 23.8065C77.7928 23.6122 77.4825 23.3468 77.2142 23.2069C76.8843 23.104 76.567 23.1609 76.5845 23.3848L76.5145 26.6079C76.4806 26.9967 76.5375 27.314 76.5895 27.5673Z"
        fill="currentColor"
      />
      <path
        d="M92.3631 19.5639L93.1941 19.499C93.6629 17.986 94.1201 17.0076 96.0775 13.8308C97.4038 11.6817 97.7532 10.4627 97.6552 9.20743C97.5336 7.65164 96.0552 6.48645 94.5348 6.60522C93.421 6.69223 92.4574 7.33669 91.9107 8.53557C91.2022 7.43475 90.1503 6.94773 89.0542 7.03335C87.4984 7.15489 86.2542 8.53276 86.3757 10.0885C86.4765 11.3791 87.105 12.5929 88.6508 14.3932C91.0588 17.2112 91.6228 18.0565 92.3631 19.5639ZM92.6496 17.994C92.0745 17.0073 91.219 15.8468 90.0859 14.5479C88.9514 13.2313 88.2185 12.2747 87.905 11.6767C87.5914 11.0786 87.4058 10.5239 87.3658 10.0112C87.287 9.00348 88.1238 8.10212 89.1315 8.0234C90.1039 7.94744 91.0295 8.63998 91.5958 10.1966L92.4975 10.1262C92.7895 8.62701 93.5867 7.67537 94.6121 7.59527C95.6375 7.51516 96.5864 8.27704 96.6651 9.28477C96.7065 9.81515 96.6107 10.4096 96.3761 11.0505C96.1416 11.6914 95.569 12.7855 94.6377 14.2991C93.7065 15.8126 93.0212 17.0579 92.6496 17.994Z"
        fill="currentColor"
      />
    </svg>
  )
}

const ArticleMeta: React.FC<{article: Article; shortDescription: string}> = ({
  article,
  shortDescription,
}) => {
  const {title, date} = article
  return (
    <ArticleJsonLd
      title={title}
      description={shortDescription}
      datePublished={date}
      url={isBrowser() ? document.location.href : process.env.NEXT_PUBLIC_URL}
      authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
      images={['']}
    />
  )
}
