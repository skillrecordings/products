import * as React from 'react'
import {Tweet} from 'mdx-embed'
import Image from 'next/image'
import Link from 'next/link'

const TweetWrapper = (props: any) => {
  return (
    <div className="max-w-md">
      <Tweet {...props} />
    </div>
  )
}

const mdxComponents = () => {
  return {
    Tweet: (props: any) => <TweetWrapper {...props} />,
    Image,
    Link,
  }
}

export default mdxComponents
