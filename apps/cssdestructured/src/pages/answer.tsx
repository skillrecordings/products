import * as React from 'react'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {Questions} from '@skillrecordings/types'
import Layout from 'components/app/layout'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {nord as theme} from 'react-syntax-highlighter/dist/cjs/styles/prism'

const Answer = ({questions}: any) => {
  return (
    <Layout noIndex meta={{title: 'Quiz'}}>
      <QuizAnswerPage
        questions={questions}
        author={'Emma Bostian'}
        title="CSS Destructured"
        markdownProps={{
          components: {
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  className="text-sm"
                  customStyle={{
                    background: 'rgba(0,0,0,0.5)',
                  }}
                  children={String(children).replace(/\n$/, '')}
                  style={theme}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
          },
        }}
      />
    </Layout>
  )
}

export async function getStaticProps() {
  // pass the questions in as static (or dynamic!) props
  const questions: Questions = {
    rendering: {
      question: `
### Given the following HTML and CSS code, select the correct render tree.

~~~html
<style>
	.title {
		color: blue;
		font-size: 1.2rem;
	}

	#about-me {
		font-family: 'Tahoma', sans-serif;
	}

	img {
		width: 200px;
		height: 350px;
	}

	h2 {
		font-weight: bold;
	}
</style>

<main>
	<h1 class='title'>Welcome to my site!</h1>
	<p id='about-me'>Here you can find information about me!</p>
	<img src='/photo.jpg' alt='My photo' />
</main>
~~~
`,
      type: `multiple-choice`,
      tagId: 1234567,
      correct: 'a',
      answer: `This is an answer.`,
      choices: [
        {
          answer: 'a',
          image:
            'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1634565007/css-destructured-quiz/01-a.png',
        },
        {
          answer: 'b',
          image:
            'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1634565007/css-destructured-quiz/01-b.png',
        },
        {
          answer: 'c',
          image:
            'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1634565007/css-destructured-quiz/01-c.png',
        },
        {
          answer: 'd',
          image:
            'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1634565007/css-destructured-quiz/01-d.png',
        },
      ],
    },
  }
  return {
    props: {questions},
  }
}

export default Answer
