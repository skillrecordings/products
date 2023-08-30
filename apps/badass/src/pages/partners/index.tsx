import * as React from 'react'
import Image from 'next/image'
import Layout from 'components/layout'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'
import cx from 'classnames'
import {GetStaticProps} from 'next'

import {type CaseStudy, getAllCaseStudies} from 'lib/case-studies'
import {SmallCallToActionForm} from 'components/call-to-action-form'
import {genericCallToActionContent} from 'components/landing-content'
import Card from 'components/card'

const meta = {
  title: 'Badass Partners',
  ogImage: {
    url: 'https://badass.dev/card@2x.png',
  },
}

type CaseStudiesProps = {
  caseStudies: CaseStudy[]
}

const CaseStudies: React.FC<React.PropsWithChildren<CaseStudiesProps>> = ({
  caseStudies,
}) => {
  return (
    <Layout meta={meta} className="overflow-hidden">
      <div className="container">
        <main>
          <div className="pb-16 sm:pt-10">
            <div className="space-y-10">
              {caseStudies.map((caseStudy, i: number) => {
                return (
                  // <CaseStudyCard
                  //   key={slug}
                  //   image={heroImage}
                  //   title={title}
                  //   slug={slug}
                  //   publishedDate={publishedDate}
                  //   partnerName={partnerName}
                  //   isOdd={i % 2 == 0}
                  // />
                  <Card
                    key={caseStudy._id}
                    imageUrl={caseStudy.heroImage}
                    title={caseStudy.title}
                    subtitle={caseStudy.partnerName}
                    href={`/partners/${caseStudy.slug}`}
                    type="caseStudy"
                    horizontalOrientation={true}
                    ctaText="Read Case Study"
                    publishedDate={caseStudy.publishedDate}
                    isEven={(i + 1) % 2 === 0}
                  />
                )
              })}
            </div>
          </div>
          <SmallCallToActionForm content={genericCallToActionContent} />
        </main>
      </div>
    </Layout>
  )
}

// const CaseStudyCard: React.FC<any> = ({
//   image,
//   title,
//   slug,
//   publishedDate,
//   partnerName,
//   isOdd,
// }) => {
//   return (
//     <Link
//       href={`/partners/${slug}`}
//       className={cx(
//         'rounded-xl border-2 border-badass-gray-800 px-6 py-6 md:pt-4 md:pb-0 flex flex-col duration-150 hover:bg-badass-gray-800 items-center',
//         isOdd ? 'md:flex-row' : 'md:flex-row-reverse',
//       )}
//     >
//       <div className="shrink-0 md:w-1/2 flex justify-center md:px-6">
//         <div className="max-w-[75%] md:max-w-none backdrop-grayscale">
//           <Image src={image} alt="image" width={440} height={440} />
//         </div>
//       </div>
//       <div
//         className={cx(
//           'md:w-1/2 shrink-0 md:px-6 text-center md:text-left',
//           isOdd ? 'md:pl-6' : 'lg:pl-10 xl:pl-20',
//         )}
//       >
//         <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-tight lg:leading-tight mt-2 md:mt-0">
//           <Balancer>{title}</Balancer>
//         </h2>
//         <div className="font-mono uppercase opacity-70 mt-4 lg:mt-6 text-xs lg:text-sm xl:text-base flex flex-col lg:flex-row items-center md:items-start">
//           <span>client: {partnerName}</span>
//           <span className="hidden lg:inline lg:mx-3"> &middot; </span>
//           <span>published: {publishedDate}</span>
//         </div>
//       </div>
//     </Link>
//   )
// }

export const getStaticProps: GetStaticProps = async ({params}) => {
  const caseStudies = await getAllCaseStudies()

  return {
    props: {
      caseStudies,
    },
    revalidate: 10,
  }
}

export default CaseStudies
