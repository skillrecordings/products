import * as React from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'
import ContributorProfile from './contributor-profile'
import ClientProfile from './client-profile'

const mdxComponents: any = () => {
  return {
    Image,
    Blockquote: (props: any) => {
      const [hasMounted, setHasMounted] = React.useState(false)
      React.useEffect(() => {
        setHasMounted(true)
      }, [])
      const tweet = React.createElement('blockquote', props, props.children)
      return hasMounted ? tweet : null
    },
    ContributorProfile,
    ClientProfile,
    Link,
  }
}

export default mdxComponents
