import * as React from 'react'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'
import Layout from 'components/app/layout'
import getConfig from '@skillrecordings/quiz/dist/config'

const Answer: React.FC<{questionSet: QuestionSet}> = ({questionSet}) => {
  return (
    <Layout noIndex meta={{title: 'Quiz'}}>
      <div className="py-16">
        <QuizAnswerPage
          questionSet={questionSet}
          config={getConfig('CSS Destructured', 'Emma Bostian')}
        />
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // pass the questions in as static (or dynamic!) props
  const questionSet: QuestionSet = {
    rendering: {
      type: `multiple-image-choice`,
      tagId: 1234567, // TODO:
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
      correct: 'a',
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
    props: {questionSet},
  }
}

export default Answer
