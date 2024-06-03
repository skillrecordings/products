import * as React from 'react'
import {useApp} from './provider'

function PostView({post, onLikeClick}) {
  const {authors, user, likes} = useApp()

  const author = authors.find(({id}) => id === post.authorId)
  const postLikes = likes.filter(({postId}) => postId === post.id)
  const userLiked = postLikes.some((l) => l.ownerId === user.id)

  return (
    <article className="mt-2 rounded-md bg-background p-4">
      <h4 className="prose-reset text-2xl font-bold">{post.title}</h4>
      <div className="text-er-gray-600">by {author.name}</div>
      <p>{post.content}</p>
      <div className="border-t border-er-gray-200 pt-4">
        <button
          onClick={onLikeClick}
          title={userLiked ? 'Unlike this post' : 'Like this post'}
          className="post-app-like-button rounded-md px-3 py-1 transition-all duration-150 ease-in-out"
        >
          {userLiked ? '❤️' : '♡'} {postLikes.length}
        </button>
      </div>
    </article>
  )
}

export {PostView}
