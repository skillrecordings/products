import Layout from 'components/app/layout'
import LessonBody from './lesson.mdx'

const Lesson = () => {
  return (
    <Layout>
      <div className="container grid grid-cols-12">
        <aside className="col-span-3 bg-gray-100">
          <nav aria-label="lesson navigator">
            <ul>
              <li>Lesson 1</li>
              <li>Lesson 2</li>
              <li>Lesson 3</li>
            </ul>
          </nav>
        </aside>
        <main className="col-span-9 p-10">
          <nav aria-label="breadcrumb">
            <ol>
              <li>Module</li> &gt; <li>Course</li> &gt;{' '}
              <li aria-current="page">Lesson 1</li>
            </ol>
          </nav>
          <article>
            <h1>Lesson 1</h1>
            <div className="prose max-w-none">
              <LessonBody />
            </div>
          </article>
        </main>
      </div>
    </Layout>
  )
}

export default Lesson
