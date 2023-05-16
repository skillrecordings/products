import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Layout from 'components/app/layout'
import Link from 'next/link'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import Balancer from 'react-wrap-balancer'

const Discord = () => {
  return (
    <Layout
      meta={{
        title: 'Join Colt Steele on Discord',
        openGraph: {
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_URL}/discord-card@2x.png`,
            },
          ],
        },
      }}
    >
      <main className="min-h-screen flex lg:flex-row flex-col max-w-screen-lg w-full lg:gap-0 gap-24 mx-auto lg:py-40 py-32 px-5 text-center items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full max-w-lg lg:border-r lg:border-b-0 border-b lg:pb-0 pb-24 divide-brand-cola/10 lg:pr-16">
          <div>
            <DiscordIcon className="w-16 mb-5" />
          </div>
          <h1 className="font-heading sm:text-5xl text-3xl font-bold w-full">
            <Balancer>Join Colt Steele on Discord</Balancer>
          </h1>
          <h2 className="lg:text-xl text-lg pt-8 max-w-md w-full mb-10 opacity-80">
            <Balancer>
              Join the Colt Steele Discord server to get help with your coding
              questions, meet other students, and get updates on new courses and
              projects.
            </Balancer>
          </h2>
          <Link
            className="py-5 gap-2 px-10 focus-visible:ring-2 focus-visible:ring-white flex items-center justify-center rounded text-white bg-brand-red hover:bg-opacity-100 transition font-bold text-lg hover:brightness-110 shadow-xl shadow-black/10"
            onClick={() => {
              track('clicked join discord')
            }}
            target="_blank"
            rel="noopener"
            href={process.env.NEXT_PUBLIC_DISCORD_INVITE_URL as string}
          >
            <DiscordIcon /> Join the Discord Server
          </Link>
        </div>
        <div className="w-full max-w-md mx-auto lg:pl-16">
          <PrimaryNewsletterCta id="discord" />
        </div>
      </main>
    </Layout>
  )
}

export default Discord

const DiscordIcon: React.FC<{className?: string}> = ({className = 'w-5'}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 16 16"
      aria-hidden
    >
      <title>discord</title>
      <g fill="currentColor">
        <path d="M6.552,6.712a.891.891,0,0,0,0,1.776A.852.852,0,0,0,7.368,7.6.847.847,0,0,0,6.552,6.712Zm2.92,0a.891.891,0,1,0,.816.888A.852.852,0,0,0,9.472,6.712Z" />
        <path
          d="M13.36,0H2.64A1.644,1.644,0,0,0,1,1.648V12.464a1.644,1.644,0,0,0,1.64,1.648h9.072l-.424-1.48,1.024.952.968.9L15,16V1.648A1.644,1.644,0,0,0,13.36,0ZM10.272,10.448S9.984,10.1,9.744,9.8a2.524,2.524,0,0,0,1.448-.952,4.578,4.578,0,0,1-.92.472,5.265,5.265,0,0,1-1.16.344A5.6,5.6,0,0,1,7.04,9.656a6.716,6.716,0,0,1-1.176-.344,4.683,4.683,0,0,1-.912-.472,2.488,2.488,0,0,0,1.4.944c-.24.3-.536.664-.536.664a2.9,2.9,0,0,1-2.44-1.216A10.713,10.713,0,0,1,4.528,4.568a3.956,3.956,0,0,1,2.248-.84l.08.1a5.4,5.4,0,0,0-2.1,1.048s.176-.1.472-.232a6.008,6.008,0,0,1,1.816-.5.788.788,0,0,1,.136-.016A6.769,6.769,0,0,1,8.792,4.1a6.521,6.521,0,0,1,2.408.768A5.324,5.324,0,0,0,9.208,3.856l.112-.128a3.956,3.956,0,0,1,2.248.84A10.713,10.713,0,0,1,12.72,9.232,2.924,2.924,0,0,1,10.272,10.448Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}
