## Overview

The `quiz` package lets us add quiz questions to email sequences by linking to the questions from the ends of emails and then triggering the addition of specific tags in ConvertKit.

Each of those tags can then be set up in ConvertKit to trigger the next email in the sequence. (Or anything else tags can do in ConvertKit.) This creates a better learning experience because it only sends the next email at the point someone is ready for it rather than just sending one after another regardless of whether they're ready for it.

When using the quiz questions in emails, it's important to configure ConvertKit to automatically add the `ck_subscriber_id` query string value to all links in the emails. That's how the tags are tied back to the relevant subscriber.

The Process for setting up quiz questions and connecting them in ConvertKit is [currently a work-in-progress and lives in Roam](https://roamresearch.com/#/app/egghead/page/GepByGFy4). It goes into_more details of how to set up the quiz questions and answers and how to wire everything up.

## Quiz Configuration

The top-level quiz configuration can be be found in [src/config.ts](https://github.com/skillrecordings/products/blob/main/packages/quiz/src/config.ts). It controls the product title, author, and the 'after completion messages'. The defaults are generally good, but these can be customized for individual partner products if we need to adjust the tone/voice of the messaging.

## Question & Answer Configuration

### Three Types

- **1.** `essay` will present a `textarea` for the learner to type a response
- **2a.** `multiple-choice` with one correct answer will present the options as radio buttons
- **2b.** `multiple-choice` with more than one correct answer will present the options as checkboxes

You can view complete examples below, but here's a quick overview of how it all works. The `QuestionSet` is JSON where each key represents one question. That key is then used in the URL to determine which question is displayed.

ex. `example.com/answer?question=<key>`

The questions have the following attributes to determine how they wwork:

- `question`
- `type`
- `tagId`

If the `type` is `multiple-choice`, these additional options determine how the answers are configured and handled.
- `correct`
- `answer`
- `choices`
  + `answer`
  + `label`

```
const questionSet: QuestionSet = {
  welcome: { # Question
    question: `Question?`, # The text of the question displayd to the user
    type: `essay`, # `essay` or `multiple-choice` - determines the response format
    tagId: 1234567, # The ID of the tag triggered in ConvertKit after the learner answers
  },
  exercise: { # Question key and used as the `question` query string param
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
```


## Generating Links



- Roam process notes


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

### Styles

**Import default styles**

```css
@import '@skillrecordings/quiz/dist/styles/index.css';
```
