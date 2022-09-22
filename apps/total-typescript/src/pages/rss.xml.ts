import {GetServerSideProps} from 'next'
import {Feed} from 'feed'
import config from '../config'
import {getAllTutorials} from '../lib/tutorials'
import {getAllTips} from 'lib/tips'

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
    updated: new Date(items[0]._updatedAt),
    author: {
      name: config.author,
      link: hostUrl,
    },
  })

  items.forEach((item: any) => {
    feed.addItem({
      // TODO: change based on content type (tips/articles/etc)
      title: `${item.title} Tutorial`,
      link: `${hostUrl}/tutorials/${item.slug.current}`,
      description: item.description,
      date: new Date(item._createdAt),
    })
  })

  return feed
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context && context.res) {
    const {res} = context

    const tutorials = await getAllTutorials()
    const tips = await getAllTips()

    const feed = buildFeed([...tutorials, ...tips] /* articles */)
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
