import {GetServerSideProps} from 'next'
import {Feed} from 'feed'
import config from '../config'
import {getAllArticles} from 'lib/articles'
import {getAllTips} from 'lib/tips'
import {getAllTutorials} from 'lib/tutorials'
import {getAllWorkshops} from 'lib/workshops'

const hostUrl = process.env.NEXT_PUBLIC_URL

const buildFeed = (items: any) => {
  const feed = new Feed({
    id: hostUrl,
    link: hostUrl,
    title: config.title,
    description: config.description,
    copyright: 'Copyright © ' + new Date().getFullYear() + ' ' + config.author,
    updated: new Date(items[0]._updatedAt),
    author: {
      name: config.author,
      email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
      link: hostUrl,
    },
  })

  items.forEach((item: any) => {
    const getPath = (type: string) => {
      switch (type) {
        case 'tip':
          return '/tips/'
        case 'tutorial':
          return '/tutorials/'
        case 'workshop':
          return '/workshops/'
        default:
          return '/'
      }
    }
    feed.addItem({
      title: `${item.title} (${item.moduleType || item._type})`,
      link: `${hostUrl}${getPath(item.moduleType || item._type)}${
        item.slug.current || item.slug
      }`,
      description: item.description || item.summary,
      date: new Date(item._createdAt),
      author: [
        {
          name: item?.author?.name || config.author,
          email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
        },
      ],
    })
  })

  return feed
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context && context.res) {
    const {res} = context

    const tutorials = await getAllTutorials()
    const tips = await getAllTips()
    const articles = (await getAllArticles()).filter(
      ({state}) => state === 'published',
    )
    const workshops = await getAllWorkshops()
    const sortedResources = [
      ...tutorials,
      ...tips,
      ...articles,
      ...workshops,
    ].sort((a, b) => {
      return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
    })

    const feed = buildFeed(sortedResources)
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    res.setHeader('content-type', 'text/xml')
    res.write(feed.rss2()) // NOTE: You can also use feed.atom1() or feed.json1() for other feed formats
    res.end()
  }

  return {
    props: {},
  }
}

const RssPage = () => null

export default RssPage
