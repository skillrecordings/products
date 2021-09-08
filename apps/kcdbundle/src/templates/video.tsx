import * as React from 'react'
import Markdown from 'react-markdown'

type Resource = {
  resource: any
}

const VideoTemplate: React.FC<Resource> = ({resource}) => {
  const {title, description} = resource
  return (
    <div className="flex py-5">
      <div>
        <iframe
          width={1920 / 2}
          height={1080 / 2}
          src="https://app.egghead.io/lessons/rxjs-use-reactive-rxjs-based-solutions-for-complex-problems/embed"
        />
        <article className="py-8">
          <h1 className="text-4xl font-extrabold">{title}</h1>
          <Markdown
            children={description}
            className="pt-4 prose dark:prose-dark prose-lg"
          />
        </article>
      </div>
      <aside className="pl-5">
        <nav>Aside Nav</nav>
      </aside>
    </div>
  )
}

export default VideoTemplate
