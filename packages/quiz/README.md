### Examples

**Basic**

```jsx
import {useQuestion, questionToShow} from '@skillrecordings/quiz'
import {QuestionResource} from '@skillrecordings/types'

const currentQuestion: QuestionResource = {
  question: 'Lorem ipsum dolor sit amet?',
  type: 'essay',
}

const question = useQuestion({
  currentQuestion,
})

return questionToShow(question)
```

**Question set**

```jsx
import {useQuestion, questionToShow, getConfig} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'

const questionSet: QuestionSet = {
  welcome: {
    question: `Lorem ipsum dolor sit amet?`,
    type: `essay`,
    tagId: 1234567,
  },
  exercise: {
    question: `Lorem ipsum dlor sit amet?`,
    type: `multiple-choice`,
    tagId: 1234567,
    correct: 'yes',
    answer: `Lorem ipsum dolor sit amet.`,
    choices: [
      {
        answer: 'yes',
        label: 'Yes',
      },
      {
        answer: 'no',
        label: 'No',
      },
    ],
  },
}

const currentQuestion = get(questionSet, 'welcome')

const question = useQuestion({
  currentQuestion,
  questionSet,
  config: getConfig('Product Title', 'Joe Doe'),
})

return questionToShow(question)
```

**Answer programmatically**

```jsx
const question = useQuestion({
  currentQuestion,
  currentAnswer: 'true',
})
```
