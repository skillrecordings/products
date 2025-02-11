import type {GetStaticProps} from 'next'
import {Schedule, type Speaker} from '.'
import Layout from 'components/app/layout'
import Link from 'next/link'
import {ChevronLeftIcon} from '@heroicons/react/outline'

export const getStaticProps: GetStaticProps = async () => {
  const speakers = await fetch(
    'https://sessionize.com/api/v2/wyvikoxy/view/Speakers',
  ).then((res) => res.json())
  const schedule = await fetch(
    'https://sessionize.com/api/v2/wyvikoxy/view/GridSmart',
  ).then((res) => res.json())

  return {
    props: {
      speakers,
      schedule,
    },
    revalidate: 60 * 5,
  }
}

const ConfSchedule: React.FC<{schedule: Schedule; speakers: Speaker[]}> = ({
  schedule,
  speakers,
}) => {
  return (
    <Layout
      className="bg-foreground text-background dark:bg-background dark:text-foreground"
      meta={{
        title: 'Epic Web Conf 2024 Schedule',
        titleAppendSiteName: false,
        description:
          'The Full Stack Web Development Conference of Epic proportions.',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1705997895/conf-card_2x.jpg',
        },
      }}
    >
      <main className="mx-auto flex w-full max-w-screen-lg flex-col py-16 print:py-0">
        <Link
          href="/conf"
          className="mb-5 flex items-center gap-1 px-3 text-sm text-[#93A1D7] opacity-90 transition hover:underline hover:opacity-100 print:hidden"
        >
          <ChevronLeftIcon className="w-4" aria-hidden="true" /> Epic Web Conf
          '24
        </Link>
        <Schedule
          title="Epic Web Conf 2024 Schedule"
          schedule={schedule}
          speakers={speakers}
        />
      </main>
    </Layout>
  )
}

export default ConfSchedule
