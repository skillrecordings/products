import React from 'react'
import Layout from 'components/app/layout'
import Link from 'next/link'

export default function ConfBoss() {
  return (
    <Layout
      meta={{
        title: 'Boss Letter',
        description:
          'Convince your boss to send your team to Epic Web Conf 2025! Copy this letter to request tickets and level up your web dev skills. 🚀 March 25–26, SLC.',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1731634239/ogImage-2025conf.jpg',
        },
      }}
    >
      <main className="mx-auto flex w-full max-w-screen-md flex-col gap-2 py-16">
        <h1 className="text-center text-3xl font-bold sm:text-4xl">
          Letter to your boss
        </h1>
        <h2 className="text-center text-lg opacity-75 sm:text-xl">
          Copy and paste this letter to your boss
        </h2>
        <article className="prose mt-10 w-full max-w-none rounded border border-border/50 bg-card p-5 shadow-lg dark:prose-invert lg:p-10">
          <h2>Dear Boss,</h2>
          <p>
            Our team is committed to building high-quality, modern web
            applications that deliver exceptional user experiences. That’s why
            we’re asking for team tickets to{' '}
            <Link href="/conf/2025">Epic Web Conf 2025</Link>, happening{' '}
            <strong>March 25–26 in Salt Lake City, Utah.</strong>
          </p>
          <p>Here’s why this matters for our team and the business:</p>
          <ul>
            <li>
              <strong>Leveling up our skills</strong> – We’ll gain real-world
              insights into modern best practices for building performant,
              scalable applications, ensuring that our team remains competitive
              and up-to-date.
            </li>
            <li>
              <strong>Direct access to experts</strong> – We’ll have the
              opportunity to interact with leaders in web development, ask
              questions, and gain practical knowledge we can apply immediately.
              People like Kent C. Dodds, Ryan Florence, Shruti Kapoor, and more
              will be there.
            </li>
            <li>
              <strong>Hands-on learning</strong> – The workshop day (March 25)
              provides deep technical dives into modern React Server Components
              that will help us build better software, faster.
            </li>
            <li>
              <strong>Networking opportunities</strong> – We’ll connect with
              other developers and industry professionals, sharing ideas,
              industry professionals, sharing ideas, learning from their
              experiences, and finding partners to work with or hire in the
              future.
            </li>
            <li>
              <strong>Immediate ROI</strong> – Everything we learn will directly
              contribute to improving our code quality, development speed, and
              the overall user experience of our applications.
            </li>
          </ul>
          <p>
            Please support our growth and ensure we’re building the best
            applications possible by purchasing our team tickets to Epic Web
            Conf 2025{' '}
            <Link
              href="https://ti.to/epicweb/epicweb-conf-2025"
              rel="external"
              target="_blank"
            >
              here
            </Link>
            . If you have any questions, we’d love to discuss how this event
            aligns with our team’s goals.
          </p>
          <p>
            We’re ready to learn, grow, and bring back valuable knowledge to
            benefit our entire company by sharing insights, best practices, and
            key takeaways with the rest of the team to maximize the impact of
            our experience. Let’s make it happen.
          </p>

          <p>Thanks!</p>
          <p>— Your Team</p>
          <p className="italic">
            P.S. There's a big discount for teams of 3 or more{' '}
            <Link
              href="https://ti.to/epicweb/epicweb-conf-2025/discount/team30-for-3"
              rel="external"
              target="_blank"
            >
              here
            </Link>
            , and Kent said he'd give us free licenses to{' '}
            <Link href="https://epicreact.dev/" rel="external" target="_blank">
              EpicReact.dev
            </Link>{' '}
            if we send 5+ people!
          </p>
        </article>
      </main>
    </Layout>
  )
}
