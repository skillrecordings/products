import * as React from 'react'
import {Tweet} from 'mdx-embed'
import {useTheme} from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import Blockquote from './blockquote'
import ContributorProfile from './contributor-profile'
import ClientProfile from './client-profile'

const TweetWrapper = (props: any) => {
  const {resolvedTheme} = useTheme()
  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? (
    <div className="rounded-xl overflow-hidden">
      <Tweet {...props} theme={resolvedTheme} />
    </div>
  ) : null
}

const mdxComponents = () => {
  return {
    Tweet: (props: any) => <TweetWrapper {...props} />,
    Image,
    blockquote: (props: any) => <Blockquote {...props} />,
    ContributorProfile,
    ClientProfile,
    Link,
  }
}

export default mdxComponents
