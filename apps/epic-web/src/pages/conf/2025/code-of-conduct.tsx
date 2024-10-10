import React from 'react'
import {NextPage} from 'next'
import Layout from 'components/app/layout'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import {ChevronLeftIcon} from '@heroicons/react/solid'

const ConfCoCPage: React.FC<NextPage> = () => {
  return (
    <Layout
      meta={{
        title: 'Epic Web Conf Code of Conduct',
        titleAppendSiteName: false,
        description:
          'The Full Stack Web Development Conference of Epic proportions.',
        ogImage: {
          url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1728407319/epic-web/epic-web-conf-2025-v1.png',
        },
      }}
    >
      <main className="flex flex-col items-center px-5 py-16">
        <ConfLink />
        <h1 className="w-full text-center text-3xl font-bold text-black dark:text-white sm:text-4xl lg:text-5xl">
          Code of Conduct
        </h1>
        <article className="prose mx-auto mt-14 w-full dark:prose-invert sm:prose-lg prose-p:opacity-90">
          <h2>The Quick Version</h2>
          <p>
            Our conference is dedicated to providing a harassment-free
            conference experience for everyone, regardless of gender, gender
            identity and expression, age, sexual orientation, disability,
            physical appearance, body size, race, ethnicity, religion (or lack
            thereof), or technology choices. We do not tolerate harassment of
            conference participants in any form. Sexual language and imagery is
            not appropriate for any conference venue, including talks,
            workshops, parties, Twitter and other online media. Conference
            participants violating these rules may be sanctioned or expelled
            from the conference without a refund at the discretion of the
            conference organizers.
          </p>

          <h2>The Less Quick Version</h2>

          <p>
            Harassment includes offensive verbal comments related to gender,
            gender identity and expression, age, sexual orientation, disability,
            physical appearance, body size, race, ethnicity, religion,
            technology choices, sexual images in public spaces, deliberate
            intimidation, stalking, following, harassing photography or
            recording, sustained disruption of talks or other events,
            inappropriate physical contact, and unwelcome sexual attention.
          </p>

          <p>
            Participants asked to stop any harassing behavior are expected to
            comply immediately.
          </p>

          <p>
            Sponsors are also subject to the anti-harassment policy. In
            particular, sponsors should not use sexualized images, activities,
            or other material. Booth staff (including volunteers) should not use
            sexualized clothing/uniforms/costumes or otherwise create a
            sexualized environment.
          </p>

          <p>
            If a participant engages in harassing behavior, the conference
            organizers may take any action they deem appropriate, including
            warning the offender or expulsion from the conference with no
            refund.
          </p>

          <p>
            If you are being harassed, notice that someone else is being
            harassed, or have any other concerns, please contact a member of
            conference staff immediately. Conference staff can be identified as
            they'll be wearing branded clothing and/or badges.
          </p>

          <p>
            Conference staff will be happy to help participants contact
            hotel/venue security or local law enforcement, provide escorts, or
            otherwise assist those experiencing harassment to feel safe for the
            duration of the conference. We value your attendance.
          </p>

          <p>
            We expect participants to follow these rules at conference and
            workshop venues and conference-related social events.
          </p>
        </article>
      </main>
      <ConfLink />
    </Layout>
  )
}

export default ConfCoCPage

const ConfLink = () => {
  return (
    <Link
      href="/conf"
      className="mb-10 inline-flex items-center justify-center gap-2 text-primary hover:underline dark:text-[#D6DEFF]"
    >
      <ChevronLeftIcon className="w-4" />
      <span>Back to Epic Web Conference</span>
    </Link>
  )
}
