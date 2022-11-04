import {GetServerSideProps} from 'next'
import {Feed} from 'feed'
import config from '../config'
import {getAllArticles} from '../lib/articles'
import {getAllTips} from '../lib/tips'

const hostUrl = process.env.NEXT_PUBLIC_URL

const defaults = {nonTextBehavior: 'remove'}

function blocksToText(blocks: any[] = [], opts = {}) {
  const options = Object.assign({}, defaults, opts)
  return blocks
    .map((block: any) => {
      if (block._type !== 'block' || !block.children) {
        return options.nonTextBehavior === 'remove'
          ? ''
          : `[${block._type} block]`
      }

      return block.children.map((child: any) => child.text).join('')
    })
    .join('\n\n')
}

const buildFeed = (items: any) => {
  const feed = new Feed({
    id: hostUrl,
    link: hostUrl,
    title: config.title,
    description: config.description,
    copyright: 'Copyright © ' + new Date().getFullYear() + ' ' + config.author,
    updated: new Date(items[0].date),
    author: {
      name: config.author,
      link: hostUrl,
    },
  })

  items.forEach((item: any) => {
    const getPath = (type: string) => {
      switch (type) {
        case 'tip':
          return '/tips/'
        default:
          return '/'
      }
    }
    return feed.addItem({
      title: item.title,
      link: `${hostUrl}${getPath(item._type)}${item.slug}`,
      description: blocksToText(item.preview),
      date: item.date ? new Date(item.date) : new Date(item._createdAt),
    })
  })

  return feed
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {res} = context
  if (res) {
    const articles = await getAllArticles()
    const tips = await getAllTips()

    const feed = buildFeed([...articles, ...tips])
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
