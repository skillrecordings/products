import {GetServerSideProps} from 'next'
import {Feed} from 'feed'
import config from '../config'
import {getAllArticles} from '../lib/articles'
import {tracer, setupHttpTracing} from '@skillrecordings/honeycomb-tracer'

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
    feed.addItem({
      title: item.title,
      link: `${hostUrl}/${item.slug}`,
      description: blocksToText(item.preview),
      date: new Date(item.date),
    })
  })

  return feed
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {res, req} = context
  setupHttpTracing({
    name: getServerSideProps.name,
    tracer,
    req,
    res,
  })
  if (res) {
    const articles = await getAllArticles()

    const feed = buildFeed(articles)
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
