import * as React from 'react'
import * as initialData from './initial-data'

const AppContext = React.createContext()

function AppProvider(props) {
  const [authors] = React.useState(initialData.authors)
  const [user] = React.useState(initialData.user)
  const [posts] = React.useState(initialData.posts)
  const [likes, setLikes] = React.useState(initialData.likes)

  function toggleLike(post) {
    const userLiked = likes.some(
      (l) => l.ownerId === user.id && l.postId === post.id,
    )
    if (userLiked) unlikePost(post)
    else likePost(post)
  }

  function likePost(post) {
    setLikes([
      ...likes,
      {id: `l${likes.length + 1}`, ownerId: user.id, postId: post.id},
    ])
  }

  function unlikePost(post) {
    setLikes(
      likes.filter((l) => !(l.ownerId === user.id && l.postId === post.id)),
    )
  }

  return (
    <AppContext.Provider
      value={{authors, user, posts, likes, toggleLike}}
      {...props}
    />
  )
}

function useApp() {
  return React.useContext(AppContext)
}

export {AppProvider, useApp, AppContext}
