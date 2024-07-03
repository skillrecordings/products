import * as React from 'react'
import {useApp} from './provider'
import {Post as Class} from './post-class'
import {Post as Ref} from './post-ref'
import {Post as Default} from './post-default'
import {Post as ClassFix} from './post-class-fix'

function Posts({Post, currentPost, onPostClick}) {
  const {posts} = useApp()
  return (
    <div>
      <div className="inline-block overflow-hidden rounded-md">
        {posts.map((p) => (
          <button
            key={p.id}
            onClick={() => onPostClick(p)}
            className={`px-3 py-1 ${
              p.id === currentPost?.id
                ? 'bg-blue-500 text-white'
                : 'bg-background hover:bg-er-gray-200'
            } transition-all duration-150 ease-in-out`}
          >
            {p.title}
          </button>
        ))}
      </div>
      <div>{currentPost ? <Post post={currentPost} /> : null}</div>
    </div>
  )
}

function App() {
  const {posts} = useApp()
  const [currentPost, setCurrentPost] = React.useState(posts[0])
  return (
    <>
      <div>
        <div>
          <a href="https://github.com/kentcdodds/react-and-stale-closures">
            Code on GitHub
          </a>
        </div>
      </div>
      <div className="prose prose-sm mt-4 grid w-full max-w-none grid-cols-1 gap-4 rounded-lg bg-er-gray-100 px-5 pb-5 sm:grid-cols-2 sm:gap-8 sm:px-8 sm:pb-8">
        <div>
          <h3>
            <span role="img" aria-label="x">
              ❌
            </span>{' '}
            The Old Default with Classes
          </h3>
          <Posts
            Post={Class}
            currentPost={currentPost}
            onPostClick={(p) => setCurrentPost(p)}
          />
        </div>
        <div>
          <h3>
            <span role="img" aria-label="check">
              ✅
            </span>{' '}
            The New Default with Hooks
          </h3>
          <Posts
            Post={Default}
            currentPost={currentPost}
            onPostClick={(p) => setCurrentPost(p)}
          />
        </div>
        <div>
          <h3>
            <span role="img" aria-label="x">
              ❌
            </span>{' '}
            Simulating The Old Default with Hooks
          </h3>
          <Posts
            Post={Ref}
            currentPost={currentPost}
            onPostClick={(p) => setCurrentPost(p)}
          />
        </div>
        <div>
          <h3>
            <span role="img" aria-label="check">
              ✅
            </span>{' '}
            Simulating The New Default with Classes
          </h3>
          <Posts
            Post={ClassFix}
            currentPost={currentPost}
            onPostClick={(p) => setCurrentPost(p)}
          />
        </div>
      </div>
    </>
  )
}

export default App
