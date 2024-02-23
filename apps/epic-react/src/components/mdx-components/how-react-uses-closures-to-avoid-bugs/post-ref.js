import * as React from 'react'
import {useApp} from './provider'
import {canLike} from './utils'
import {PostView} from './post-view'

function Post({post}) {
  const {user, toggleLike} = useApp()

  const postRef = React.useRef(post)
  React.useEffect(() => {
    postRef.current = post
  })

  async function handleLikeClick() {
    if (!(await canLike(postRef.current, user))) return

    toggleLike(postRef.current)
  }

  return <PostView post={post} onLikeClick={handleLikeClick} />
}

export {Post}
